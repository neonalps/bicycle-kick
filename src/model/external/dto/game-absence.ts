import { GameAbsenceId } from "@src/util/domain-types";
import { BasicPersonDto } from "./basic-person";
import { GameAbsenceReason, GameAbsenceType } from "@src/model/type/game-absence";

export interface GameAbsenceDto {
    id: GameAbsenceId;
    person: BasicPersonDto;
    type: GameAbsenceType;
    reason: GameAbsenceReason;
}