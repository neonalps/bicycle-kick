type MinuteTuple = [number, number];

export class GameMinute {

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

    public isAfter(other: GameMinute): boolean {
        return this.compareTo(other) === 1;
    }

    public isBefore(other: GameMinute): boolean {
        return this.compareTo(other) === -1;
    }

    private parseGameMinute(minute: string): MinuteTuple {
        if (minute === "HT") {
            return [45, 99];
        } else if (minute === "FT") {
            return [90, 99];
        } else if (minute === "AET") {
            return [120, 99];
        } else if (minute.indexOf("+") < 0) {
            return [Number(minute), 0];
        } else {
            const parts = minute.split("+");
            if (parts.length !== 2) {
                throw new Error("Illegal game minute format");
            }
            return parts.map(n => Number(n)) as MinuteTuple;
        }
    }

}