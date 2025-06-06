import { RefereeRole } from "./referee-role";
import { SmallPersonDto } from "./small-person";

export interface GameRefereeDto {
    id: number;
    person: SmallPersonDto;
    role: RefereeRole;
}