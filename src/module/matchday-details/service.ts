import { ClubService } from "@src/module/club/service";
import { MatchdayDetailsProvider } from "./provider";
import { ExternalProviderService } from "@src/module/external-provider/service";
import { FetchMatchdayDetailsRequest, MatchdayDetails } from "./types";
import { promiseAllObject } from "@src/util/common";
import { GameService } from "@src/module/game/service";
import { GetMatchdayDetailsRequestDto } from "@src/model/external/dto/get-matchday-details-request";
import { CompetitionService } from "@src/module/competition/service";
import { SeasonService } from "@src/module/season/service";
import { Club } from "@src/model/internal/club";
import { ClubId } from "@src/util/domain-types";
import { ExternalProvider } from "@src/model/type/external-provider";

export type MatchdayDetailsConfig = {
    mainClubId: number;
    clients: Map<ExternalProvider, MatchdayDetailsProvider>;
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

    async getDetails(requestDto: GetMatchdayDetailsRequestDto, preferredProvider?: ExternalProvider, throwOnUnknownClub = false): Promise<MatchdayDetails> {
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

        const provider = this.determineProviderOrThrow(request, preferredProvider);

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
                const homeClub = this.resolveClub(resolvedClubIds, clubDetailsMap, item.home.name, throwOnUnknownClub);
                const awayClub = this.resolveClub(resolvedClubIds, clubDetailsMap, item.away.name, throwOnUnknownClub);

                if (homeClub.id === this.config.mainClubId || awayClub.id === this.config.mainClubId) {
                    // we don't need to return the main club game
                    return null;
                }

                return {
                    ...item,
                    home: homeClub,
                    away: awayClub,
                };
            }).filter(item => item !== null),
            table: matchdayDetails.table?.map(item => {
                return {
                    ...item,
                    club: this.resolveClub(resolvedClubIds, clubDetailsMap, item.club.name, throwOnUnknownClub),
                }
            }),
        };
        
    }
    
    private determineProviderOrThrow(request: FetchMatchdayDetailsRequest, preferredProvider?: ExternalProvider): MatchdayDetailsProvider {
        if (preferredProvider && this.config.clients.get(preferredProvider)?.supports(request)) {
            return this.config.clients.get(preferredProvider) as MatchdayDetailsProvider;
        }

        for (const client of this.config.clients.values()) {
            if (client.supports(request)) {
                return client;
            }
        }

        throw new Error(`No suitable provider for request`);
    }

    private resolveClub(resolvedClubIds: Map<string, ClubId>, clubDetails: Map<ClubId, Club>, clubMapKey: string, throwOnUnknownClub: boolean): Club {
        const clubId = resolvedClubIds.get(clubMapKey);
        if (clubId === undefined && throwOnUnknownClub) {
            throw new Error(`failed to find ${clubMapKey} in resolved club IDs map`);
        }

        if (clubId === undefined) {
            return { name: clubMapKey, shortName: clubMapKey, id: 0, city: '', countryCode: '' };
        }

        const club = clubDetails.get(clubId);
        if (club === undefined && throwOnUnknownClub) {
            throw new Error(`failed to find ${clubId} in club details map`);
        }

        return club ? club : { name: clubMapKey, shortName: clubMapKey, id: clubId, city: '', countryCode: '' }
    }

}