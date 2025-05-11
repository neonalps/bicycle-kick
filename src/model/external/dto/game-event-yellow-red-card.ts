import {BookableOffence} from "@src/model/type/bookable-offence";
import {GameEventDto} from "./game-event";
import { SmallPersonDto } from "./small-person";

export interface YellowRedCardGameEventDto extends GameEventDto {
    affectedPlayer?: SmallPersonDto;
    affectedManager?: SmallPersonDto;
    reason?: BookableOffence;
}