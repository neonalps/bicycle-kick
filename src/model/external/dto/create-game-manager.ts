import { ManagingRole } from "@src/model/type/managing-role";
import { PersonInputDto } from "./person-input";

export interface CreateGameManagerDto {
    sortOrder: number;
    person: PersonInputDto;
    forMain: boolean;
    role: ManagingRole;
}