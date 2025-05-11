import {DetailedGameDto} from "@src/model/external/dto/detailed-game";
import {GameEventService} from "@src/module/game-event/service";
import {GamePlayerService} from "@src/module/game-player/service";
import {GameService} from "@src/module/game/service";
import {CompetitionService} from "@src/module/competition/service";
import {VenueService} from "@src/module/venue/service";
import {PersonService} from "@src/module/person/service";
import {getOrThrow, getUrlSlug, isDefined, uniqueArrayElements} from "@src/util/common";
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
import { ApiConfig } from "@src/api/v1/config";
import { BasicGameDto } from "@src/model/external/dto/basic-game";
import { Game } from "@src/model/internal/game";
import { Squad } from "@src/model/internal/squad";
import { SquadMemberDto } from "@src/model/external/dto/squad-member";
import { GoalGameEventDto } from "@src/model/external/dto/game-event-goal";
import { GoalGameEvent } from "@src/model/internal/game-event-goal";
import { YellowCardGameEvent } from "@src/model/internal/game-event-yellow-card";
import { YellowCardGameEventDto } from "@src/model/external/dto/game-event-yellow-card";
import { BookableOffence } from "@src/model/type/bookable-offence";
import { SubstitutionGameEvent } from "@src/model/internal/game-event-substitution";
import { SubstitutionGameEventDto } from "@src/model/external/dto/game-event-substitution";
import { InjuryTimeGameEvent } from "@src/model/internal/game-event-injury-time";
import { InjuryTimeGameEventDto } from "@src/model/external/dto/game-event-injury-time";
import { VarDecisionGameEvent } from "@src/model/internal/game-event-var-decision";
import { VarDecisionGameEventDto } from "@src/model/external/dto/game-event-var-decision";
import { VarDecision } from "@src/model/type/var-decision";
import { SmallPersonDto } from "@src/model/external/dto/small-person";
import { SmallSeasonDto } from "@src/model/external/dto/small-season";
import { SmallCompetitionDto } from "@src/model/external/dto/small-competition";
import { SmallClubDto } from "@src/model/external/dto/small-club";
import { PenaltyShootOutGameEvent } from "@src/model/internal/game-event-pso";
import { PenaltyShootOutGameEventDto } from "@src/model/external/dto/game-event-pso";
import { PsoResult } from "@src/model/type/pso-result";
import { PenaltyMissedGameEvent } from "@src/model/internal/game-event-penalty-missed";
import { PenaltyMissedGameEventDto } from "@src/model/external/dto/game-event-penalty-missed";
import { ExtraTimeGameEventDto } from "@src/model/external/dto/game-event-extra-time";
import { GameRefereeService } from "@src/module/game-referee/service";
import { GameRefereeDto } from "@src/model/external/dto/game-referee";
import { GameManagerService } from "@src/module/game-manager/service";
import { GameManagerDto } from "@src/model/external/dto/game-manager";

export class ApiHelperService {

    constructor(
        private readonly apiConfig: ApiConfig,
        private readonly clubService: ClubService,
        private readonly competitionService: CompetitionService,
        private readonly gameService: GameService,
        private readonly gameEventService: GameEventService,
        private readonly gameManagerService: GameManagerService,
        private readonly gamePlayerService: GamePlayerService,
        private readonly gameRefereeService: GameRefereeService,
        private readonly personService: PersonService,
        private readonly seasonService: SeasonService,
        private readonly venueService: VenueService,
    ) {}

    async getOrderedBasicGameDtos(games: Game[]): Promise<BasicGameDto[]> {
        const clubIds = uniqueArrayElements(games.map(game => game.opponentId));
        const competitionIds = uniqueArrayElements(games.map(game => game.competitionId));
        const seasonIds = uniqueArrayElements(games.map(game => game.seasonId));
        const venueIds = uniqueArrayElements(games.map(game => game.venueId));

        const [clubMap, competitionMap, seasonMap, venueMap] = await Promise.all([
            this.clubService.getMapByIds(clubIds),
            this.competitionService.getMapByIds(competitionIds),
            this.seasonService.getMapByIds(seasonIds),
            this.venueService.getMultipleByIds(venueIds),
        ]);

        return games.map(game => {
            const competition = getOrThrow(competitionMap, game.competitionId, "competition not found in map");
            // TODO handle parent competition?
            const season = getOrThrow(seasonMap, game.seasonId, "season not found in map");
            const opponent = getOrThrow(clubMap, game.opponentId, "opponent not found in map");
            const venue = getOrThrow(venueMap, game.venueId, "venue was not found in map");

            return {
                id: game.id,
                kickoff: game.kickoff,
                season: this.convertSeasonToSmallDto(season),
                opponent: this.convertClubToSmallDto(opponent),
                competition: this.convertCompetitionToSmallDto(competition),
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
                // TODO use config
                href: this.getFrontendResourceHref('game', getUrlSlug(game.id, `Sturm Graz vs ${opponent.shortName}`)),
            }
        });
    }

    async getOrderedDetailedGameDtos(gameIds: number[]): Promise<DetailedGameDto[]> {
        const [basicGameInformation, gameEventsMap, gameManagersMap, gamePlayersMap, gameRefereesMap] = await Promise.all([
            this.gameService.getMultipleByIds(gameIds),
            this.gameEventService.getOrderedEventsForGamesMap(gameIds),
            this.gameManagerService.getManagersForGamesMap(gameIds),
            this.gamePlayerService.getPlayersForGamesMap(gameIds),
            this.gameRefereeService.getRefereesForGamesMap(gameIds),
        ]);

        const clubIds = uniqueArrayElements(basicGameInformation.map(game => game.opponentId));
        const competitionIds = uniqueArrayElements(basicGameInformation.map(game => game.competitionId));
        const people = [
            ...Array.from(gameManagersMap.values()).flat(),
            ...Array.from(gamePlayersMap.values()).flat(),
            ...Array.from(gameRefereesMap.values()).flat(),
        ];
        const personIds = this.getUniquePersonIds(people);
        const seasonIds = uniqueArrayElements(basicGameInformation.map(game => game.seasonId));
        const venueIds = uniqueArrayElements(basicGameInformation.map(game => game.venueId));

        const [clubMap, competitionMap, personMap, seasonMap, venueMap] = await Promise.all([
            this.clubService.getMapByIds(clubIds),
            this.competitionService.getMapByIds(competitionIds),
            this.personService.getMapByIds(personIds),
            this.seasonService.getMapByIds(seasonIds),
            this.venueService.getMultipleByIds(venueIds),
        ]);
        const parentCompetitionIds = uniqueArrayElements(Array.from(competitionMap.values())
            .filter(competition => competition.parentId !== null)
            .map(competition => competition.parentId as number));
        const parentCompetitionMap = await this.competitionService.getMapByIds(parentCompetitionIds);

        const result = new Map<number, DetailedGameDto>();
        for (const game of basicGameInformation) {
            const competition = getOrThrow(competitionMap, game.competitionId, "competition not found in map");
            const parentCompetition = competition.parentId !== undefined ? parentCompetitionMap.get(competition.parentId) : null;
            const season = getOrThrow(seasonMap, game.seasonId, "season not found in map");
            const opponent = getOrThrow(clubMap, game.opponentId, "opponent not found in map");
            const venue = getOrThrow(venueMap, game.venueId, "venue was not found in map");

            const gamePlayers = getOrThrow(gamePlayersMap, game.id, "game players not found in map");
            const mainTeamGameReport: TeamGameReportDto = {
                lineup: [],
                managers: [],
            };
            const opponentTeamGameReport: TeamGameReportDto = {
                lineup: [],
                managers: [],
            };
            
            const gamePlayerPersonDtoMap = new Map<number, SmallPersonDto>();
            for (const gamePlayer of gamePlayers) {
                const person = getOrThrow(personMap, gamePlayer.personId, "person not found in map");
                const personDto = this.convertPersonToSmallDto(person);
                const playerDto = this.convertGamePlayerToDto(gamePlayer, personDto);
                gamePlayerPersonDtoMap.set(gamePlayer.id, personDto);
                if (gamePlayer.forMain) {
                    mainTeamGameReport.lineup.push(playerDto);
                } else {
                    opponentTeamGameReport.lineup.push(playerDto);
                }
            }

            const yellowCardPlayerMinuteMap = new Map<number, string>();
            const yellowRedCardPlayerMinuteMap = new Map<number, string>();
            const redCardPlayerMinuteMap = new Map<number, string>();
            const subOnPlayerMinuteMap = new Map<number, string>();
            const subOffPlayerMinuteMap = new Map<number, string>();

            const gameEventDtos: GameEventDto[] = [];
            const gameEvents = gameEventsMap.get(game.id);
            if (gameEvents !== undefined && gameEvents.length > 0) {
                for (const gameEvent of gameEvents) {
                    switch (gameEvent.eventType) {
                        case GameEventType.Goal:
                            const goalEvent = gameEvent as GoalGameEvent;
                            
                            const goalGameEvent: GoalGameEventDto = {
                                id: gameEvent.id,
                                type: gameEvent.eventType,
                                minute: gameEvent.minute.toString(),
                                sortOrder: gameEvent.sortOrder,
                                score: [goalEvent.scoreMain, goalEvent.scoreOpponent],
                                scoredBy: goalEvent.scoredBy,
                                scoredByPerson: getOrThrow(gamePlayerPersonDtoMap, goalEvent.scoredBy, `failed to find game player in person dto map with ID ${goalEvent.scoredBy}`),
                                goalType: goalEvent.goalType,
                            }

                            if (isDefined(goalEvent.assistBy)) {
                                goalGameEvent.assistBy = goalEvent.assistBy;
                                goalGameEvent.assistByPerson = getOrThrow(gamePlayerPersonDtoMap, goalEvent.assistBy, `failed to find game player in person dto map with ID ${goalEvent.assistBy}`);
                            }

                            if (goalEvent.penalty === true) {
                                goalGameEvent.penalty = goalEvent.penalty;
                            }

                            if (goalEvent.ownGoal === true) {
                                goalGameEvent.ownGoal = goalEvent.ownGoal;
                            }

                            if (goalEvent.directFreeKick === true) {
                                goalGameEvent.directFreeKick = goalEvent.directFreeKick;
                            }

                            if (goalEvent.bicycleKick === true) {
                                goalGameEvent.bicycleKick = goalEvent.bicycleKick;
                            }

                            gameEventDtos.push(goalGameEvent);
                            break;

                        case GameEventType.Substitution:
                            const substitionEvent = gameEvent as SubstitutionGameEvent;

                            const substitutionGameEvent: SubstitutionGameEventDto = {
                                id: gameEvent.id,
                                type: gameEvent.eventType,
                                minute: gameEvent.minute.toString(),
                                sortOrder: gameEvent.sortOrder,
                                playerOn: getOrThrow(gamePlayerPersonDtoMap, substitionEvent.playerOn, `failed to find player on in person dto map with id ${substitionEvent.playerOn}`),
                                playerOff: getOrThrow(gamePlayerPersonDtoMap, substitionEvent.playerOff, `failed to find player off in person dto map with id ${substitionEvent.playerOff}`),
                            }

                            if (substitionEvent.injured === true) {
                                substitutionGameEvent.injured = substitionEvent.injured;
                            }

                            subOnPlayerMinuteMap.set(substitionEvent.playerOn, gameEvent.minute.toString());
                            subOffPlayerMinuteMap.set(substitionEvent.playerOff, gameEvent.minute.toString());

                            gameEventDtos.push(substitutionGameEvent);

                            break;

                        case GameEventType.YellowCard:
                        case GameEventType.YellowRedCard:
                        case GameEventType.RedCard:
                            const cardEvent = gameEvent as YellowCardGameEvent;

                            const cardGameEvent: YellowCardGameEventDto = {
                                id: gameEvent.id,
                                type: gameEvent.eventType,
                                minute: gameEvent.minute.toString(),
                                sortOrder: gameEvent.sortOrder,
                                reason: cardEvent.reason as BookableOffence,     // will work for reds as well,
                            };

                            if (isDefined(cardEvent.affectedPlayer)) {
                                cardGameEvent.affectedPlayer = getOrThrow(gamePlayerPersonDtoMap, cardEvent.affectedPlayer, `failed to find affected game player in person dto map with ID ${cardEvent.affectedPlayer}`);

                                if (gameEvent.eventType === GameEventType.YellowCard) {
                                    yellowCardPlayerMinuteMap.set(cardEvent.affectedPlayer, gameEvent.minute.toString());
                                } else if (gameEvent.eventType === GameEventType.YellowRedCard) {
                                    yellowRedCardPlayerMinuteMap.set(cardEvent.affectedPlayer, gameEvent.minute.toString());
                                    yellowCardPlayerMinuteMap.delete(cardEvent.affectedPlayer);
                                } else if (gameEvent.eventType === GameEventType.RedCard) {
                                    redCardPlayerMinuteMap.set(cardEvent.affectedPlayer, gameEvent.minute.toString());
                                }
                            } else if (isDefined(cardEvent.affectedManager)) {
                                // TODO handle manager
                            }

                            gameEventDtos.push(cardGameEvent);
                            break;

                        case GameEventType.InjuryTime:
                            const injuryTimeEvent = gameEvent as InjuryTimeGameEvent;

                            const injuryTimeGameEvent: InjuryTimeGameEventDto = {
                                id: gameEvent.id,
                                type: gameEvent.eventType,
                                minute: gameEvent.minute.toString(),
                                sortOrder: gameEvent.sortOrder,
                                additionalMinutes: injuryTimeEvent.additionalMinutes,
                            }

                            gameEventDtos.push(injuryTimeGameEvent);

                            break;

                        case GameEventType.ExtraTime:
                            const extraTimeGameEvent: ExtraTimeGameEventDto = {
                                id: gameEvent.id,
                                type: gameEvent.eventType,
                                minute: gameEvent.minute.toString(),
                                sortOrder: gameEvent.sortOrder,
                            }

                            gameEventDtos.push(extraTimeGameEvent);

                            break;

                        case GameEventType.VarDecision:
                            const varDecisionEvent = gameEvent as VarDecisionGameEvent;

                            const varDecisionGameEvent: VarDecisionGameEventDto = {
                                id: gameEvent.id,
                                type: gameEvent.eventType,
                                minute: gameEvent.minute.toString(),
                                sortOrder: gameEvent.sortOrder,
                                decision: varDecisionEvent.decision as VarDecision,
                                affectedPlayer: getOrThrow(gamePlayerPersonDtoMap, varDecisionEvent.affectedPlayer, `failed to find affected player in person dto map with ID ${varDecisionEvent.affectedPlayer}`),
                            }

                            gameEventDtos.push(varDecisionGameEvent);

                            break;       
                        
                        case GameEventType.PenaltyShootOut:
                            const psoEvent = gameEvent as PenaltyShootOutGameEvent;

                            const psoGameEvent: PenaltyShootOutGameEventDto = {
                                id: gameEvent.id,
                                type: gameEvent.eventType,
                                minute: gameEvent.minute.toString(),
                                sortOrder: gameEvent.sortOrder,
                                score: [psoEvent.scoreMain, psoEvent.scoreOpponent],
                                takenBy: psoEvent.takenBy,
                                takenByPerson: getOrThrow(gamePlayerPersonDtoMap, psoEvent.takenBy, `failed to find taken by player in person dto map with ID ${psoEvent.takenBy}`),
                                result: psoEvent.result as PsoResult,
                            }

                            gameEventDtos.push(psoGameEvent);

                            break;

                        case GameEventType.PenaltyMissed:
                            const missedEvent = gameEvent as PenaltyMissedGameEvent;

                            const missedEventDto: PenaltyMissedGameEventDto = {
                                id: gameEvent.id,
                                type: gameEvent.eventType,
                                minute: gameEvent.minute.toString(),
                                sortOrder: gameEvent.sortOrder,
                                takenBy: missedEvent.takenBy,
                                takenByPerson: getOrThrow(gamePlayerPersonDtoMap, missedEvent.takenBy, `failed to find taken by player in person dto map with ID ${missedEvent.takenBy}`),
                                reason: missedEvent.reason,
                            }

                            gameEventDtos.push(missedEventDto);

                            break;
                    }
                }
            }

            // iterate over game player map to add minute information
            const allPlayers = [...mainTeamGameReport.lineup, ...opponentTeamGameReport.lineup];
            for (const playerItem of allPlayers) {
                const yellowCardMinute = yellowCardPlayerMinuteMap.get(playerItem.id);
                if (yellowCardMinute !== undefined) {
                    playerItem.yellowCard = yellowCardMinute;
                }

                const yellowRedCardMinute = yellowRedCardPlayerMinuteMap.get(playerItem.id);
                if (yellowRedCardMinute !== undefined) {
                    playerItem.yellowRedCard = yellowRedCardMinute;
                }

                const redCardMinute = redCardPlayerMinuteMap.get(playerItem.id);
                if (redCardMinute !== undefined) {
                    playerItem.redCard = redCardMinute;
                }

                const subbedOnMinute = subOnPlayerMinuteMap.get(playerItem.id);
                if (subbedOnMinute !== undefined) {
                    playerItem.on = subbedOnMinute;
                }

                const subbedOffMinute = subOffPlayerMinuteMap.get(playerItem.id);
                if (subbedOffMinute !== undefined) {
                    playerItem.off = subbedOffMinute;
                }
            }

            const gameManagers = getOrThrow(gameManagersMap, game.id, "game manager not found in map");
            for (const gameManager of gameManagers) {
                const person = getOrThrow(personMap, gameManager.personId, "manager person not found in map");
                const managerDto = {
                    id: gameManager.id,
                    person: this.convertPersonToSmallDto(person),
                    role: gameManager.role,
                };

                if (gameManager.forMain) {
                    mainTeamGameReport.managers.push(managerDto);
                } else {
                    opponentTeamGameReport.managers.push(managerDto);
                }
            }

            const refereeDtos: GameRefereeDto[] = [];
            const gameReferees = getOrThrow(gameRefereesMap, game.id, "game referees not found in map");
            for (const gameReferee of gameReferees) {
                const person = getOrThrow(personMap, gameReferee.personId, "referee person not found in map");
                refereeDtos.push({
                    id: gameReferee.id,
                    person: this.convertPersonToSmallDto(person),
                    role: gameReferee.role,
                })
            }

            const detailedGameDto: DetailedGameDto = {
                id: game.id,
                kickoff: game.kickoff,
                season: this.convertSeasonToSmallDto(season),
                opponent: this.convertClubToSmallDto(opponent),
                competition: this.convertCompetitionToSmallDto(competition),
                venue: this.convertVenueToGameVenueDto(venue),
                round: game.competitionRound,
                resultTendency: game.resultTendency,
                status: game.status,
                fullTime: [game.fullTimeGoalsMain, game.fullTimeGoalsOpponent],
                halfTime: [game.halfTimeGoalsMain, game.halfTimeGoalsOpponent],
                isHomeGame: game.isHomeTeam,
                report: {
                    main: mainTeamGameReport,
                    opponent: opponentTeamGameReport,
                    events: gameEventDtos,
                    referees: refereeDtos,
                },
            }

            if (isDefined(game.aetGoalsMain) && isDefined(game.aetGoalsOpponent)) {
                detailedGameDto.afterExtraTime = [game.aetGoalsMain, game.aetGoalsOpponent];
            }

            if (isDefined(game.psoGoalsMain) && isDefined(game.psoGoalsOpponent)) {
                detailedGameDto.penaltyShootOut = [game.psoGoalsMain, game.psoGoalsOpponent];
            }

            if (isDefined(parentCompetition)) {
                detailedGameDto.competition.parent = this.convertCompetitionToSmallDto(parentCompetition);
            }

            if (isDefined(game.attendance)) {
                detailedGameDto.attendance = game.attendance;
            }

            if (game.isNeutralGround === true) {
                detailedGameDto.isNeutralGround = game.isNeutralGround;
            }

            result.set(game.id, detailedGameDto);
        }

        return gameIds.map(gameId => getOrThrow(result, gameId, `Failed to find game details in result map for game ID ${gameId}`));
    }

    async getSquadDto(squad: Squad[]): Promise<SquadMemberDto[]> {
        const playerIds = squad.map(item => item.personId);
        const players = await this.personService.getMapByIds(playerIds);

        return squad.map(item => {
            return {
                id: item.id,
                player: this.convertPersonToBasicDto(getOrThrow(players, item.personId, `Failed to load squad member with player ID ${item.personId}`)),
                shirt: item.shirt,
                overallPosition: item.overallPosition,
            }
        });
    }

    private convertPersonToBasicDto(person: Person): BasicPersonDto {
        return {
            ...person,
            href: this.getFrontendResourceHref('person', getUrlSlug(person.id, `${person.firstName} ${person.lastName}`)),
        }
    }

    private convertPersonToSmallDto(person: Person): SmallPersonDto {
        const smallPerson: SmallPersonDto = {
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
        };

        if (isDefined(person.avatar)) {
            smallPerson.avatar = person.avatar;
        }

        return smallPerson;
    }

    convertClubToBasicDto(club: Club): BasicClubDto {
        const basicClub: BasicClubDto = {
            id: club.id,
            name: club.name,
            shortName: club.shortName,
        };

        if (isDefined(club.iconSmall)) {
            basicClub.iconSmall = club.iconSmall;
        }

        if (isDefined(club.iconLarge)) {
            basicClub.iconLarge = club.iconLarge;
        }

        return basicClub;
    }

    convertClubToSmallDto(club: Club): SmallClubDto {
        const smallClub: SmallClubDto = {
            id: club.id,
            name: club.name,
            shortName: club.shortName,
        };

        if (isDefined(club.iconSmall)) {
            smallClub.iconSmall = club.iconSmall;
        }

        if (isDefined(club.iconLarge)) {
            smallClub.iconLarge = club.iconLarge;
        }

        return smallClub;
    }

    convertSeasonToDto(season: Season): SeasonDto {
        return {
            id: season.id,
            name: season.name,
            shortName: season.shortName,
            start: season.start,
            end: season.end,
            href: this.getFrontendResourceHref('season', getUrlSlug(season.id, season.name)),
        };
    }

    convertSeasonToSmallDto(season: Season): SmallSeasonDto {
        return {
            id: season.id,
            name: season.name,
            shortName: season.shortName,
        };
    }

    convertCompetitionToDto(competition: Competition, parent?: Competition): CompetitionDto {
        const dto: CompetitionDto = {
            id: competition.id,
            name: competition.name,
            shortName: competition.shortName,
            isDomestic: competition.isDomestic,
            combineStatisticsWithParent: competition.combineStatisticsWithParent,
        };

        if (parent) {
            dto.parent = this.convertCompetitionToDto(parent);
        }

        return dto;
    }

    convertCompetitionToSmallDto(competition: Competition, parent?: Competition): SmallCompetitionDto {
        const dto: SmallCompetitionDto = {
            id: competition.id,
            name: competition.name,
            shortName: competition.shortName,
        };

        if (parent) {
            dto.parent = this.convertCompetitionToSmallDto(parent);
        }

        return dto;
    }

    private convertVenueToGameVenueDto(venue: Venue): GameVenueDto {
        return {
            id: venue.id,
            branding: venue.name,       // TODO fix
            city: venue.city,
        }
    }

    private convertGamePlayerToDto(gamePlayer: GamePlayer, player: SmallPersonDto): GamePlayerDto {
        const playerDto: GamePlayerDto = {
            id: gamePlayer.id,
            player,
            shirt: gamePlayer.shirt,
        };

        if (isDefined(gamePlayer.positionKey)) {
            playerDto.positionKey = gamePlayer.positionKey;
        }

        if (isDefined(gamePlayer.positionGrid)) {
            playerDto.positionGrid = gamePlayer.positionGrid;
        }

        if (isDefined(gamePlayer.goalsConceded)) {
            playerDto.goalsConceded = gamePlayer.goalsConceded;
        }

        if (gamePlayer.goalsScored > 0) {
            playerDto.goalsScored = gamePlayer.goalsScored;
        }

        if (gamePlayer.assists > 0) {
            playerDto.assists = gamePlayer.assists;
        }

        if (gamePlayer.ownGoals > 0) {
            playerDto.ownGoals = gamePlayer.ownGoals;
        }

        if (gamePlayer.isCaptain === true) {
            playerDto.captain = gamePlayer.isCaptain;
        }

        if (gamePlayer.isStarting === true) {
            playerDto.starting = gamePlayer.isStarting;
        }

        if (gamePlayer.yellowCard === true) {
            playerDto.yellowCard = "";
        }

        if (gamePlayer.yellowRedCard === true) {
            playerDto.yellowRedCard = "";
        }

        if (gamePlayer.redCard === true) {
            playerDto.redCard = "";
        }

        if (gamePlayer.regulationPenaltiesTaken > 0) {
            playerDto.regulationPenaltiesTaken = gamePlayer.regulationPenaltiesTaken;
        }

        if (gamePlayer.regulationPenaltiesScored > 0) {
            playerDto.regulationPenaltiesScored = gamePlayer.regulationPenaltiesScored;
        }

        if (gamePlayer.regulationPenaltiesFaced > 0) {
            playerDto.regulationPenaltiesFaced = gamePlayer.regulationPenaltiesFaced;
        }

        if (gamePlayer.regulationPenaltiesSaved > 0) {
            playerDto.regulationPenaltiesSaved = gamePlayer.regulationPenaltiesSaved;
        }

        if (gamePlayer.psoPenaltiesTaken > 0) {
            playerDto.psoPenaltiesTaken = gamePlayer.psoPenaltiesTaken;
        }

        if (gamePlayer.psoPenaltiesScored > 0) {
            playerDto.psoPenaltiesScored = gamePlayer.psoPenaltiesScored;
        }

        if (gamePlayer.psoPenaltiesFaced > 0) {
            playerDto.psoPenaltiesFaced = gamePlayer.psoPenaltiesFaced;
        }

        if (gamePlayer.psoPenaltiesSaved > 0) {
            playerDto.psoPenaltiesSaved = gamePlayer.psoPenaltiesSaved;
        }

        return playerDto;
    }

    private getUniquePersonIds(people: { personId: number }[]): number[] {
        return uniqueArrayElements(people.map(person => person.personId));
    }

    private getFrontendResourceHref(resourceName: string, resourcePath: string): string {
        const pluralisedResourceName = resourceName.endsWith('s') ? resourceName : `${resourceName}s`;
        return `${this.apiConfig.baseUrl}/${pluralisedResourceName}/${resourcePath}`
    }



}