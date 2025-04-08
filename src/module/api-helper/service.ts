import {DetailedGameDto} from "@src/model/external/dto/detailed-game";
import {GameEventService} from "@src/module/game-event/service";
import {GamePlayerService} from "@src/module/game-player/service";
import {GameService} from "@src/module/game/service";
import {CompetitionService} from "@src/module/competition/service";
import {VenueService} from "@src/module/venue/service";
import {PersonService} from "@src/module/person/service";
import {getOrThrow, uniqueArrayElements} from "@src/util/common";
import {ClubService} from "@src/module/club/service";
import {GamePlayer} from "@src/model/internal/game-player";
import {SeasonService} from "@src/module/season/service";
import {TeamGameReportDto} from "@src/model/external/dto/game-report-team";
import {GamePlayerDto} from "@src/model/external/dto/game-player";
import {BasicPersonDto} from "@src/model/external/dto/basic-person";
import {Person} from "@src/model/internal/person";
import {Competition} from "@src/model/internal/competition";
import {CompetitionDto} from "@src/model/external/dto/competition";
import {Season} from "@src/model/internal/season";
import {SeasonDto} from "@src/model/external/dto/season";
import {BasicClubDto} from "@src/model/external/dto/basic-club";
import {Club} from "@src/model/internal/club";
import {Venue} from "@src/model/internal/venue";
import {GameVenueDto} from "@src/model/external/dto/game-venue";
import {GameEventDto} from "@src/model/external/dto/game-event";
import {GameEventType} from "@src/model/external/dto/game-event-type";
import {GoalGameEventDto} from "@src/model/external/dto/game-event-goal";

export class ApiHelperService {

    constructor(
        private readonly clubService: ClubService,
        private readonly competitionService: CompetitionService,
        private readonly gameService: GameService,
        private readonly gameEventService: GameEventService,
        private readonly gamePlayerService: GamePlayerService,
        private readonly personService: PersonService,
        private readonly seasonService: SeasonService,
        private readonly venueService: VenueService,
    ) {}

    async getMultipleGamesWithDetails(gameIds: number[]): Promise<DetailedGameDto[]> {
        const [basicGameInformation, gameEventsMap, gamePlayersMap] = await Promise.all([
            this.gameService.getMultipleByIds(gameIds),
            this.gameEventService.getOrderedEventsForGamesMap(gameIds),
            this.gamePlayerService.getPlayersForGamesMap(gameIds),
        ]);

        const clubIds = uniqueArrayElements(basicGameInformation.map(game => game.opponentId));
        const competitionIds = uniqueArrayElements(basicGameInformation.map(game => game.competitionId));
        const personIds = this.getUniquePersonIdsFromGamePlayersMap(gamePlayersMap);
        const seasonIds = uniqueArrayElements(basicGameInformation.map(game => game.seasonId));
        const venueIds = uniqueArrayElements(basicGameInformation.map(game => game.venueId));

        const [clubMap, competitionMap, personMap, seasonMap, venueMap] = await Promise.all([
            this.clubService.getMapByIds(clubIds),
            this.competitionService.getMapByIds(competitionIds),
            this.personService.getMapByIds(personIds),
            this.seasonService.getMapByIds(seasonIds),
            this.venueService.getMultipleByIds(venueIds),
        ]);

        const result: DetailedGameDto[] = [];
        for (const game of basicGameInformation) {
            const competition = getOrThrow(competitionMap, game.competitionId, "competition not found in map");
            // TODO handle parent competition?
            const season = getOrThrow(seasonMap, game.seasonId, "season not found in map");
            const opponent = getOrThrow(clubMap, game.opponentId, "opponent not found in map");
            const venue = getOrThrow(venueMap, game.venueId, "venue was not found in map");

            const gamePlayers = getOrThrow(gamePlayersMap, game.id, "game players not found in map");
            const mainTeamGameReport: TeamGameReportDto = {
                starting: [],
                substitutes: [],
                managers: [],
            };
            const opponentTeamGameReport: TeamGameReportDto = {
                starting: [],
                substitutes: [],
                managers: [],
            };
            
            for (const gamePlayer of gamePlayers) {
                const person = getOrThrow(personMap, gamePlayer.personId, "person not found in map");
                const playerDto = this.convertGamePlayerToDto(gamePlayer, this.convertPersonToBasicDto(person));
                if (gamePlayer.playsForMain) {
                    if (gamePlayer.isStarting) {
                        mainTeamGameReport.starting.push(playerDto);
                    } else {
                        mainTeamGameReport.substitutes.push(playerDto);
                    }
                } else {
                    if (gamePlayer.isStarting) {
                        opponentTeamGameReport.starting.push(playerDto);
                    } else {
                        opponentTeamGameReport.substitutes.push(playerDto);
                    }
                }
            }

            const gameEventDtos: GameEventDto[] = [];
            const gameEvents = gameEventsMap.get(game.id);
            if (gameEvents !== undefined && gameEvents.length > 0) {
                
            }

            result.push({
                id: game.id,
                kickoff: game.kickoff,
                season: this.convertSeasonToDto(season),
                opponent: this.convertClubToBasicDto(opponent),
                competition: this.convertCompetitionToDto(competition),
                venue: this.convertVenueToGameVenueDto(venue),
                round: game.competitionRound,
                attendance: game.attendance,
                resultTendency: game.resultTendency,
                status: game.status,
                fullTimeGoalsMain: game.fullTimeGoalsMain,
                fullTimeGoalsOpponent: game.fullTimeGoalsOpponent,
                halfTimeGoalsMain: game.halfTimeGoalsMain,
                halfTimeGoalsOpponent: game.halfTimeGoalsOpponent,
                aetGoalsMain: game.aetGoalsMain,
                aetGoalsOpponent: game.aetGoalsOpponent,
                psoGoalsMain: game.psoGoalsMain,
                psoGoalsOpponent: game.psoGoalsOpponent,
                isHomeGame: game.isHomeTeam,
                isNeutralGround: game.isNeutralGround,
                report: {
                    main: mainTeamGameReport,
                    opponent: opponentTeamGameReport,
                    events: gameEventDtos,
                },
                href: `/api/v1/games/${game.id}`,
            });
        }
        return result;
    }

    private convertPersonToBasicDto(person: Person): BasicPersonDto {
        return {
            ...person,
            href: `/api/v1/persons/${person.id}`,
        }
    }

    private convertClubToBasicDto(club: Club): BasicClubDto {
        return {
            id: club.id,
            name: club.name,
            shortName: club.shortName,
            iconSmall: club.iconSmall,
            iconLarge: club.iconLarge,
            href: `/api/v1/clubs/${club.id}`,
        }
    }

    private convertSeasonToDto(season: Season): SeasonDto {
        return {
            id: season.id,
            name: season.name,
            shortName: season.shortName,
            start: season.start,
            end: season.end,
        };
    }

    private convertCompetitionToDto(competition: Competition, parent?: Competition): CompetitionDto {
        const dto: CompetitionDto = {
            id: competition.id,
            name: competition.name,
            shortName: competition.shortName,
            isDomestic: competition.isDomestic,
        };

        if (parent) {
            dto.parentCompetition = this.convertCompetitionToDto(parent);
        }

        return dto;
    }

    private convertVenueToGameVenueDto(venue: Venue): GameVenueDto {
        return {
            id: venue.id,
            branding: venue.name,       // TODO fix
            city: venue.city,
            href: `/api/v1/venues/${venue.id}`,
        }
    }

    private convertGamePlayerToDto(gamePlayer: GamePlayer, player: BasicPersonDto): GamePlayerDto {
        return {
            ...gamePlayer,
            player,
        }
    }

    private getUniquePersonIdsFromGamePlayersMap(gamePlayersMap: Map<number, GamePlayer[]>): number[] {
        const personIds: number[] = [];
        for (const gamePlayers of gamePlayersMap.values()) {
            personIds.push(...gamePlayers.map(player => player.personId));
        }
        return uniqueArrayElements(personIds);
    }



}