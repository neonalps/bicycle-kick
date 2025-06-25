import { PlayerBaseStats } from "@src/model/internal/stats-player";
import { Tendency } from "@src/model/type/tendency";
import { assertUnreachable, isNotDefined } from "@src/util/common";

export function getEmptyPlayerBaseStats(): PlayerBaseStats {
    return {
        gamesPlayed: 0,
        gamesStarted: 0,
        goalsScored: 0,
        assists: 0,
        ownGoals: 0,
        goalsConceded: 0,
        cleanSheets: 0,
        minutesPlayed: 0,
        yellowCards: 0,
        yellowRedCards: 0,
        redCards: 0,
        regulationPenaltiesTaken: 0,
        regulationPenaltiesScored: 0,
        regulationPenaltiesFaced: 0,
        regulationPenaltiesSaved: 0,
        psoPenaltiesTaken: 0,
        psoPenaltiesScored: 0,
        psoPenaltiesFaced: 0,
        psoPenaltiesSaved: 0,
    };
}

export function combinePlayerBaseStats(first: PlayerBaseStats, second: PlayerBaseStats): PlayerBaseStats {
    return {
        gamesPlayed: first.gamesPlayed + second.gamesPlayed,
        gamesStarted: first.gamesStarted + second.gamesStarted,
        goalsScored: first.goalsScored + second.goalsScored,
        assists: first.assists + second.assists,
        ownGoals: first.ownGoals + second.ownGoals,
        goalsConceded: first.goalsConceded + second.goalsConceded,
        cleanSheets: first.cleanSheets + second.cleanSheets,
        minutesPlayed: first.minutesPlayed + second.minutesPlayed,
        yellowCards: first.yellowCards + second.yellowCards,
        yellowRedCards: first.yellowRedCards + second.yellowRedCards,
        redCards: first.redCards + second.redCards,
        regulationPenaltiesTaken: first.regulationPenaltiesTaken + second.regulationPenaltiesTaken,
        regulationPenaltiesScored: first.regulationPenaltiesScored + second.regulationPenaltiesScored,
        regulationPenaltiesFaced: first.regulationPenaltiesFaced + second.regulationPenaltiesFaced,
        regulationPenaltiesSaved: first.regulationPenaltiesSaved + second.regulationPenaltiesSaved,
        psoPenaltiesTaken: first.psoPenaltiesTaken + second.psoPenaltiesTaken,
        psoPenaltiesScored: first.psoPenaltiesScored + second.psoPenaltiesScored,
        psoPenaltiesFaced: first.psoPenaltiesFaced + second.psoPenaltiesFaced,
        psoPenaltiesSaved: first.psoPenaltiesSaved + second.psoPenaltiesSaved,
    };
}

/**
 * Returns the performance trend number for a collection of result tendencies. The number is the percentage of the maximum points possible.
 * If no result tendencies are passed -1 will be returned.
 * @param resultTendencies 
 * @returns 
 */
export function calculatePerformanceTrend(resultTendencies: ReadonlyArray<Tendency>): number {
    if (isNotDefined(resultTendencies) || resultTendencies.length === 0) {
        return -1;
    }

    const resultPoints = resultTendencies
        .map(tendency => tendency === 'w' ? 3 : tendency === 'd' ? 1 : 0)
        .reduce((acc: number, current: number) => acc + current, 0);

    return Math.floor(100 * resultPoints / (resultTendencies.length * 3));
}