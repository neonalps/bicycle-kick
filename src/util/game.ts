import { Tendency } from "@src/model/type/tendency";

interface GameResultGoals {
    fullTimeGoalsMain: number;
    fullTimeGoalsOpponent: number;
    aetGoalsMain?: number;
    aetGoalsOpponent?: number;
    psoGoalsMain?: number;
    psoGoalsOpponent?: number;
}

export function determineResultTendency(goals: GameResultGoals): Tendency {
    if (goals.psoGoalsMain !== undefined && goals.psoGoalsOpponent !== undefined) {
        return getResultTendency(goals.psoGoalsMain, goals.psoGoalsOpponent, false);
    } else if (goals.aetGoalsMain !== undefined && goals.aetGoalsOpponent !== undefined) {
        return getResultTendency(goals.aetGoalsMain, goals.aetGoalsOpponent);
    } else {
        return getResultTendency(goals.fullTimeGoalsMain, goals.fullTimeGoalsOpponent);
    }
}

function getResultTendency(main: number, opponent: number, drawPossible = true): Tendency {
    if (main > opponent) {
        return 'w';
    } else if (main < opponent) {
        return 'l';
    } else {
        if (!drawPossible) {
            throw new Error(`Game result tendency is draw but draw is not possible`);
        }

        return 'd';
    }
}

export function getGameMinutes(hasExtraTime = false): number {
    return hasExtraTime ? 120 : 90;
}