import { RefereeRole } from "@src/model/external/dto/referee-role";

export interface CreateGameReferee {
    sortOrder: number;
    gameId: number;
    personId: number;
    role: RefereeRole;
}