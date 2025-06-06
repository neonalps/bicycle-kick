export interface GamePlayer {
    id: number;
    gameId: number;
    personId: number;
    shirt: number;
    positionKey?: string;
    positionGrid?: number;
    forMain: boolean;
    sortOrder: number;
    isStarting: boolean;
    minutesPlayed: number;
    goalsScored: number;
    assists: number;
    goalsConceded: number;
    isCaptain: boolean;
    ownGoals: number;
    yellowCard: boolean;
    yellowRedCard: boolean;
    redCard: boolean;
    regulationPenaltiesTaken: number;
    regulationPenaltiesScored: number;
    regulationPenaltiesFaced: number;
    regulationPenaltiesSaved: number;
    psoPenaltiesTaken: number;
    psoPenaltiesScored: number;
    psoPenaltiesFaced: number;
    psoPenaltiesSaved: number;
}