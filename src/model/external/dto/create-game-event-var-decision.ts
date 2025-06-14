import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";
import { VarDecision, VarDecisionReason } from "@src/model/type/var-decision";
import { PersonInputDto } from "./person-input";

export interface CreateVarDecisionGameEventDto extends CreateGameEventDto {
    type: GameEventType.VarDecision;
    decision: VarDecision;
    reason: VarDecisionReason;
    affectedPlayer: PersonInputDto;
}