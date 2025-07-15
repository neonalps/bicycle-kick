import { BasicGameDto } from "./basic-game";
import { PerformanceTrendDto } from "./performance-trend";

export interface DashboardResponseDto {
    lastGame?: BasicGameDto;
    upcomingGame?: BasicGameDto;
    performanceTrend?: PerformanceTrendDto;
}