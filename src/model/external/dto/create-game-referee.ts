import { PersonInputDto } from "./person-input";
import { RefereeRole } from "./referee-role";

export interface CreateGameRefereeDto {
    sortOrder: number;
    person: PersonInputDto;
    role: RefereeRole;
}