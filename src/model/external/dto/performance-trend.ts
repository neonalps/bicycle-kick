import { DetailedGameDto } from "./detailed-game";

export interface PerformanceTrendDto {
    score: number;
    games: DetailedGameDto[];
}