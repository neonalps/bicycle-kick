import { ManagingRole } from "@src/model/type/managing-role";

export interface CreateGameManager {
    sortOrder: number;
    gameId: number;
    personId: number;
    forMain: boolean;
    role: ManagingRole;
}