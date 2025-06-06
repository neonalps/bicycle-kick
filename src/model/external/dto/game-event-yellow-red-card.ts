import {BookableOffence} from "@src/model/type/bookable-offence";
import {GameEventDto} from "./game-event";

export interface YellowRedCardGameEventDto extends GameEventDto {
    affectedPlayer?: number;
    affectedManager?: number;
    reason?: BookableOffence;
}