import {DetailedGameDto} from "@src/model/external/dto/detailed-game";
import {GameEventService} from "@src/module/game-event/service";
import {GamePlayerService} from "@src/module/game-player/service";
import {GameService} from "@src/module/game/service";
import {CompetitionService} from "@src/module/competition/service";
import {VenueService} from "@src/module/venue/service";
import {PersonService} from "@src/module/person/service";
import {ensureNotNullish, getOrThrow, getUrlSlug, groupBy, isDefined, isNotDefined, uniqueArrayElements} from "@src/util/common";
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
import { SquadMember } from "@src/model/internal/squad-member";
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
import { VarDecision, VarDecisionReason } from "@src/model/type/var-decision";
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
import { GameAttendedService } from "@src/module/game-attended/service";
import { GameStarService } from "@src/module/game-star/service";
import { BasicVenueDto } from "@src/model/external/dto/basic-venue";
import { TacticalFormation } from "@src/model/external/dto/tactical-formation";
import { PlayerCompetitionStatsItemDto, PlayerGoalsAgainstClubStatsItemDto, PlayerSeasonStatsItemDto, PlayerStatsItemDto } from "@src/model/external/dto/stats-player";
import { PlayerBaseStats, PlayerGoalsAgainstClubStatsItem } from "@src/model/internal/stats-player";
import { ClubId, CompetitionId, PersonId, SeasonId } from "@src/util/domain-types";
import { OverallPosition } from "@src/model/type/position-overall";
import { GameManagerDto } from "@src/model/external/dto/game-manager";
import { Fixture, TablePosition } from "../matchday-details/types";
import { FixtureDto } from "@src/model/external/dto/fixture";
import { TablePositionDto } from "@src/model/external/dto/table-position";
import { ExternalProviderPerson } from "@src/model/internal/external-provider-person";
import { ExternalProviderLinkDto } from "@src/model/external/dto/external-provider-link";
import { normalizeForSearch } from "@src/util/search";
import { ExternalProvider } from "@src/model/type/external-provider";
import { GamePlayedDto } from "@src/model/external/dto/game-played";
import { ExternalProviderClub } from "@src/model/internal/external-provider-club";

type SquadMemberDtoWithOverallPosition = SquadMemberDto & { position: OverallPosition };

export class ApiHelperService {

    constructor(
        private readonly apiConfig: ApiConfig,
        private readonly clubService: ClubService,
        private readonly competitionService: CompetitionService,
        private readonly gameService: GameService,
        private readonly gameAttendedService: GameAttendedService,
        private readonly gameEventService: GameEventService,
        private readonly gameManagerService: GameManagerService,
        private readonly gamePlayerService: GamePlayerService,
        private readonly gameRefereeService: GameRefereeService,
        private readonly gameStarService: GameStarService,
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

        const parentCompetitionIds = uniqueArrayElements(Array.from(competitionMap.values())
            .filter(competition => competition.parentId !== null)
            .map(competition => competition.parentId as number));
        const parentCompetitionMap = await this.competitionService.getMapByIds(parentCompetitionIds);

        return games.map(game => {
            const competition = getOrThrow(competitionMap, game.competitionId, "competition not found in map");
            const parentCompetition = competition.parentId !== undefined ? parentCompetitionMap.get(competition.parentId) : null;
            const season = getOrThrow(seasonMap, game.seasonId, "season not found in map");
            const opponent = getOrThrow(clubMap, game.opponentId, "opponent not found in map");
            const venue = getOrThrow(venueMap, game.venueId, "venue was not found in map");

            const basicGame: BasicGameDto = {
                id: game.id,
                kickoff: game.kickoff,
                season: this.convertSeasonToSmallDto(season),
                opponent: this.convertClubToSmallDto(opponent),
                competition: this.convertCompetitionToSmallDto(competition, parentCompetition ?? undefined),
                venue: this.convertVenueToGameVenueDto(venue),
                round: game.competitionRound,
                status: game.status,
                isHomeGame: game.isHomeTeam,
            };

            if (isDefined(game.resultTendency)) {
                basicGame.resultTendency = game.resultTendency;
            }

            if (isDefined(game.competitionStage)) {
                basicGame.stage = game.competitionStage;
            }

            if (isDefined(game.attendance)) {
                basicGame.attendance = game.attendance;
            }

            if (isDefined(game.fullTimeGoalsMain) && isDefined(game.fullTimeGoalsOpponent)) {
                basicGame.fullTime = [game.fullTimeGoalsMain, game.fullTimeGoalsOpponent];
            }

            if (isDefined(game.halfTimeGoalsMain) && isDefined(game.halfTimeGoalsOpponent)) {
                basicGame.halfTime = [game.halfTimeGoalsMain, game.halfTimeGoalsOpponent];
            }

            if (isDefined(game.aetGoalsMain) && isDefined(game.aetGoalsOpponent)) {
                basicGame.afterExtraTime = [game.aetGoalsMain, game.aetGoalsOpponent];
            }

            if (isDefined(game.psoGoalsMain) && isDefined(game.psoGoalsOpponent)) {
                basicGame.penaltyShootOut = [game.psoGoalsMain, game.psoGoalsOpponent];
            }

            if (game.isNeutralGround === true) {
                basicGame.isNeutralGround = game.isNeutralGround;
            }

            if (game.isSoldOut === true) {
                basicGame.isSoldOut = game.isSoldOut;
            }

            return basicGame;
        });
    }

    async getOrderedDetailedGameDtos(gameIds: number[], accountId?: number): Promise<DetailedGameDto[]> {
        const [basicGameInformation, gameEventsMap, gameManagersMap, gamePlayersMap, gameRefereesMap] = await Promise.all([
            this.gameService.getMultipleByIds(gameIds),
            this.gameEventService.getOrderedEventsForGamesMap(gameIds),
            this.gameManagerService.getManagersForGamesMap(gameIds),
            this.gamePlayerService.getPlayersForGamesMap(gameIds),
            this.gameRefereeService.getRefereesForGamesMap(gameIds),
        ]);

        let gameAttended: number[] = [];
        let gameStars: number[] = [];
        if (accountId !== undefined) {
            [gameAttended, gameStars] = await Promise.all([
                this.gameAttendedService.getGameAttended(accountId, gameIds),
                this.gameStarService.getGameStars(accountId, gameIds),
            ]);
        }

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

            const gamePlayers = gamePlayersMap.get(game.id) ?? [];
            const mainTeamGameReport: TeamGameReportDto = {
                lineup: [],
                managers: [],
            };
            const opponentTeamGameReport: TeamGameReportDto = {
                lineup: [],
                managers: [],
            };

            if (isDefined(game.tacticalFormationMain)) {
                mainTeamGameReport.tacticalFormation = game.tacticalFormationMain as TacticalFormation;
            }

            if (isDefined(game.tacticalFormationOpponent)) {
                opponentTeamGameReport.tacticalFormation = game.tacticalFormationOpponent as TacticalFormation;
            }
            
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

            const yellowCardManagerMinuteMap = new Map<number, string>();
            const yellowRedCardManagerMinuteMap = new Map<number, string>();
            const redCardManagerMinuteMap = new Map<number, string>();

            const gameEventDtos: GameEventDto[] = [];
            const gameEvents = gameEventsMap.get(game.id) ?? [];
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
                                goalType: goalEvent.goalType,
                            }

                            if (isDefined(goalEvent.assistBy)) {
                                goalGameEvent.assistBy = goalEvent.assistBy;
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
                                playerOn: substitionEvent.playerOn,
                                playerOff: substitionEvent.playerOff,
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
                                cardGameEvent.affectedPlayer = cardEvent.affectedPlayer;

                                if (gameEvent.eventType === GameEventType.YellowCard) {
                                    yellowCardPlayerMinuteMap.set(cardEvent.affectedPlayer, gameEvent.minute.toString());
                                } else if (gameEvent.eventType === GameEventType.YellowRedCard) {
                                    yellowRedCardPlayerMinuteMap.set(cardEvent.affectedPlayer, gameEvent.minute.toString());
                                    yellowCardPlayerMinuteMap.delete(cardEvent.affectedPlayer);
                                } else if (gameEvent.eventType === GameEventType.RedCard) {
                                    redCardPlayerMinuteMap.set(cardEvent.affectedPlayer, gameEvent.minute.toString());
                                }
                            } else if (isDefined(cardEvent.affectedManager)) {
                                cardGameEvent.affectedManager = cardEvent.affectedManager;

                                if (gameEvent.eventType === GameEventType.YellowCard) {
                                    yellowCardManagerMinuteMap.set(cardEvent.affectedManager, gameEvent.minute.toString());
                                } else if (gameEvent.eventType === GameEventType.YellowRedCard) {
                                    yellowRedCardManagerMinuteMap.set(cardEvent.affectedManager, gameEvent.minute.toString());
                                    yellowCardManagerMinuteMap.delete(cardEvent.affectedManager);
                                } else if (gameEvent.eventType === GameEventType.RedCard) {
                                    redCardManagerMinuteMap.set(cardEvent.affectedManager, gameEvent.minute.toString());
                                }
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
                                reason: varDecisionEvent.reason as VarDecisionReason,
                                affectedPlayer: varDecisionEvent.affectedPlayer,
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
                                goalkeeper: psoEvent.goalkeeper,
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
                                goalkeeper: missedEvent.goalkeeper,
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

            const gameManagers = gameManagersMap.get(game.id) ?? [];
            for (const gameManager of gameManagers) {
                const person = getOrThrow(personMap, gameManager.personId, "manager person not found in map");
                const managerDto: GameManagerDto = {
                    id: gameManager.id,
                    person: this.convertPersonToSmallDto(person),
                    role: gameManager.role,
                };

                const yellowCardMinute = yellowCardManagerMinuteMap.get(gameManager.id);
                if (yellowCardMinute !== undefined) {
                    managerDto.yellowCard = yellowCardMinute;
                }

                const yellowRedCardMinute = yellowRedCardManagerMinuteMap.get(gameManager.id);
                if (yellowRedCardMinute !== undefined) {
                    managerDto.yellowRedCard = yellowRedCardMinute;
                }

                const redCardMinute = redCardManagerMinuteMap.get(gameManager.id);
                if (redCardMinute !== undefined) {
                    managerDto.redCard = redCardMinute;
                }

                if (gameManager.forMain) {
                    mainTeamGameReport.managers.push(managerDto);
                } else {
                    opponentTeamGameReport.managers.push(managerDto);
                }
            }

            const refereeDtos: GameRefereeDto[] = [];
            const gameReferees = gameRefereesMap.get(game.id) ?? [];
            for (const gameReferee of gameReferees) {
                const person = getOrThrow(personMap, gameReferee.personId, "referee person not found in map");
                refereeDtos.push({
                    id: gameReferee.id,
                    person: this.convertPersonToBasicDto(person),
                    role: gameReferee.role,
                })
            }

            const detailedGameDto: DetailedGameDto = {
                id: game.id,
                kickoff: game.kickoff,
                season: this.convertSeasonToSmallDto(season),
                opponent: this.convertClubToSmallDto(opponent),
                competition: this.convertCompetitionToSmallDto(competition, parentCompetition ?? undefined),
                venue: this.convertVenueToGameVenueDto(venue),
                round: game.competitionRound,
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

            if (isDefined(game.resultTendency)) {
                detailedGameDto.resultTendency = game.resultTendency;
            }

            if (isDefined(game.competitionStage)) {
                detailedGameDto.stage = game.competitionStage;
            }

            if (isDefined(game.aetGoalsMain) && isDefined(game.aetGoalsOpponent)) {
                detailedGameDto.afterExtraTime = [game.aetGoalsMain, game.aetGoalsOpponent];
            }

            if (isDefined(game.psoGoalsMain) && isDefined(game.psoGoalsOpponent)) {
                detailedGameDto.penaltyShootOut = [game.psoGoalsMain, game.psoGoalsOpponent];
            }

            if (isDefined(game.attendance)) {
                detailedGameDto.attendance = game.attendance;
            }

            if (isDefined(game.leg)) {
                detailedGameDto.leg = game.leg;
            }

            if (isDefined(game.previousLeg)) {
                detailedGameDto.previousLeg = game.previousLeg;
            }

            if (game.isNeutralGround === true) {
                detailedGameDto.isNeutralGround = game.isNeutralGround;
            }

            if (game.isSoldOut === true) {
                detailedGameDto.isSoldOut = game.isSoldOut;
            }

            if (game.titleWinningGame === true) {
                detailedGameDto.titleWinningGame = game.titleWinningGame;
                detailedGameDto.titleCount = game.titleCount;                

                const victoryGameText = isDefined(competition.parentId) ? parentCompetition?.victoryGameText : competition.victoryGameText;
                detailedGameDto.victoryGameText = victoryGameText;
            }

            result.set(game.id, detailedGameDto);
        }

        return gameIds.map(gameId => getOrThrow(result, gameId, `Failed to find game details in result map for game ID ${gameId}`));
    }

    async getSquadDto(squadMembers: SquadMember[]): Promise<Record<OverallPosition, Array<SquadMemberDto>>> {
        const playerIds = squadMembers.map(item => item.personId);
        if (playerIds.length === 0) {
            return {
                goalkeeper: [],
                defender: [],
                midfielder: [],
                forward: [],
            }
        }

        const players = await this.personService.getMapByIds(playerIds);

        const groupedByPosition = groupBy(squadMembers, (member: SquadMember) => member.overallPosition);

        return {
            goalkeeper: groupedByPosition.goalkeeper?.map(item => this.convertToSquadMemberDto(item, players)) ?? [],
            defender: groupedByPosition.defender?.map(item => this.convertToSquadMemberDto(item, players)) ?? [],
            midfielder: groupedByPosition.midfielder?.map(item => this.convertToSquadMemberDto(item, players)) ?? [],
            forward: groupedByPosition.forward?.map(item => this.convertToSquadMemberDto(item, players)) ?? [],
        }
    }

    async convertGamePlayerToGamePlayedDtos(gamePlayer: GamePlayer[]): Promise<GamePlayedDto[]> {
        const gameDetails = await this.gameService.getMultipleByIds(gamePlayer.map(item => item.gameId));
        const basicGames = await this.getOrderedBasicGameDtos(gameDetails);

        return gamePlayer.map(item => {
            const dto: GamePlayedDto = {
                game: basicGames.find(game => game.id === item.gameId)!,
            };

            if (isDefined(item.minutesPlayed)) {
                dto.minutesPlayed = item.minutesPlayed;
            }

            if (item.isStarting === true) {
                dto.starting = item.isStarting;
            }

            if (item.isCaptain === true) {
                dto.captain = item.isCaptain;
            }

            if (item.goalsScored) {
                dto.goalsScored = item.goalsScored;
            }

            if (item.assists) {
                dto.assists = item.assists;
            }

            if (item.ownGoals) {
                dto.ownGoals = item.ownGoals;
            }

            if (item.goalsConceded) {
                dto.goalsConceded = item.goalsConceded;
            }

            if (item.yellowCard) {
                dto.yellowCard = item.yellowCard;
            }

            if (item.yellowRedCard) {
                dto.yellowRedCard = item.yellowRedCard;
            }

            if (item.redCard) {
                dto.redCard = item.redCard;
            }

            if (item.regulationPenaltiesTaken && item.regulationPenaltiesScored) {
                dto.regulationPenaltiesTaken = [item.regulationPenaltiesTaken, item.regulationPenaltiesScored];
            }

            if (item.regulationPenaltiesFaced && item.regulationPenaltiesSaved) {
                dto.regulationPenaltiesFaced = [item.regulationPenaltiesFaced, item.regulationPenaltiesSaved];
            }

            if (item.psoPenaltiesTaken && item.psoPenaltiesScored) {
                dto.psoPenaltiesTaken = [item.psoPenaltiesTaken, item.psoPenaltiesScored];
            }

            if (item.psoPenaltiesFaced && item.psoPenaltiesSaved) {
                dto.psoPenaltiesFaced = [item.psoPenaltiesFaced, item.psoPenaltiesSaved];
            }

            return dto;
        });
    }

    convertExternalProviderPersonLinks(person: Person, externalProviderPersons: ReadonlyArray<ExternalProviderPerson>): ExternalProviderLinkDto[] {
        return externalProviderPersons.map(item => ({
            provider: item.externalProvider,
            link: this.getExternalProviderPersonLink(item.externalProvider, person, item.externalId),
        }))
    }

    private getExternalProviderPersonLink(provider: ExternalProvider, person: Person, externalPersonId: string): string {
        switch (provider) {
            case 'sofascore':
                return `https://www.sofascore.com/football/player/${normalizeForSearch([person.firstName, person.lastName].join(' ').replaceAll(' ', '-'))}/${externalPersonId}`
            default:
                throw new Error(`Unhandled external provider ${provider}`);
        }
    }

    convertExternalProviderClubLinks(club: Club, externalProviderClubs: ReadonlyArray<ExternalProviderClub>): ExternalProviderLinkDto[] {
        return externalProviderClubs.map(item => ({
            provider: item.externalProvider,
            link: this.getExternalProviderClubLink(item.externalProvider, club, item.externalId),
        }))
    }

    private getExternalProviderClubLink(provider: ExternalProvider, club: Club, externalClubId: string): string {
        switch (provider) {
            case 'sofascore':
                return `https://www.sofascore.com/team/football/${normalizeForSearch([club.name].join(' ').replaceAll(' ', '-'))}/${externalClubId}`;
            case 'weltfussball':
                return `https://www.weltfussball.at/teams/${normalizeForSearch([externalClubId].join(' ').replaceAll(' ', '-'))}/`;
            case 'bundesliga':
                return `https://www.bundesliga.at/de/team/${normalizeForSearch([club.name].join(' ').replaceAll(' ', '-'))}/${externalClubId}`;
            default:
                throw new Error(`Unhandled external provider ${provider}`);
        }
    }

    private convertToSquadMemberDto(member: SquadMember, people: Map<PersonId, Person>): SquadMemberDto {
        const dto: SquadMemberDto = {
            id: member.id,
            player: this.convertPersonToBasicDto(getOrThrow(people, member.personId, `player not found in squad persons map`)),
        }

        if (isDefined(member.shirt)) {
            dto.shirt = member.shirt;
        }

        if (isDefined(member.from)) {
            dto.from = member.from;
        }

        if (isDefined(member.to)) {
            dto.to = member.to;
        }

        return dto;
    }

    convertPersonToBasicDto(item: Person): BasicPersonDto {
        const person: BasicPersonDto = {
            id: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            birthday: item.birthday,
        };

        if (isDefined(item.avatar)) {
            person.avatar = this.getMediaUrl(item.avatar);
        }

        if (isDefined(item.deathday)) {
            person.deathday = item.deathday
        }

        if (isDefined(item.nationalities) && item.nationalities.length > 0) {
            person.nationalities = item.nationalities;
        }

        return person;
    }

    private convertPersonToSmallDto(person: Person): SmallPersonDto {
        const smallPerson: SmallPersonDto = {
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
        };

        if (isDefined(person.avatar)) {
            smallPerson.avatar = this.getMediaUrl(person.avatar);
        }

        return smallPerson;
    }

    async convertClubToBasicDto(club: Club): Promise<BasicClubDto> {
        const basicClub: BasicClubDto = {
            id: club.id,
            name: club.name,
            shortName: club.shortName,
            city: club.city,
            countryCode: club.countryCode,
        };

        if (isDefined(club.iconSmall)) {
            basicClub.iconSmall = this.getMediaUrl(club.iconSmall);
        }

        if (isDefined(club.iconLarge)) {
            basicClub.iconLarge = this.getMediaUrl(club.iconLarge);
        }

        if (isDefined(club.primaryColour)) {
            basicClub.primaryColour = club.primaryColour;
        }

        if (isDefined(club.secondaryColour)) {
            basicClub.secondaryColour = club.secondaryColour;
        }

        if (isDefined(club.district)) {
            basicClub.district = club.district;
        }

        if (isDefined(club.homeVenueId)) {
            const venue = await this.venueService.getById(club.homeVenueId);
            basicClub.homeVenue = this.convertVenueToBasicDto(venue as Venue);
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
            smallClub.iconSmall = this.getMediaUrl(club.iconSmall);
        }

        if (isDefined(club.iconLarge)) {
            smallClub.iconLarge = this.getMediaUrl(club.iconLarge);
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

        if (isDefined(competition.iconLarge)) {
            dto.iconLarge = this.getMediaUrl(competition.iconLarge);
        }

        if (isDefined(competition.iconSmall)) {
            dto.iconSmall = this.getMediaUrl(competition.iconSmall);
        }

        if (parent) {
            dto.parent = this.convertCompetitionToSmallDto(parent);
        }

        return dto;
    }

    convertPerformanceStatsDetailsMapToDto(playerStats: Map<SeasonId, Map<CompetitionId, PlayerBaseStats>>, seasonMap: Map<SeasonId, Season>, competitionMap: Map<CompetitionId, Competition>): PlayerSeasonStatsItemDto[] {
        const result: PlayerSeasonStatsItemDto[] = [];
        for (const [seasonId, competitionStatsMap] of playerStats.entries()) {
            const season = getOrThrow(seasonMap, seasonId, `failed to find season with ID ${seasonId} in season map`);

            const competitions: PlayerCompetitionStatsItemDto[] = [];
            for (const [competitionId, competitionStats] of competitionStatsMap.entries()) {
                const competition = getOrThrow(competitionMap, competitionId, `failed to find competition with ID ${competitionId} in competition map`);

                const competitionDto = this.convertCompetitionToSmallDto(competition);

                if (isNotDefined(competition.parentId)) {
                    competitions.push({
                        competition: competitionDto,
                        items: [{
                            isParent: true,
                            stats: this.convertToPlayerStatsItemDto(competitionStats),
                        }],
                    })
                } else {
                    // the parent competition must have a sort order lower than this one, so it must already be present in the array
                    const parentCompetition = ensureNotNullish(competitions.find(item => item.competition.id === competition.parentId));
                    parentCompetition.items.push({
                        competition: competitionDto,
                        stats: this.convertToPlayerStatsItemDto(competitionStats),
                    });
                }
            }
            
            result.push({
                season: this.convertSeasonToSmallDto(season),
                competitions,
            });
        }
        return result;
    }

    convertGoalsAgainstClubsStatsItems(items: ReadonlyArray<PlayerGoalsAgainstClubStatsItem>, clubMap: Map<ClubId, Club>): ReadonlyArray<PlayerGoalsAgainstClubStatsItemDto> {
        return items.map(item => {
            return {
                club: this.convertClubToSmallDto(getOrThrow(clubMap, item.clubId, `club ${item.clubId} not found in club map`)),
                goalsScored: item.goalsScored,
            }
        });
    }
    
    convertToPlayerStatsItemDto(stats: PlayerBaseStats): PlayerStatsItemDto {
        const result: PlayerStatsItemDto = {};

        if (stats.gamesPlayed > 0) {
            result.gamesPlayed = stats.gamesPlayed;
        }

        if (stats.gamesStarted > 0) {
            result.gamesStarted = stats.gamesStarted;
        }

        if (stats.goalsScored > 0) {
            result.goalsScored = stats.goalsScored;
        }

        if (stats.assists > 0) {
            result.assists = stats.assists;
        }

        if (stats.minutesPlayed > 0) {
            result.minutesPlayed = stats.minutesPlayed;
        }

        if (stats.ownGoals > 0) {
            result.ownGoals = stats.ownGoals;
        }

        if (stats.goalsConceded > 0) {
            result.goalsConceded = stats.goalsConceded;
        }

        if (stats.cleanSheets > 0) {
            result.cleanSheets = stats.cleanSheets;
        }

        if (stats.yellowCards > 0) {
            result.yellowCards = stats.yellowCards;
        }

        if (stats.yellowRedCards > 0) {
            result.yellowRedCards = stats.yellowRedCards;
        }

        if (stats.redCards > 0) {
            result.redCards = stats.redCards;
        }

        if (stats.regulationPenaltiesTaken > 0) {
            result.penaltiesTaken = [stats.regulationPenaltiesTaken, stats.regulationPenaltiesScored];
        }

        if (stats.regulationPenaltiesFaced > 0) {
            result.penaltiesFaced = [stats.regulationPenaltiesFaced, stats.regulationPenaltiesSaved];
        }

        if (stats.psoPenaltiesTaken > 0) {
            result.psoPenaltiesTaken = [stats.psoPenaltiesTaken, stats.psoPenaltiesScored];
        }

        if (stats.psoPenaltiesFaced > 0) {
            result.psoPenaltiesFaced = [stats.psoPenaltiesFaced, stats.psoPenaltiesSaved];
        }

        return result;
    }

    convertMatchdayFixturesToDto(fixtures: Fixture[]): FixtureDto[] {
        return fixtures.map(item => this.convertMatchdayFixtureToDto(item));
    }

    convertMatchdayFixtureToDto(fixture: Fixture): FixtureDto {
        const dto: FixtureDto = {
            kickoff: fixture.kickoff,
            status: fixture.status,
            home: this.convertClubToSmallDto(fixture.home),
            away: this.convertClubToSmallDto(fixture.away),
            fullTime: fixture.fullTime,
        }

        if (fixture.halfTime) {
            dto.halfTime = fixture.halfTime;
        }

        if (fixture.afterExtraTime) {
            dto.afterExtraTime = fixture.afterExtraTime;
        }

        if (fixture.afterPenaltyShootOut) {
            dto.afterPenaltyShootOut = fixture.afterPenaltyShootOut;
        }

        if (fixture.href) {
            dto.href = fixture.href;
        }

        return dto;
    }

    convertMatchdayTableToDto(table: TablePosition[]): TablePositionDto[] {
        return table.map(item => this.convertMatchdayTablePositionToDto(item));
    }

    convertMatchdayTablePositionToDto(position: TablePosition): TablePositionDto {
        const dto: TablePositionDto = {
            position: position.position,
            club: this.convertClubToSmallDto(position.club),
            gamesPlayed: position.gamesPlayed,
            wins: position.wins,
            draws: position.draws,
            defeats: position.defeats,
            goalsFor: position.goalsFor,
            goalsAgainst: position.goalsAgainst,
            points: position.points,
        }

        return dto;
    }

    private convertVenueToBasicDto(venue: Venue): BasicVenueDto {
        const dto: BasicVenueDto = {
            id: venue.id,
            name: venue.name,
            shortName: venue.shortName,
            city: venue.city,
            countryCode: venue.countryCode,
        }

        if (isDefined(venue.district)) {
            dto.district = venue.district;
        }

        if (isDefined(venue.capacity)) {
            dto.capacity = venue.capacity;
        }

        if (isDefined(venue.latitude)) {
            dto.latitude = venue.latitude;
        }

        if (isDefined(venue.longitude)) {
            dto.longitude = venue.longitude;
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

    private getMediaUrl(urlPart: string): string {
        return `${this.apiConfig.cdnBaseUrl}/${urlPart}`;
    }


}