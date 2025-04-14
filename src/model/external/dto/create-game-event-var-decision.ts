import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";
import { VarDecision } from "@src/model/type/var-decision";

export interface CreateVarDecisionGameEventDto extends CreateGameEventDto {
    type: GameEventType.VarDecision;
    decision: VarDecision;
}