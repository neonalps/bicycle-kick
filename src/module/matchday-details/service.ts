import { ClubService } from "@src/module/club/service";
import { MatchdayDetailsProvider } from "./provider";
import { ExternalProviderService } from "@src/module/external-provider/service";
import { FetchMatchdayDetailsRequest, MatchdayDetails } from "./types";
import { ensureNotNullish, promiseAllObject } from "@src/util/common";
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
        this.correctResolvedClubMap(provider.getName(), new Date(game.kickoff), resolvedClubIds);
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

    private correctResolvedClubMap(provider: ExternalProvider, kickoff: Date, resolvedClubMap: Map<string, ClubId>): void {
        if (provider !== ExternalProvider.Bundesliga) {
            return;
        }

        const clubKeysToProcess = resolvedClubMap.keys();
        for (const clubKey of clubKeysToProcess) {
            const clubValue = ensureNotNullish(resolvedClubMap.get(clubKey));
            if (clubValue === 104 && kickoff < new Date(2007, 6, 1)) {
                // earlier than July 2007: Austria Kärnten -> Pasching
                resolvedClubMap.set(clubKey, 115);
            } else if (clubValue === 7 && kickoff < new Date(2005, 6, 1)) {
                // earlier than July 2005: Red Bull Salzburg -> Austria Salzburg
                resolvedClubMap.set(clubKey, 74);
            } else if (clubValue === 47 && kickoff < new Date(2002, 7, 1)) {
                // earlier than July 2002: Wacker Innsbruck -> FC Tirol
                resolvedClubMap.set(clubKey, 130);
            }
        }
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