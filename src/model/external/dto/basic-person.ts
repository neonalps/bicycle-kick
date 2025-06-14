export interface BasicPersonDto {
    id: number;
    lastName: string;
    firstName: string;
    avatar: string;
    birthday: Date;
    deathday?: Date;
}