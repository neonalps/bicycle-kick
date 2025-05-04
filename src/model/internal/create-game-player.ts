export interface CreateGamePlayer {
    sortOrder: number;
    gameId: number;
    personId: number;
    shirt: number;
    forMain: boolean;
    isStarting: boolean;
    isCaptain: boolean;
    minutesPlayed?: number;
    positionKey?: string;
    positionGrid?: number;
    goalsScored: number;
    assists: number;
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