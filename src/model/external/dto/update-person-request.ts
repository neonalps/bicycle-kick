import { PersonId } from "@src/util/domain-types";

export interface UpdatePersonRequestDto {
    personId: PersonId;
    lastName: string;
    firstName?: string;
    avatar?: string;
    birthday?: Date;
    deathday?: Date;
    nationalities?: string[];
}