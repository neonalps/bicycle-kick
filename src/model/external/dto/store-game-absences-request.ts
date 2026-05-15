import { StoreGameAbsenceDto } from "./store-game-absence";

export interface StoreGameAbsencesRequestDto {
    gameId: string;
    absences: StoreGameAbsenceDto[];
}