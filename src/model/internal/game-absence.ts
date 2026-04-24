import { GameAbsenceId, GameId, PersonId } from "@src/util/domain-types";
import { GameAbsenceReason, GameAbsenceType } from "../type/game-absence";

export interface GameAbsence {
    id: GameAbsenceId;
    gameId: GameId;
    personId: PersonId;
    sortOrder: number;
    absenceType: GameAbsenceType;
    absenceReason: GameAbsenceReason;
}