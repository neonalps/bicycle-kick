import { GoalType } from "@src/model/type/goal-type";
import { GameEvent } from "./game-event";

export interface GoalGameEvent extends GameEvent {
    scoredBy: number;
    assistBy: number;
    scoreMain: number;
    scoreOpponent: number;
    goalType: GoalType;
    penalty: boolean;
    ownGoal: boolean;
    directFreeKick: boolean;
    bicycleKick: boolean;
}