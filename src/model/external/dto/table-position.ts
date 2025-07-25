import { SmallClubDto } from "./small-club";

export interface TablePositionDto {
    position: number;
    club: SmallClubDto;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    gamesPlayed: number;
    wins: number;
    draws: number;
    defeats: number;
}