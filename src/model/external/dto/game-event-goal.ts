import { GoalType } from "@src/model/type/goal-type";
import { GameEventDto } from "./game-event";
import { SmallPersonDto } from "./small-person";
import { ScoreTuple } from "@src/model/internal/score";

export interface GoalGameEventDto extends GameEventDto {
    score: ScoreTuple;
    scoredBy: number;
    assistBy?: number;
    scoredByPerson: SmallPersonDto;
    assistByPerson?: SmallPersonDto;
    goalType: GoalType;
    penalty?: boolean;
    directFreeKick?: boolean;
    bicycleKick?: boolean;
    ownGoal?: boolean;
}