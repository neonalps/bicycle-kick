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

}