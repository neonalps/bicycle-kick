export interface UpdatePerson {
    firstName?: string;
    lastName: string;
    avatar?: string;
    birthday?: Date;
    deathday?: Date;
    normalizedSearch: string;
    nationalities?: string[];
}