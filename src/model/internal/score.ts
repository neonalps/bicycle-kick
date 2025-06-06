import { Tendency } from "@src/model/type/tendency";

export type ScoreTuple = [number, number];

export class Score {

    private static readonly JOIN_CHAR = ":";

    private readonly tuple: ScoreTuple;

    constructor(main: number, opponent: number) {
        this.tuple = [main, opponent];
    }

    public getMain(): number {
        return this.tuple[0];
    }

    public getOpponent(): number {
        return this.tuple[1];
    }

    public equals(other: Score): boolean {
        return this.getMain() === other.getMain() && this.getOpponent() === other.getOpponent();
    }

    public getGoalDifference(): number {
        return this.getMain() - this.getOpponent();
    }

    public toString(isHome: boolean): string {
        if (isHome) {
            return [this.getMain(), this.getOpponent()].join(Score.JOIN_CHAR);
        } else {
            return [this.getOpponent(), this.getMain()].join(Score.JOIN_CHAR);
        }
    }

    public getTendency(): Tendency {
        const goalDifference = this.getGoalDifference();
        if (goalDifference > 0) {
            return 'w';
        } else if (goalDifference < 0) {
            return 'l';
        } else {
            return 'd';
        }
    }

}