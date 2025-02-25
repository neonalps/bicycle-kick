import { BasicPersonDto } from "./basic-person";
import { GameEventDto } from "./game-event";

export interface GoalGameEvent extends GameEventDto {
    scorer: BasicPersonDto;
    assistBy?: BasicPersonDto;
    penalty: boolean;
    directFreeKick: boolean;
    bicycleKick: boolean;
    ownGoal: boolean;
    scoreMain: number;
    scoreOpponent: number;
    forMain: boolean;
}