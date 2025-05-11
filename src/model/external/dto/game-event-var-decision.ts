import { GameEventDto } from "./game-event";
import { VarDecision } from "@src/model/type/var-decision";
import { SmallPersonDto } from "./small-person";

export interface VarDecisionGameEventDto extends GameEventDto {
    decision: VarDecision;
    affectedPlayer: SmallPersonDto;
}