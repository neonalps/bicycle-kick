import { ExternalPersonDto } from "./external-person";

export interface CreateGamePlayerDto {
    sortOrder: number;
    personId?: number;
    shirtNo: number;
    forMain: boolean;
    isStarting: boolean;
    isCaptain: boolean;
    positionKey?: string;
    positionGrid?: number;
    externalPerson?: ExternalPersonDto;
}