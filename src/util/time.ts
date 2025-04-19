export class TimeSource {

    constructor() {}

    public getNow(): Date {
        return new Date();
    };
    
    public getNowPlusSeconds(seconds: number = 0): Date {
        return this.getNowPlusMilliSeconds(seconds * 1000);
    }

    public getNowPlusMilliSeconds(milliSeconds: number = 0): Date {
        return this.addMilliSeconds(this.getNow(), milliSeconds);
    }

    public addSeconds(from: Date, seconds: number = 0): Date {
        return this.addMilliSeconds(from, seconds * 1000);
    }

    public addMilliSeconds(from: Date, milliseconds: number): Date {
        return new Date(from.getTime() + milliseconds);
    }
    
    public getCurrentUnixTimestamp(): number {
        return Math.floor(Date.now() / 1000);
    }

    public getTodayStartOfDay(): Date {
        const date = this.getNow();
        date.setUTCHours(0, 0, 0, 0);
        return date;
    }

    public subtractDays(date: Date, toSubtract: number): void {
        date.setDate(date.getDate() - toSubtract);
    }

    public getYesterdayEndOfDay(): Date {
        const date = this.getNow();
        date.setUTCHours(0, 0, 0, -1);   // sets it to one millisecond before midnight
        return date;
    }

}