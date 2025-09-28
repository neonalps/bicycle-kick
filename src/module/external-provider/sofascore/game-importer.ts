import { CreateGameRequestDto } from "@src/model/external/dto/create-game-request";
import { Game } from "@src/model/internal/game";
import { promiseAllObject } from "@src/util/common";
import { TimeSource } from "@src/util/time";
import { SofascoreGameDto } from "./types";
import { SofascoreGameProvider } from "./game-provider";

export class SofascoreGameImporter {

    private static readonly SOFASCORE_CLUB_RESULTS_BASE_URL = `https://www.sofascore.com/api/v1/team/:clubId/events/last/0`;
    private static readonly SOFASCORE_GAME_BASE_URL = `https://www.sofascore.com/api/v1/event`;

    constructor(
        private readonly sofascoreMainClubId: number,
        private readonly sofascoreGameProvider: SofascoreGameProvider,
        private readonly timeSource: TimeSource
    ) {}

    async importGameDetails(game: Game): Promise<CreateGameRequestDto> {
        const sofascoreGameId = await this.findSofascoreGameId(this.timeSource.dateToUnixTimestamp(new Date(game.kickoff)));

        const gameUrl = `${SofascoreGameImporter.SOFASCORE_GAME_BASE_URL}/${sofascoreGameId}`;

        const gameInformation = await promiseAllObject({
            event: this.fetchResponseJsonFromSofascore(gameUrl),
            managers: this.fetchResponseJsonFromSofascore(`${gameUrl}/managers`),
            lineups: this.fetchResponseJsonFromSofascore(`${gameUrl}/lineups`),
            incidents: this.fetchResponseJsonFromSofascore(`${gameUrl}/incidents`),
        });

        const sofascoreGame: SofascoreGameDto = {
            event: (gameInformation.event as any).event,
            incidents: (gameInformation.incidents as any).incidents,
            home: (gameInformation.lineups as any).home,
            away: (gameInformation.lineups as any).away,
            homeManager: (gameInformation.managers as any).homeManager,
            awayManager: (gameInformation.managers as any).awayManager,
        };

        return this.sofascoreGameProvider.provide(sofascoreGame);
    }

    private async findSofascoreGameId(kickoffUnix: number): Promise<number> {
        const results = await this.fetchResponseJsonFromSofascore(SofascoreGameImporter.SOFASCORE_CLUB_RESULTS_BASE_URL.replace(':clubId', this.sofascoreMainClubId.toString()));

        const sofascoreGame = (results as any).events?.find((item: any) => {
            return item.startTimestamp === kickoffUnix;
        });

        if (!sofascoreGame) {
            throw new Error(`Failed to find Sofascore game`);
        }

        return sofascoreGame.id as number;
    }

    private async fetchResponseJsonFromSofascore(url: string) {
        const response = await fetch(url, {
            "headers": {
                "accept": "*/*",
                "accept-language": "de-DE,de;q=0.5",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Brave\";v=\"139\", \"Chromium\";v=\"139\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
            },
            "body": null,
            "method": "GET"
        });

        return await response.json();
    }
    
}