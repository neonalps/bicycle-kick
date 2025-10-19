import { DateString } from "@src/util/domain-types";

export interface CreatePerson {
    firstName?: string;
    lastName: string;
    avatar?: string;
    birthday?: DateString;
    deathday?: DateString;
    normalizedSearch: string;
    nationalities?: string[];
}