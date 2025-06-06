import { GameEventType } from "@src/model/external/dto/game-event-type";
import { GoalType } from "@src/model/type/goal-type";

export type CreateGameEventDaoInterface = Omit<GameEventDaoInterface, 'id'>;

export interface GameEventDaoInterface {
    id: number;
    gameId: number;
    type: GameEventType;
    sortOrder: number;
    minute: string;
    scoreMain?: number;
    scoreOpponent?: number;
    scoredBy?: number;
    assistBy?: number;
    goalType?: GoalType;
    penalty?: boolean;
    ownGoal?: boolean;
    directFreeKick?: boolean;
    bicycleKick?: boolean;
    reason?: string;
    decision?: string;
    takenBy?: number;
    goalkeeper?: number;
    affectedPlayer?: number;
    affectedManager?: number;
    playerOn?: number;
    playerOff?: number;
    injured?: boolean;
    notOnPitch?: boolean;
    additionalMinutes?: number;
}