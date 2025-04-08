import { BasicPersonDto } from "./basic-person";
import { GameEventDto } from "./game-event";
import { VarDecision } from "@src/model/type/var-decision";

export interface VarDecisionGameEventDto extends GameEventDto {
    decision: VarDecision;
    affectedPlayer: BasicPersonDto;
}