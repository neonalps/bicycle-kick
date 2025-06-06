import { GoalType } from "@src/model/type/goal-type";
import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";
import { PersonInputDto } from "./person-input";

export interface CreateGoalGameEventDto extends CreateGameEventDto {
    type: GameEventType.Goal;
    scoredBy: PersonInputDto;
    assistBy?: PersonInputDto;
    goalType: GoalType;
    penalty: boolean;
    ownGoal: boolean;
    directFreeKick: boolean;
    bicycleKick: boolean;
}