import { Game } from "./game";
import { PerformanceTrend } from "./performance-trend";
import { TopScorersInfo } from "./stats-player";

export interface Dashboard {
    nextGame?: Game;
    previousGame?: Game;
    performanceTrend?: PerformanceTrend;
    topScorers?: TopScorersInfo;
}