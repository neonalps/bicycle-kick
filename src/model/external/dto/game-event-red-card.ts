import { ExpulsionReason } from "@src/model/type/expulsion-reason";
import { BasicPersonDto } from "./basic-person";
import { GameEventDto } from "./game-event";

export interface RedCardGameEvent extends GameEventDto {
    player: BasicPersonDto;
    reason?: ExpulsionReason;
}