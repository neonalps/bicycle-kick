import { ExternalPersonDto } from "./external-person";

export interface PersonInputDto {
    personId?: number;
    externalPerson?: ExternalPersonDto;
}