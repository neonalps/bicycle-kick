import { Dashboard } from "@src/model/internal/dashboard";
import { GameService } from "@src/module/game/service";
import { promiseAllObject } from "@src/util/common";
import { DateSource } from "@src/util/date";

export class DashboardService {

    constructor(private readonly gameService: GameService, private readonly dateSource: DateSource) {}

    async getDashboard(): Promise<Dashboard> {
        const today = this.dateSource.getToday();
        const games = await promiseAllObject({
            next: this.gameService.getNextGames(today, 1),
            previous: this.gameService.getPreviousGames(today, 1),
        });

        const dashboard: Dashboard = {};

        if (games.next.length === 1) {
            dashboard.nextGame = games.next[0];
        }

        if (games.previous.length === 1) {
            dashboard.previousGame = games.previous[0];
        }

        return dashboard;
    }
    
}