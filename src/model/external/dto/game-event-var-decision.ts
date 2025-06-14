import { GameEventDto } from "./game-event";
import { VarDecision, VarDecisionReason } from "@src/model/type/var-decision";

export interface VarDecisionGameEventDto extends GameEventDto {
    decision: VarDecision;
    reason: VarDecisionReason;
    affectedPlayer: number;
}