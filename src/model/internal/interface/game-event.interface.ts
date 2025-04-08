export interface GameEventDaoInterface {
    id: number;
    gameId: number;
    eventType: string;
    sortOrder: number;
    scoreMain: number;
    scoreOpponent: number;
    minute: string;
    scoredBy: number;
    assistBy: number;
    playerOn: number;
    playerOff: number;
    goalType: string;
    penalty: boolean;
    ownGoal: boolean;
    penaltySavedBy: number;
    directFreeKick: boolean;
    bicycleKick: boolean;
    redCardReason: string;
    injured?: boolean;
}