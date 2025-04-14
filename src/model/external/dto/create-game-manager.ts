import { ExternalPersonDto } from "./external-person";

export interface CreateGameManagerDto {
    sortOrder: number;
    personId?: number;
    forMain: boolean;
    externalPerson?: ExternalPersonDto;
}