import { BasicPersonDto } from "./basic-person";
import { RefereeRole } from "./referee-role";

export interface GameRefereeDto {
    id: number;
    person: BasicPersonDto;
    role: RefereeRole;
}