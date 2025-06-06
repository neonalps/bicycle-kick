import { RefereeRole } from "@src/model/external/dto/referee-role";

export interface GameReferee {
    id: number;
    gameId: number;
    personId: number;
    role: RefereeRole;
}