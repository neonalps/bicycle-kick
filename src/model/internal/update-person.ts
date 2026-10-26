export interface UpdatePerson {
    firstName?: string;
    lastName: string;
    birthday?: Date;
    deathday?: Date;
    normalizedSearch: string;
    nationalities?: string[];
}