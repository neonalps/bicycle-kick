import { DateString } from "@src/util/domain-types";

export interface CreatePersonRequestDto {
    lastName: string;
    firstName?: string;
    avatar?: string;
    birthday?: DateString;
    deathday?: DateString;
    nationalities?: string[];
}