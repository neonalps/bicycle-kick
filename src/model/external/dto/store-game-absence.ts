import { PersonId } from "@src/util/domain-types";
import { GameAbsenceReason } from "@src/model/type/game-absence";

export interface StoreGameAbsenceDto {
    personId: PersonId;
    absenceReason: GameAbsenceReason;
    absenceType: string;
}