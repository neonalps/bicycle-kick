import { ManagingRole } from "@src/model/type/managing-role";

export interface GameManagerDaoInterface {
    id: number;
    gameId: number;
    personId: number;
    forMain: boolean;
    role: ManagingRole;
    sortOrder: number;
}