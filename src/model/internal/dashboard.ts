import { Game } from "./game";
import { PerformanceTrend } from "./performance-trend";

export interface Dashboard {
    nextGame?: Game;
    previousGame?: Game;
    performanceTrend?: PerformanceTrend;
}