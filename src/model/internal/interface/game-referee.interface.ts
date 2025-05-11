import { RefereeRole } from "@src/model/external/dto/referee-role";

export interface GameRefereeDaoInterface {
    id: number;
    gameId: number;
    personId: number;
    role: RefereeRole;
    sortOrder: number;
}