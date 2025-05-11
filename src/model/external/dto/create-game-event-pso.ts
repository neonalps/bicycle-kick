import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";
import { PersonInputDto } from "./person-input";
import { PsoResult } from "@src/model/type/pso-result";

export interface CreatePenaltyShootOutGameEventDto extends CreateGameEventDto {
    type: GameEventType.PenaltyShootOut;
    takenBy: PersonInputDto;
    result: PsoResult;
}