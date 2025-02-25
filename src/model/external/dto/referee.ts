import { BasicPersonDto } from "./basic-person"
import { RefereeRole } from "./referee-role";

export interface RefereeDto {
    referee: BasicPersonDto;
    role: RefereeRole;
}