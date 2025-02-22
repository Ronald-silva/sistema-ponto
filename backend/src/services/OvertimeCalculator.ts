import { TimeRecord, Project, Holiday, OvertimeType } from '@prisma/client';

interface OvertimeRule {
  type: OvertimeType;
  multiplier: number;
}

interface TimeRecordWithProject extends TimeRecord {
  project: Project & {
    overtimeRules: OvertimeRule[];
    holidays: Holiday[];
  };
}

interface OvertimeCalculation {
  totalRegularHours: number;
  overtimeHours: {
    weekday: number;    // 60%
    saturday: number;   // 67%
    sunday: number;     // 100%
    holiday: number;    // 100%
    nightShift: number; // 72%
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
  private static NIGHT_SHIFT_START = 22; // 22:00
  private static NIGHT_SHIFT_END = 5;    // 05:00

  static calculate(
    timeRecords: TimeRecordWithProject[],
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

    // Agrupa registros por dia
    const recordsByDay = this.groupRecordsByDay(timeRecords);

    // Processa cada dia
    for (const [dateStr, dayRecords] of Object.entries(recordsByDay)) {
      const date = new Date(dateStr);
      const dayType = this.getDayType(date, dayRecords[0].project.holidays);
      const { regularHours, overtimeHours } = this.calculateDayHours(dayRecords);

      result.totalRegularHours += regularHours;

      // Calcula horas extras baseado no tipo do dia
      if (overtimeHours > 0) {
        const nightShiftHours = this.calculateNightShiftHours(dayRecords);
        const regularOvertimeHours = overtimeHours - nightShiftHours;

        // Adiciona horas noturnas
        if (nightShiftHours > 0) {
          result.overtimeHours.nightShift += nightShiftHours;
          result.overtimeValues.nightShift += this.calculateOvertimeValue(
            nightShiftHours,
            baseHourlyRate,
            this.getMultiplier(dayRecords[0].project.overtimeRules, 'NIGHT_SHIFT')
          );
        }

        // Adiciona horas extras regulares baseado no tipo do dia
        switch (dayType) {
          case 'weekday':
            result.overtimeHours.weekday += regularOvertimeHours;
            result.overtimeValues.weekday += this.calculateOvertimeValue(
              regularOvertimeHours,
              baseHourlyRate,
              this.getMultiplier(dayRecords[0].project.overtimeRules, 'WEEKDAY')
            );
            break;
          case 'saturday':
            result.overtimeHours.saturday += regularOvertimeHours;
            result.overtimeValues.saturday += this.calculateOvertimeValue(
              regularOvertimeHours,
              baseHourlyRate,
              this.getMultiplier(dayRecords[0].project.overtimeRules, 'SATURDAY')
            );
            break;
          case 'sunday':
            result.overtimeHours.sunday += regularOvertimeHours;
            result.overtimeValues.sunday += this.calculateOvertimeValue(
              regularOvertimeHours,
              baseHourlyRate,
              this.getMultiplier(dayRecords[0].project.overtimeRules, 'SUNDAY')
            );
            break;
          case 'holiday':
            result.overtimeHours.holiday += regularOvertimeHours;
            result.overtimeValues.holiday += this.calculateOvertimeValue(
              regularOvertimeHours,
              baseHourlyRate,
              this.getMultiplier(dayRecords[0].project.overtimeRules, 'HOLIDAY')
            );
            break;
        }
      }
    }

    // Calcula o valor total
    result.overtimeValues.total = 
      result.overtimeValues.weekday +
      result.overtimeValues.saturday +
      result.overtimeValues.sunday +
      result.overtimeValues.holiday +
      result.overtimeValues.nightShift;

    return result;
  }

  private static groupRecordsByDay(records: TimeRecordWithProject[]): Record<string, TimeRecordWithProject[]> {
    const grouped: Record<string, TimeRecordWithProject[]> = {};

    records.forEach(record => {
      const dateStr = record.timestamp.toISOString().split('T')[0];
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(record);
    });

    return grouped;
  }

  private static getDayType(
    date: Date,
    holidays: Holiday[]
  ): 'weekday' | 'saturday' | 'sunday' | 'holiday' {
    // Verifica se é feriado
    const isHoliday = holidays.some(
      holiday => holiday.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );

    if (isHoliday) return 'holiday';

    // Verifica o dia da semana
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return 'sunday';
    if (dayOfWeek === 6) return 'saturday';
    return 'weekday';
  }

  private static calculateDayHours(records: TimeRecordWithProject[]): { regularHours: number; overtimeHours: number } {
    if (records.length < 2) {
      return { regularHours: 0, overtimeHours: 0 };
    }

    // Ordena registros por timestamp
    const sortedRecords = records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    let totalHours = 0;
    
    // Calcula horas trabalhadas entre cada par de registros (entrada/saída)
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

  private static calculateNightShiftHours(records: TimeRecordWithProject[]): number {
    let nightShiftHours = 0;

    // Ordena registros por timestamp
    const sortedRecords = records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Calcula horas noturnas entre cada par de registros (entrada/saída)
    for (let i = 0; i < sortedRecords.length - 1; i += 2) {
      const entry = sortedRecords[i];
      const exit = sortedRecords[i + 1];

      if (entry && exit) {
        const entryHour = entry.timestamp.getHours();
        const exitHour = exit.timestamp.getHours();

        // Caso 1: Entrada e saída no mesmo dia
        if (entryHour >= this.NIGHT_SHIFT_START) {
          // Entrada após 22h
          nightShiftHours += (24 - entryHour + Math.min(exitHour, this.NIGHT_SHIFT_END));
        } else if (exitHour <= this.NIGHT_SHIFT_END) {
          // Saída antes das 5h
          nightShiftHours += exitHour;
        } else if (entryHour < this.NIGHT_SHIFT_END) {
          // Entrada antes das 5h
          nightShiftHours += (this.NIGHT_SHIFT_END - entryHour);
        }

        // Caso 2: Virada de dia
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

  private static getMultiplier(rules: OvertimeRule[], type: OvertimeType): number {
    const rule = rules.find(r => r.type === type);
    return rule ? rule.multiplier : 1;
  }

  private static calculateOvertimeValue(
    hours: number,
    baseHourlyRate: number,
    multiplier: number
  ): number {
    return hours * baseHourlyRate * multiplier;
  }
}
