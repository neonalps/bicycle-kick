export interface PlayerStatsDaoInterface {
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