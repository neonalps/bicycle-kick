import { ClubService } from "@src/module/club/service";
import { MatchdayDetailsProvider } from "./provider";
import { ExternalProviderService } from "@src/module/external-provider/service";
import { FetchMatchdayDetailsRequest, MatchdayDetails } from "./types";
import { getOrThrow, promiseAllObject } from "@src/util/common";
import { GameService } from "@src/module/game/service";
import { GetMatchdayDetailsRequestDto } from "@src/model/external/dto/get-matchday-details-request";
import { CompetitionService } from "@src/module/competition/service";
import { SeasonService } from "@src/module/season/service";

export type MatchdayDetailsConfig = {
    mainClubId: number;
}

export class MatchdayDetailsService {

    constructor(
        private readonly config: MatchdayDetailsConfig,
        private readonly clubService: ClubService,
        private readonly competitionService: CompetitionService,
        private readonly gameService: GameService,
        private readonly externalProviderService: ExternalProviderService,
        private readonly seasonService: SeasonService,
    ) {}

    async getDetails(provider: MatchdayDetailsProvider, requestDto: GetMatchdayDetailsRequestDto): Promise<MatchdayDetails> {
        const game = await this.gameService.requireById(requestDto.gameId);

        const gameInfo = await promiseAllObject({
            season: this.seasonService.requireById(game.seasonId),
            competition: this.competitionService.requireById(game.competitionId),
        })

        const request: FetchMatchdayDetailsRequest = {
            competition: gameInfo.competition,
            season: gameInfo.season,
            competitionRound: game.competitionRound,
            competitionStage: game.competitionStage,
        };

        const matchdayDetails = await provider.provideMatchDetails(request);

        const externalProviderClubsIds = new Set<string>();

        matchdayDetails.fixtures?.forEach(fixture => {
            externalProviderClubsIds.add(fixture.home.name);
            externalProviderClubsIds.add(fixture.away.name);
        });

        matchdayDetails.table?.forEach(position => {
            externalProviderClubsIds.add(position.club.name);
        });

        const resolvedClubIds = await this.externalProviderService.getMultipleClubIdsByExternalProvider(provider.getName(), Array.from(externalProviderClubsIds));
        const clubDetailsMap = await this.clubService.getMapByIds(Array.from(resolvedClubIds.values()));

        return {
            competition: gameInfo.competition,
            season: gameInfo.season,
            fixtures: matchdayDetails.fixtures?.map(item => {
                const homeClubId = getOrThrow(resolvedClubIds, item.home.name, `failed to find ${item.home.name} in resolved club IDs`);
                const awayClubId = getOrThrow(resolvedClubIds, item.away.name, `failed to find ${item.away.name} in resolved club IDs`);

                if (homeClubId === this.config.mainClubId || awayClubId === this.config.mainClubId) {
                    // we don't need to return the main club game
                    return null;
                }

                return {
                    ...item,
                    home: getOrThrow(clubDetailsMap, homeClubId, `failed to find ${homeClubId} in club details map`),
                    away: getOrThrow(clubDetailsMap, awayClubId, `Failed to find club ${awayClubId} in club details map`),
                };
            }).filter(item => item !== null),
            table: matchdayDetails.table?.map(item => {
                const clubId = getOrThrow(resolvedClubIds, item.club.name, `failed to find ${item.club.name} in resolved club IDs`);
                return {
                    ...item,
                    club: getOrThrow(clubDetailsMap, clubId, `failed to find ${clubId} in club details map`),
                }
            }),
        };
        
    }

}