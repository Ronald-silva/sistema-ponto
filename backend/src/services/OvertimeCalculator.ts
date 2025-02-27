import { TimeRecord, Project } from '@prisma/client';

// Definindo o tipo OvertimeType localmente
type OvertimeType = 'WEEKDAY' | 'NIGHT_SHIFT' | 'SUNDAY_HOLIDAY' | 'SATURDAY' | 'SUNDAY' | 'HOLIDAY';

interface OvertimeRule {
  id: string;
  type: string;
  multiplier: number;
  description: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TimeRecordWithProject extends TimeRecord {
  project: Project & {
    overtimeRules: OvertimeRule[];
  };
}

interface OvertimeCalculation {
  totalRegularHours: number;
  overtimeHours: {
    weekday: number;
    saturday: number;
    sunday: number;
    holiday: number;
    nightShift: number;
  };
  overtimeValues: {
    weekday: number;
    saturday: number;
    sunday: number;
    holiday: number;
    nightShift: number;
    total: number;
  };
}

export class OvertimeCalculator {
  private static REGULAR_HOURS_PER_DAY = 8;
  private static NIGHT_SHIFT_START = 22;
  private static NIGHT_SHIFT_END = 5;

  static calculate(
    timeRecords: (TimeRecord & { project: Project })[],
    baseHourlyRate: number
  ): OvertimeCalculation {
    const result: OvertimeCalculation = {
      totalRegularHours: 0,
      overtimeHours: {
        weekday: 0,
        saturday: 0,
        sunday: 0,
        holiday: 0,
        nightShift: 0,
      },
      overtimeValues: {
        weekday: 0,
        saturday: 0,
        sunday: 0,
        holiday: 0,
        nightShift: 0,
        total: 0,
      },
    };

    const recordsByDay = this.groupRecordsByDay(timeRecords);

    for (const [dateStr, dayRecords] of Object.entries(recordsByDay)) {
      const date = new Date(dateStr);
      const dayType = this.getDayType(date);
      const { regularHours, overtimeHours } = this.calculateDayHours(dayRecords);

      result.totalRegularHours += regularHours;

      if (overtimeHours > 0) {
        const nightShiftHours = this.calculateNightShiftHours(dayRecords);
        const regularOvertimeHours = overtimeHours - nightShiftHours;

        if (nightShiftHours > 0) {
          result.overtimeHours.nightShift += nightShiftHours;
          result.overtimeValues.nightShift += this.calculateOvertimeValue(
            nightShiftHours,
            baseHourlyRate,
            1.72 // Multiplicador padrão para adicional noturno
          );
        }

        switch (dayType) {
          case 'weekday':
            result.overtimeHours.weekday += regularOvertimeHours;
            result.overtimeValues.weekday += this.calculateOvertimeValue(
              regularOvertimeHours,
              baseHourlyRate,
              1.6 // Multiplicador padrão para horas extras em dias úteis
            );
            break;
          case 'saturday':
            result.overtimeHours.saturday += regularOvertimeHours;
            result.overtimeValues.saturday += this.calculateOvertimeValue(
              regularOvertimeHours,
              baseHourlyRate,
              1.67 // Multiplicador padrão para horas extras aos sábados
            );
            break;
          case 'sunday':
            result.overtimeHours.sunday += regularOvertimeHours;
            result.overtimeValues.sunday += this.calculateOvertimeValue(
              regularOvertimeHours,
              baseHourlyRate,
              2.0 // Multiplicador padrão para horas extras aos domingos
            );
            break;
          case 'holiday':
            result.overtimeHours.holiday += regularOvertimeHours;
            result.overtimeValues.holiday += this.calculateOvertimeValue(
              regularOvertimeHours,
              baseHourlyRate,
              2.0 // Multiplicador padrão para horas extras em feriados
            );
            break;
        }
      }
    }

    result.overtimeValues.total =
      result.overtimeValues.weekday +
      result.overtimeValues.saturday +
      result.overtimeValues.sunday +
      result.overtimeValues.holiday +
      result.overtimeValues.nightShift;

    return result;
  }

  private static groupRecordsByDay(records: (TimeRecord & { project: Project })[]): Record<string, (TimeRecord & { project: Project })[]> {
    const grouped: Record<string, (TimeRecord & { project: Project })[]> = {};

    records.forEach(record => {
      const dateStr = record.timestamp.toISOString().split('T')[0];
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(record);
    });

    return grouped;
  }

  private static getDayType(date: Date): 'weekday' | 'saturday' | 'sunday' | 'holiday' {
    const day = date.getDay();
    if (day === 0) return 'sunday';
    if (day === 6) return 'saturday';
    return 'weekday';
  }

  private static calculateDayHours(records: (TimeRecord & { project: Project })[]): { regularHours: number; overtimeHours: number } {
    if (records.length < 2) {
      return { regularHours: 0, overtimeHours: 0 };
    }

    const sortedRecords = records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    let totalHours = 0;
    
    for (let i = 0; i < sortedRecords.length - 1; i += 2) {
      const entry = sortedRecords[i];
      const exit = sortedRecords[i + 1];
      
      if (entry && exit) {
        const hours = (exit.timestamp.getTime() - entry.timestamp.getTime()) / (1000 * 60 * 60);
        totalHours += hours;
      }
    }

    const regularHours = Math.min(totalHours, this.REGULAR_HOURS_PER_DAY);
    const overtimeHours = Math.max(0, totalHours - this.REGULAR_HOURS_PER_DAY);

    return { regularHours, overtimeHours };
  }

  private static calculateNightShiftHours(records: (TimeRecord & { project: Project })[]): number {
    let nightShiftHours = 0;

    const sortedRecords = records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    for (let i = 0; i < sortedRecords.length - 1; i += 2) {
      const entry = sortedRecords[i];
      const exit = sortedRecords[i + 1];

      if (entry && exit) {
        const entryHour = entry.timestamp.getHours();
        const exitHour = exit.timestamp.getHours();

        if (entryHour >= this.NIGHT_SHIFT_START) {
          nightShiftHours += (24 - entryHour + Math.min(exitHour, this.NIGHT_SHIFT_END));
        } else if (exitHour <= this.NIGHT_SHIFT_END) {
          nightShiftHours += exitHour;
        } else if (entryHour < this.NIGHT_SHIFT_END) {
          nightShiftHours += (this.NIGHT_SHIFT_END - entryHour);
        }

        if (exitHour < entryHour) {
          if (entryHour >= this.NIGHT_SHIFT_START) {
            nightShiftHours += (24 - entryHour + Math.min(exitHour, this.NIGHT_SHIFT_END));
          }
          if (exitHour <= this.NIGHT_SHIFT_END) {
            nightShiftHours += exitHour;
          }
        }
      }
    }

    return nightShiftHours;
  }

  private static calculateOvertimeValue(
    hours: number,
    baseHourlyRate: number,
    multiplier: number
  ): number {
    return hours * baseHourlyRate * multiplier;
  }
}
