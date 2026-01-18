import {BookableOffence} from "@src/model/type/bookable-offence";
import {GameEventDto} from "./game-event";

export interface YellowCardGameEventDto extends GameEventDto {
    affectedPlayer?: number;
    affectedManager?: number;
    reason?: BookableOffence;
    notOnPitch?: boolean;
}