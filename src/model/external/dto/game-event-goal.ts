import { GameEventDto } from "./game-event";

export interface GoalGameEventDto extends GameEventDto {
    scoredBy: number;
    assistBy: number;
    penalty: boolean;
    directFreeKick: boolean;
    bicycleKick: boolean;
    ownGoal: boolean;
}