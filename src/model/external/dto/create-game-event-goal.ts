import { GoalType } from "@src/model/type/goal-type";
import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";

export interface CreateGoalGameEventDto extends CreateGameEventDto {
    type: GameEventType.Goal;
    scoreMain: number;
    scoreOpponent: number;
    scoredBy: number;
    assistBy: number;
    goalType: GoalType;
    penalty: boolean;
    ownGoal: boolean;
    directFreeKick: boolean;
    bicycleKick: boolean;
}