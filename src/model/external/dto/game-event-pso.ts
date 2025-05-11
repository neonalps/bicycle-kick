import { PsoResult } from "@src/model/type/pso-result";
import { GameEventDto } from "./game-event";
import { SmallPersonDto } from "./small-person";
import { ScoreTuple } from "@src/model/internal/score";

export interface PenaltyShootOutGameEventDto extends GameEventDto {
    score: ScoreTuple;
    takenBy: number;
    takenByPerson: SmallPersonDto;
    result: PsoResult;
}