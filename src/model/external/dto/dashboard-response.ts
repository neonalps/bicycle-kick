import { DetailedGameDto } from "./detailed-game";

export interface DashboardResponseDto {
    lastGame?: DetailedGameDto;
    upcomingGame?: DetailedGameDto;
}