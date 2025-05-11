type MinuteTuple = [number, number];

export class GameMinute {

    private static readonly KEY_FULL_TIME = "FT";
    private static readonly KEY_HALF_TIME = "HT";
    private static readonly KEY_AFTER_EXTRA_TIME = "AET";
    private static readonly KEY_PSO = "PSO";
    private static readonly INDICATOR_STOPPAGE_TIME = "+";

    public static readonly FULL_TIME = new GameMinute(GameMinute.KEY_FULL_TIME);
    public static readonly HALF_TIME = new GameMinute(GameMinute.KEY_HALF_TIME);
    public static readonly AFTER_EXTRA_TIME = new GameMinute(GameMinute.KEY_AFTER_EXTRA_TIME);
    public static readonly PSO = new GameMinute(GameMinute.KEY_PSO);

    private readonly tuple: MinuteTuple;

    constructor(minute: string) {
        this.tuple = this.parseGameMinute(minute);
    }

    public getBase(): number {
        return this.tuple[0];
    }

    public getStoppage(): number {
        return this.tuple[1];
    }

    public compareTo(other: GameMinute) {
        if (this.getBase() > other.getBase()) {
            return 1;
        } else if (this.getBase() < other.getBase()) {
            return -1;
        } else if (this.getStoppage() > other.getStoppage()) {
            return 1;
        } else if (this.getStoppage() < other.getStoppage()) {
            return -1;
        } else {
            return 0;
        }
    }

    public equals(other: GameMinute): boolean {
        if (this === null || other === null) {
            return false;
        }

        return this.compareTo(other) === 0;
    }

    public toString(): string {
        if (this.equals(GameMinute.FULL_TIME)) {
            return "FT";
        } else if (this.equals(GameMinute.HALF_TIME)) {
            return "HT";
        } else if (this.equals(GameMinute.AFTER_EXTRA_TIME)) {
            return "AET";
        } else if (this.equals(GameMinute.PSO)) {
            return "PSO";
        } else if (this.getStoppage() === 0) {
            return `${this.getBase()}`;
        } else {
            return `${this.getBase()}${GameMinute.INDICATOR_STOPPAGE_TIME}${this.getStoppage()}`;
        }
    }

    public isAfter(other: GameMinute): boolean {
        return this.compareTo(other) === 1;
    }

    public isBefore(other: GameMinute): boolean {
        return this.compareTo(other) === -1;
    }

    public getMinutesPlayedValue(): number {
        return this.getBase() - (this.getStoppage() > 0 ? 0 : 1);
    }

    public isInExtraTime(): boolean {
        return this.isAfter(GameMinute.FULL_TIME) && this.isBefore(GameMinute.AFTER_EXTRA_TIME);
    }

    private parseGameMinute(minute: string): MinuteTuple {
        if (minute === GameMinute.KEY_HALF_TIME) {
            return [45, 999];
        } else if (minute === GameMinute.KEY_FULL_TIME) {
            return [90, 999];
        } else if (minute === GameMinute.KEY_AFTER_EXTRA_TIME) {
            return [120, 999];
        } else if (minute === GameMinute.KEY_PSO) {
            return [121, 0];
        } else if (minute.indexOf(GameMinute.INDICATOR_STOPPAGE_TIME) < 0) {
            return [Number(minute), 0];
        } else {
            const parts = minute.split(GameMinute.INDICATOR_STOPPAGE_TIME);
            if (parts.length !== 2) {
                throw new Error("Illegal game minute format");
            }
            return parts.map(n => Number(n)) as MinuteTuple;
        }
    }

}