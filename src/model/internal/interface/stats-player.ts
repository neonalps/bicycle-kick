import { GoalType } from "@src/model/type/goal-type";
import { ClubId, PersonId } from "@src/util/domain-types";

export interface PlayerPerformanceStatsDaoInterface {
    seasonId: number;
    competitionId: number;
    personId: number;
    gamesPlayed: string;
    goalsScored: string;
    assists: string;
    ownGoals: string;
    goalsConceded: string;
    cleanSheets: string;
    minutesPlayed: string;
    gamesStarted: string;
    yellowCards: string;
    yellowRedCards: string;
    redCards: string;
    regulationPenaltiesTaken: string;
    regulationPenaltiesScored: string;
    regulationPenaltiesFaced: string;
    regulationPenaltiesSaved: string;
    psoPenaltiesTaken: string;
    psoPenaltiesScored: string;
    psoPenaltiesFaced: string;
    psoPenaltiesSaved: string;
}

export interface PlayerGoalsAgainstClubStatsDaoInterface {
    personId: PersonId;
    clubId: ClubId;
    goalsScored: string;
}

export interface PlayerGoalTypeStatsDaoInterface {
    personId: PersonId;
    goalType: GoalType;
    goalsScored: string;
}

export interface TopScorerResultItemDaoInterface {
    personId: PersonId;
    rankingPosition: string;
    value: string;
}