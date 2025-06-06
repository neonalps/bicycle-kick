export interface PersonDaoInterface {
    id: number;
    lastName: string;
    firstName: string;
    avatar: string;
    birthday: Date;
    deathday: Date;
    normalizedSearch: string;
}