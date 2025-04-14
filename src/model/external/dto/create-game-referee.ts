import { ExternalPersonDto } from "./external-person";
import { RefereeRole } from "./referee-role";

export interface CreateGameRefereeDto {
    sortOrder: number;
    personId?: number;
    role: RefereeRole;
    externalPerson?: ExternalPersonDto;
}