import {BookableOffence} from "@src/model/type/bookable-offence";
import {GameEventDto} from "./game-event";
import { PersonInputDto } from "./person-input";

export interface YellowCardGameEventDto extends GameEventDto {
    affectedPlayer?: PersonInputDto;
    affectedManager?: PersonInputDto;
    reason?: BookableOffence;
}