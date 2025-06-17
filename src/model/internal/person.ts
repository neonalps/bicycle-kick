export interface Person {
    id: number;
    lastName: string;
    firstName: string;
    avatar: string;
    birthday: Date;
    deathday: Date;
    nationalities?: string[];
}