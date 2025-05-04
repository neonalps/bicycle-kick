import { PersonInputDto } from "./person-input";

export interface CreateGamePlayerDto {
    sortOrder: number;
    person: PersonInputDto;
    shirt: number;
    forMain: boolean;
    isStarting: boolean;
    isCaptain: boolean;
    positionKey?: string;
    positionGrid?: number;
}