import { ManagingRole } from "@src/model/type/managing-role";
import { SmallPersonDto } from "./small-person";

export interface GameManagerDto {
    id: number;
    person: SmallPersonDto;
    role: ManagingRole;
    yellowCard?: string;
    yellowRedCard?: string;
    redCard?: string;
}