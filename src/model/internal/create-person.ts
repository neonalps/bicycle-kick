export interface CreatePerson {
    firstName: string;
    lastName: string;
    avatar?: string;
    birthday?: Date;
    deathday?: Date;
    normalizedSearch: string;
}