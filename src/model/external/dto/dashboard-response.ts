import { BasicGameDto } from "./basic-game";
import { PerformanceTrendDto } from "./performance-trend";
import { PlayerCompetitionStatsDto } from "./player-competition-stats";

export interface DashboardResponseDto {
    lastGame?: BasicGameDto;
    upcomingGame?: BasicGameDto;
    performanceTrend?: PerformanceTrendDto;
    topScorers?: PlayerCompetitionStatsDto;
}