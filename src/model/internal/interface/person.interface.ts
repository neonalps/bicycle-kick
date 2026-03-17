import { DateString, PersonId } from "@src/util/domain-types";

export interface PersonDaoInterface {
    id: PersonId;
    lastName: string;
    firstName: string;
    avatar: string;
    birthday?: DateString;
    deathday?: DateString;
    normalizedSearch: string;
    nationalities: string[];
}