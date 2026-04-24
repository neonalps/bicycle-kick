import { GameAbsenceReason, GameAbsenceType } from "@src/model/type/game-absence";
import { GameAbsenceId, GameId, PersonId } from "@src/util/domain-types";

export interface GameAbsenceDaoInterface {
    id: GameAbsenceId;
    gameId: GameId;
    personId: PersonId;
    sortOrder: number;
    absenceType: GameAbsenceType;
    absenceReason: GameAbsenceReason;
}