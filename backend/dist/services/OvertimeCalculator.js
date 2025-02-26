"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvertimeCalculator = void 0;
class OvertimeCalculator {
    static calculate(timeRecords, baseHourlyRate) {
        const result = {
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
            const dayType = this.getDayType(date, dayRecords[0].project.holidays);
            const { regularHours, overtimeHours } = this.calculateDayHours(dayRecords);
            result.totalRegularHours += regularHours;
            if (overtimeHours > 0) {
                const nightShiftHours = this.calculateNightShiftHours(dayRecords);
                const regularOvertimeHours = overtimeHours - nightShiftHours;
                if (nightShiftHours > 0) {
                    result.overtimeHours.nightShift += nightShiftHours;
                    result.overtimeValues.nightShift += this.calculateOvertimeValue(nightShiftHours, baseHourlyRate, this.getMultiplier(dayRecords[0].project.overtimeRules, 'NIGHT_SHIFT'));
                }
                switch (dayType) {
                    case 'weekday':
                        result.overtimeHours.weekday += regularOvertimeHours;
                        result.overtimeValues.weekday += this.calculateOvertimeValue(regularOvertimeHours, baseHourlyRate, this.getMultiplier(dayRecords[0].project.overtimeRules, 'WEEKDAY'));
                        break;
                    case 'saturday':
                        result.overtimeHours.saturday += regularOvertimeHours;
                        result.overtimeValues.saturday += this.calculateOvertimeValue(regularOvertimeHours, baseHourlyRate, this.getMultiplier(dayRecords[0].project.overtimeRules, 'SATURDAY'));
                        break;
                    case 'sunday':
                        result.overtimeHours.sunday += regularOvertimeHours;
                        result.overtimeValues.sunday += this.calculateOvertimeValue(regularOvertimeHours, baseHourlyRate, this.getMultiplier(dayRecords[0].project.overtimeRules, 'SUNDAY'));
                        break;
                    case 'holiday':
                        result.overtimeHours.holiday += regularOvertimeHours;
                        result.overtimeValues.holiday += this.calculateOvertimeValue(regularOvertimeHours, baseHourlyRate, this.getMultiplier(dayRecords[0].project.overtimeRules, 'HOLIDAY'));
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
    static groupRecordsByDay(records) {
        const grouped = {};
        records.forEach(record => {
            const dateStr = record.timestamp.toISOString().split('T')[0];
            if (!grouped[dateStr]) {
                grouped[dateStr] = [];
            }
            grouped[dateStr].push(record);
        });
        return grouped;
    }
    static getDayType(date, holidays) {
        const isHoliday = holidays.some(holiday => holiday.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]);
        if (isHoliday)
            return 'holiday';
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0)
            return 'sunday';
        if (dayOfWeek === 6)
            return 'saturday';
        return 'weekday';
    }
    static calculateDayHours(records) {
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
    static calculateNightShiftHours(records) {
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
                }
                else if (exitHour <= this.NIGHT_SHIFT_END) {
                    nightShiftHours += exitHour;
                }
                else if (entryHour < this.NIGHT_SHIFT_END) {
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
    static getMultiplier(rules, type) {
        const rule = rules.find(r => r.type === type);
        return rule ? rule.multiplier : 1;
    }
    static calculateOvertimeValue(hours, baseHourlyRate, multiplier) {
        return hours * baseHourlyRate * multiplier;
    }
}
exports.OvertimeCalculator = OvertimeCalculator;
OvertimeCalculator.REGULAR_HOURS_PER_DAY = 8;
OvertimeCalculator.NIGHT_SHIFT_START = 22;
OvertimeCalculator.NIGHT_SHIFT_END = 5;
