import { isNotDefined } from "./common";
import { Nullish } from "./types";

const msPerDay = 1000 * 60 * 60 * 24;
const daysPerYear = 365.2425;

export class DateSource {

    getToday(): Date {
        return new Date();
    }

    getDateFromUnixTimestamp(unix: number): Date {
        return new Date(unix * 1000);
    }
    
    getUnixTimestampFromDate(input: Date): number {
        return Math.floor(input.getTime() / 1000);
    }

    getDateWithoutTime(input: Date): string {
        return input.toISOString().slice(0, 10);
    }

    getApproximateAgeOnDate(birthday: Date, onDate: Date): number {
        const diffMs = onDate.getTime() - birthday.getTime();
        const diffDays = diffMs / msPerDay;

        return diffDays / daysPerYear;
    }

    getAverageApproximateAgeOnDate(birthdays: Array<Nullish<Date>>, onDate: Date): number | null {
        if (birthdays.some(item => isNotDefined(item))) {
            return null;
        }

        return birthdays.reduce((acc, cur) => acc + this.getApproximateAgeOnDate(cur as Date, onDate), 0) / birthdays.length
    }

}