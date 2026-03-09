import { DateString } from "@src/util/domain-types";

export interface PersonDaoInterface {
    id: number;
    lastName: string;
    firstName: string;
    avatar: string;
    birthday?: DateString;
    deathday?: DateString;
    normalizedSearch: string;
    nationalities: string[];
}