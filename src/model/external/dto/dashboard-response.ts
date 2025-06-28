import { DetailedGameDto } from "./detailed-game";
import { PerformanceTrendDto } from "./performance-trend";

export interface DashboardResponseDto {
    lastGame?: DetailedGameDto;
    upcomingGame?: DetailedGameDto;
    performanceTrend?: PerformanceTrendDto;
}