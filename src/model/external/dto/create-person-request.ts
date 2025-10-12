export interface CreatePersonRequestDto {
    lastName: string;
    firstName?: string;
    avatar?: string;
    birthday?: Date;
    deathday?: Date;
    nationalities?: string[];
}