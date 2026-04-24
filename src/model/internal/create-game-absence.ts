import { GameId, PersonId } from "@src/util/domain-types";
import { GameAbsenceReason, GameAbsenceType } from "../type/game-absence";
import { Nullish } from "@src/util/types";

export interface CreateGameAbsence {
    gameId: GameId;
    personId: PersonId;
    sortOrder: Nullish<number>;
    absenceType: GameAbsenceType;
    absenceReason: GameAbsenceReason;
}