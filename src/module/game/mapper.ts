import { Sql } from "@src/db";
import { Game } from "@src/model/internal/game";
import { GameDaoInterface } from "@src/model/internal/interface/game.interface";
import { GameStatus } from "@src/model/type/game-status";
import { Tendency } from "@src/model/type/tendency";
import { SortOrder } from "@src/module/pagination/constants";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { getOrThrow, isDefined, isNotDefined, requireSingleArrayElement } from "@src/util/common";
import { CreateGameDto } from "@src/model/internal/create-game";
import { GameEventType } from "@src/model/external/dto/game-event-type";
import { ClubInputDto } from "@src/model/external/dto/club-input";
import postgres from "postgres";
import { ExternalClubDto } from "@src/model/external/dto/external-club";
import { ClubMapper } from "@src/module/club/mapper";
import { PersonMapper } from "@src/module/person/mapper";
import { CompetitionMapper } from "@src/module/competition/mapper";
import { VenueMapper } from "@src/module/venue/mapper";
import { ExternalPersonDto } from "@src/model/external/dto/external-person";
import { PersonInputDto } from "@src/model/external/dto/person-input";
import { ExternalCompetitionDto } from "@src/model/external/dto/external-competition";
import { CompetitionInputDto } from "@src/model/external/dto/competition-input";
import { ExternalVenueDto } from "@src/model/external/dto/external-venue";
import { VenueInputDto } from "@src/model/external/dto/venue-input";
import { CreateGamePlayerDto } from "@src/model/external/dto/create-game-player";
import { CreateGamePlayer } from "@src/model/internal/create-game-player";
import { CreateGameManagerDto } from "@src/model/external/dto/create-game-manager";
import { CreateGameManager } from "@src/model/internal/create-game-manager";
import { CreateGameRefereeDto } from "@src/model/external/dto/create-game-referee";
import { CreateGameReferee } from "@src/model/internal/create-game-referee";
import { CreateGoalGameEventDto } from "@src/model/external/dto/create-game-event-goal";
import { CreateSubstitutionGameEventDto } from "@src/model/external/dto/create-game-event-substitution";
import { CreateInjuryTimeGameEventDto } from "@src/model/external/dto/create-game-event-injury-time";
import { CreatePenaltyMissedGameEventDto } from "@src/model/external/dto/create-game-event-penalty-missed";
import { CreateYellowCardGameEventDto } from "@src/model/external/dto/create-game-event-yellow-card";
import { GameMinute } from "@src/model/internal/game-minute";
import { CreateVarDecisionGameEventDto } from "@src/model/external/dto/create-game-event-var-decision";
import { determineResultTendency, getGameMinutes } from "@src/util/game";
import { CreateGameEventDaoInterface } from "@src/model/internal/interface/game-event.interface";
import { CreatePenaltyShootOutGameEventDto } from "@src/model/external/dto/create-game-event-pso";
import { PsoResult } from "@src/model/type/pso-result";
import { normalizeForSearch } from "@src/util/search";
import { ClubId, CompetitionId, DateString, GameId, SeasonId } from "@src/util/domain-types";

export class GameMapper {

    constructor(
        private readonly sql: Sql, 
        private readonly clubMapper: ClubMapper,
        private readonly competitionMapper: CompetitionMapper,
        private readonly personMapper: PersonMapper,
        private readonly venueMapper: VenueMapper,
    ) {}

    async getById(id: number): Promise<Game | null> {
        const result = await this.getMultipleByIds([id]);
        if (result.length === 0) {
            return null;
        }
        
        return requireSingleArrayElement(result);
    }

    async getMultipleByIds(ids: number[]): Promise<Game[]> {
        const result = await this.sql<GameDaoInterface[]>`select g.*, st.id is not null as title_winning_game, st.title_count as title_count from game g left join season_titles st on st.victory_game = g.id where g.id in ${ this.sql(ids) }`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    async getMapByIds(ids: number[]): Promise<Map<number, Game>> {
        const result = await this.getMultipleByIdsResult(ids);

        const resultMap = new Map<number, Game>();
        result.forEach(resultItem => {
            const entityItem = this.convertToEntity(resultItem);
            resultMap.set(entityItem.id, entityItem);
        });
        return resultMap;
    }

    async getOrderedSeasonGameIdsPaginated(seasonId: number, lastSeenDate: DateString, limit: number, order: SortOrder): Promise<number[]> {
        const result = await this.sql<IdInterface[]>`select id from game where season_id = ${ seasonId } and kickoff ${ order === SortOrder.Ascending ? this.sql`>` : this.sql`<` } ${ lastSeenDate } order by kickoff ${ order === SortOrder.Ascending ? this.sql`asc` : this.sql`desc` } limit ${ limit }`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => item.id);
    }

    async deleteById(gameId: number): Promise<void> {
        await this.sql`delete from game where id = ${gameId};`;
    }

    async getNextGames(from: Date, take: number): Promise<Game[]> {
        const result = await this.sql<IdInterface[]>`select id from game where kickoff >= ${from} and status = ${ GameStatus.Scheduled } order by kickoff asc limit ${take}`;
        if (result.length === 0) {
            return [];
        }

        return this.getMultipleByIds(result.map(item => item.id));
    }

    async getPreviousGames(from: Date, take: number): Promise<Game[]> {
        const result = await this.sql<IdInterface[]>`select id from game where kickoff <= ${from} and status = ${ GameStatus.Finished } order by kickoff desc limit ${take}`;
        if (result.length === 0) {
            return [];
        }

        return this.getMultipleByIds(result.map(item => item.id));
    }

    async createOrUpdatedScheduled(dto: CreateGameDto): Promise<number> {
        return await this.sql.begin(async tx => {
            const existingGameId = await this.resolveExistingScheduledGame(tx, dto.kickoff);

            let gameId: GameId | undefined = undefined;
            if (existingGameId === null) {
                // we must create a new game
                const [opponentId, competitionId] = await Promise.all([
                    this.resolveClubId(tx, dto.opponent),
                    this.resolveCompetitionId(tx, dto.competition),
                ]);

                const venueId = await this.resolveVenueId(tx, dto.venue);
                
                const temporaryGame = {
                    seasonId: dto.seasonId,
                    kickoff: dto.kickoff,
                    opponentId,
                    competitionId,
                    competitionRound: dto.competitionRound,
                    competitionStage: dto.competitionStage,
                    venueId,
                    status: dto.status,
                    attendance: dto.attendance,
                    isHomeTeam: dto.isHomeGame,
                    isNeutralGround: dto.isNeutralGround,
                    isPractice: dto.isPractice,
                    tablePositionMainBefore: dto.tablePositionMainBefore,
                    tablePositionMainAfter: dto.tablePositionMainAfter,
                    tablePositionOpponentBefore: dto.tablePositionOpponentBefore,
                    tablePositionOpponentAfter: dto.tablePositionOpponentAfter,
                    tablePositionOffset: dto.tablePositionOffset,
                };

                const temporaryGameResult = await tx`insert into game ${ tx(temporaryGame, 'seasonId', 'kickoff', 'opponentId', 'competitionId', 'competitionRound', 'competitionStage', 'venueId', 'status', 'attendance', 'isHomeTeam', 'isNeutralGround', 'isPractice', 'tablePositionMainBefore', 'tablePositionMainAfter', 'tablePositionOpponentBefore', 'tablePositionOpponentAfter', 'tablePositionOffset') } returning id`;
                gameId = temporaryGameResult[0].id;
            } else {
                // we update the existing scheduled game entry
                gameId = existingGameId;

                const existingGameUpdate = {
                    status: dto.status,
                    attendance: dto.attendance,
                    isHomeTeam: dto.isHomeGame,
                    isNeutralGround: dto.isNeutralGround,
                    isPractice: dto.isPractice,
                    tablePositionMainBefore: dto.tablePositionMainBefore,
                    tablePositionMainAfter: dto.tablePositionMainAfter,
                    tablePositionOpponentBefore: dto.tablePositionOpponentBefore,
                    tablePositionOpponentAfter: dto.tablePositionOpponentAfter,
                    tablePositionOffset: dto.tablePositionOffset,
                }

                await tx`update game set ${ tx(existingGameUpdate, 'attendance', 'status', 'isHomeTeam', 'isNeutralGround', 'isPractice', 'tablePositionMainBefore', 'tablePositionMainAfter', 'tablePositionOpponentBefore', 'tablePositionOpponentAfter', 'tablePositionOffset') } where id = ${gameId}`;
            }

            if (gameId === undefined) {
                throw new Error(`Failed to obtain game ID`);
            }

            let goalkeeperMainPersonId: number | null = null;
            let goalkeeperOpponentPersonId: number | null = null;

            const resolvedGamePlayers = await this.resolveGamePlayers(tx, gameId, [...dto.lineupMain, ...dto.lineupOpponent]);
            const lineup: CreateGamePlayer[] = resolvedGamePlayers.map(item => {
                return {
                    ...item,
                    gameId,
                }
            });
            const lineupResult = await tx`insert into game_players ${ tx(lineup, 'gameId', 'personId', 'sortOrder', 'forMain', 'shirt', 'isCaptain', 'isStarting', 'positionGrid', 'positionKey', 'minutesPlayed', 'goalsScored', 'assists', 'ownGoals', 'yellowCard', 'yellowRedCard', 'redCard', 'regulationPenaltiesTaken', 'regulationPenaltiesScored', 'regulationPenaltiesFaced', 'regulationPenaltiesSaved', 'psoPenaltiesTaken', 'psoPenaltiesScored', 'psoPenaltiesFaced', 'psoPenaltiesSaved') } returning id, person_id, for_main, sort_order, is_starting`;            
            const personGamePlayerIdMap = new Map<number, { 
                id: number, 
                forMain: boolean, 
                sortOrder: number, 
                isStarting: boolean, 
                minutesPlayed: number | null, 
                goalsScored: number, 
                assists: number, 
                goalsConceded: number | null, 
                ownGoals: number, 
                yellow: boolean, 
                yellowRed: boolean, 
                red: boolean,
                regulationPenaltiesTaken: number,
                regulationPenaltiesScored: number,
                regulationPenaltiesFaced: number,
                regulationPenaltiesSaved: number,
                psoPenaltiesTaken: number,
                psoPenaltiesScored: number,
                psoPenaltiesFaced: number,
                psoPenaltiesSaved: number,
             }>();
            const gamePlayerPersonIdMap = new Map<number, number>();
            lineupResult.forEach(item => {
                if (item.sortOrder % 100 === 0) {
                    if (item.forMain) {
                        goalkeeperMainPersonId = item.personId;
                    } else {
                        goalkeeperOpponentPersonId = item.personId;
                    }
                }

                personGamePlayerIdMap.set(item.personId, { 
                    id: item.id, 
                    forMain: item.forMain, 
                    isStarting: item.isStarting, 
                    minutesPlayed: null,
                    sortOrder: item.sortOrder,
                    goalsScored: 0,
                    assists: 0,
                    ownGoals: 0,
                    yellow: false,
                    yellowRed: false,
                    red: false,
                    goalsConceded: item.sortOrder === 0 ? 0 : null,
                    regulationPenaltiesScored: 0,
                    regulationPenaltiesTaken: 0,
                    regulationPenaltiesFaced: 0,
                    regulationPenaltiesSaved: 0,
                    psoPenaltiesScored: 0,
                    psoPenaltiesTaken: 0,
                    psoPenaltiesFaced: 0,
                    psoPenaltiesSaved: 0,
                });
                gamePlayerPersonIdMap.set(item.id, item.personId);
            });

            if (goalkeeperMainPersonId === null) {
                throw new Error(`Failed to identify main goalkeeper person ID`);
            }

            if (goalkeeperOpponentPersonId === null) {
                throw new Error(`Failed to identify opponent goalkeeper person ID`);
            }

            const managers = await this.resolveGameManagers(tx, gameId, [...dto.managersMain, ...dto.managersOpponent]);
            const managersResult = await tx`insert into game_managers ${ tx(managers, 'gameId', 'personId', 'forMain', 'sortOrder', 'role')} returning id, person_id, for_main`;
            const personGameManagerIdMap = new Map<number, { id: number, forMain: boolean }>();
            const gameManagerPersonIdMap = new Map<number, number>();
            managersResult.forEach(item => {
                personGameManagerIdMap.set(item.personId, { id: item.id, forMain: item.forMain });
                gameManagerPersonIdMap.set(item.id, item.personId);
            })

            const referees = await this.resolveGameReferees(tx, gameId, dto.referees);
            if (referees.length > 0) {
                await tx`insert into game_referees ${ tx(referees, 'gameId', 'personId', 'sortOrder', 'role') }`;
            }

            let fullTimeGoalsMain = 0;
            let fullTimeGoalsOpponent = 0;
            let halfTimeGoalsMain = 0;
            let halfTimeGoalsOpponent = 0;
            let yellowCardsMain = 0;
            let yellowCardsOpponent = 0;
            let yellowRedCardsMain = 0;
            let yellowRedCardsOpponent = 0;
            let redCardsMain = 0;
            let redCardsOpponent = 0;
            let turnaroundsMain = 0;
            let turnaroundsOpponent = 0;
            let penaltiesTakenMain = 0;
            let penaltiesTakenOpponent = 0;
            let penaltiesScoredMain = 0;
            let penaltiesScoredOpponent = 0;
            let ownGoalsMain = 0;
            let ownGoalsOpponent = 0;
            let directFreeKickGoalsMain = 0;
            let directFreeKickGoalsOpponent = 0;
            let bicycleKickGoalsMain = 0;
            let bicycleKickGoalsOpponent = 0;
            let aetGoalsMain: number | undefined = undefined;
            let aetGoalsOpponent: number | undefined = undefined;
            let psoGoalsMain: number | undefined = undefined;
            let psoGoalsOpponent: number | undefined = undefined;

            let wasMainLeading = false;
            let wasOpponentLeading = false;
            let hasExtraTime = false;
            let hasPenaltyShootOut = false;
            let hasMainGoalkeeperBeenSentOff = false;
            let hasOpponentGoalkeeperBeenSentOff = false;

            const gameEvents: CreateGameEventDaoInterface[] = [];
            for (const event of dto.events) {
                // as a fallback, try to detect extra time ourselves
                const eventMinute = new GameMinute(event.minute);
                if (!hasExtraTime && eventMinute.isInExtraTime()) {
                    hasExtraTime = true;
                    aetGoalsMain = fullTimeGoalsMain;
                    aetGoalsOpponent = fullTimeGoalsOpponent;
                }

                switch (event.type) {
                    case GameEventType.ExtraTime:
                        gameEvents.push({
                            gameId,
                            type: event.type,
                            sortOrder: event.sortOrder,
                            minute: event.minute,
                        });

                        break;

                    case GameEventType.Goal:
                        const goalGameEvent = event as CreateGoalGameEventDto;
                        const scoredBy = await this.resolvePersonId(tx, goalGameEvent.scoredBy);
                        const assistBy = goalGameEvent.assistBy !== undefined ? await this.resolvePersonId(tx, goalGameEvent.assistBy) : null;
                        const scoredByGamePlayerEntry = getOrThrow(personGamePlayerIdMap, scoredBy, `failed to find scored by in game player map (person ID ${scoredBy})`);
                        const assistByGamePlayerEntry = assistBy !== null ? getOrThrow(personGamePlayerIdMap, assistBy, `failed to find assist by in game player map (person ID ${assistBy})`) : null;

                        const gameMinute = new GameMinute(event.minute);
                        const wasGoalForMain = (scoredByGamePlayerEntry.forMain && !goalGameEvent.ownGoal) || (!scoredByGamePlayerEntry.forMain && goalGameEvent.ownGoal);

                        if (gameMinute.isAfter(GameMinute.FULL_TIME) && gameMinute.isBefore(GameMinute.AFTER_EXTRA_TIME)) {
                            if (!hasExtraTime || aetGoalsMain === undefined || aetGoalsOpponent === undefined) {
                                throw new Error(`Game event in extra time but no extra time has been added`);
                            }

                            aetGoalsMain += wasGoalForMain ? 1 : 0;
                            aetGoalsOpponent += wasGoalForMain ? 0 : 1;
                        }

                        if (gameMinute.isBefore(GameMinute.FULL_TIME)) {
                            fullTimeGoalsMain += wasGoalForMain ? 1 : 0;
                            fullTimeGoalsOpponent += wasGoalForMain ? 0 : 1;
                        }

                        if (gameMinute.isBefore(GameMinute.HALF_TIME)) {
                            halfTimeGoalsMain += wasGoalForMain ? 1 : 0;
                            halfTimeGoalsOpponent += wasGoalForMain ? 0 : 1;
                        }

                        const scoreMain = Math.max(...[fullTimeGoalsMain, aetGoalsMain].filter(item => item !== undefined && item !== null));
                        const scoreOpponent = Math.max(...[fullTimeGoalsOpponent, aetGoalsOpponent].filter(item => item !== undefined && item !== null));

                        if (scoreMain > scoreOpponent) {
                            if (wasOpponentLeading) {
                                turnaroundsMain += 1;
                                wasOpponentLeading = false;
                            }

                            wasMainLeading = true;
                        } else if (scoreOpponent > scoreMain) {
                            if (wasMainLeading) {
                                turnaroundsOpponent += 1;
                                wasMainLeading = false;
                            }

                            wasOpponentLeading = true;
                        }

                        if (goalGameEvent.ownGoal) {
                            scoredByGamePlayerEntry.ownGoals += 1;
                        } else {
                            scoredByGamePlayerEntry.goalsScored += 1;
                        }

                        if (assistByGamePlayerEntry !== null) {
                            assistByGamePlayerEntry.assists += 1;
                        }

                        if (wasGoalForMain) {
                            const opponentGoalkeeper = getOrThrow(personGamePlayerIdMap, goalkeeperOpponentPersonId, `failed to find goalkeeper opponent`);
                            opponentGoalkeeper.goalsConceded = (opponentGoalkeeper.goalsConceded || 0) + 1;

                            if (goalGameEvent.penalty) {
                                opponentGoalkeeper.regulationPenaltiesFaced += 1;
                            }
                        } else {
                            const mainGoalkeeper = getOrThrow(personGamePlayerIdMap, goalkeeperMainPersonId, `failed to find goalkeeper main`);
                            mainGoalkeeper.goalsConceded = (mainGoalkeeper.goalsConceded || 0) + 1;

                            if (goalGameEvent.penalty) {
                                mainGoalkeeper.regulationPenaltiesFaced += 1;
                            }
                        }
                        
                        if (goalGameEvent.penalty) {
                            if (scoredByGamePlayerEntry.forMain) {
                                penaltiesScoredMain += 1;
                                penaltiesTakenMain += 1;
                            } else {
                                penaltiesScoredOpponent += 1;
                                penaltiesTakenOpponent += 1;
                            }

                            scoredByGamePlayerEntry.regulationPenaltiesScored += 1;
                            scoredByGamePlayerEntry.regulationPenaltiesTaken += 1;
                        } else if (goalGameEvent.directFreeKick) {
                            if (scoredByGamePlayerEntry.forMain) {
                                directFreeKickGoalsMain += 1;
                            } else {
                                directFreeKickGoalsOpponent += 1;
                            }
                        } else if (goalGameEvent.ownGoal) {
                            if (scoredByGamePlayerEntry.forMain) {
                                ownGoalsMain += 1;
                            } else {
                                ownGoalsOpponent += 1;
                            }
                        } else if (goalGameEvent.bicycleKick) {
                            if (scoredByGamePlayerEntry.forMain) {
                                bicycleKickGoalsMain += 1;
                            } else {
                                bicycleKickGoalsOpponent += 1;
                            }
                        }

                        gameEvents.push({
                            gameId,
                            type: event.type,
                            sortOrder: event.sortOrder,
                            minute: event.minute,
                            scoreMain: hasPenaltyShootOut ? psoGoalsMain : scoreMain,
                            scoreOpponent: hasPenaltyShootOut ? psoGoalsOpponent : scoreOpponent,
                            scoredBy: scoredByGamePlayerEntry.id,
                            assistBy: assistByGamePlayerEntry?.id,
                            goalType: goalGameEvent.goalType,
                            penalty: goalGameEvent.penalty,
                            directFreeKick: goalGameEvent.directFreeKick,
                            ownGoal: goalGameEvent.ownGoal,
                            bicycleKick: goalGameEvent.bicycleKick,
                        });

                        break;

                    case GameEventType.Substitution:
                        const substitutionGameEvent = event as CreateSubstitutionGameEventDto;
                        const playerOn = await this.resolvePersonId(tx, substitutionGameEvent.playerOn);
                        const playerOff = await this.resolvePersonId(tx, substitutionGameEvent.playerOff);
                        const playerOnGamePlayerEntry = getOrThrow(personGamePlayerIdMap, playerOn, `failed to find player on during event processing in game player map (person ID ${playerOn})`);
                        const playerOffGamePlayerEntry = getOrThrow(personGamePlayerIdMap, playerOff, `failed to find player off during event processing in game player map (person ID ${playerOff})`);

                        if (playerOnGamePlayerEntry.forMain && (goalkeeperMainPersonId === playerOff || hasMainGoalkeeperBeenSentOff)) {
                            console.log(`detected main goalkeeper switch to person ID ${playerOn}`);
                            goalkeeperMainPersonId = playerOn;

                            hasMainGoalkeeperBeenSentOff = false;
                        }

                        if (playerOnGamePlayerEntry.forMain === false && (goalkeeperOpponentPersonId === playerOff || hasOpponentGoalkeeperBeenSentOff)) {
                            console.log(`detected opponent goalkeeper switch to person ID ${playerOn}`);
                            goalkeeperOpponentPersonId === playerOn;

                            hasOpponentGoalkeeperBeenSentOff = false;
                        }

                        const substitionGameEvent = {
                            gameId,
                            type: event.type,
                            sortOrder: event.sortOrder,
                            minute: event.minute,
                            playerOn: playerOnGamePlayerEntry.id,
                            playerOff: playerOffGamePlayerEntry.id,
                            injured: substitutionGameEvent.injured,
                        }; 

                        gameEvents.push(substitionGameEvent);

                        break;

                    case GameEventType.VarDecision:
                        const varDecisionEvent = event as CreateVarDecisionGameEventDto;
                        const varAffectedPlayer = await this.resolvePersonId(tx, varDecisionEvent.affectedPlayer);
                        const varAffectedPlayerEntry = getOrThrow(personGamePlayerIdMap, varAffectedPlayer, `failed to find VAR affected player in game player map (person ID ${varAffectedPlayer})`);
                        gameEvents.push({
                            gameId,
                            type: event.type,
                            sortOrder: event.sortOrder,
                            minute: event.minute,
                            decision: varDecisionEvent.decision,
                            affectedPlayer: varAffectedPlayerEntry.id,
                        });

                        break;

                    case GameEventType.InjuryTime:
                        const injuryTimeGameEvent = event as CreateInjuryTimeGameEventDto;
                        gameEvents.push({
                            gameId,
                            type: event.type,
                            sortOrder: event.sortOrder,
                            minute: event.minute,
                            additionalMinutes: injuryTimeGameEvent.additionalMinutes,
                        });

                        break;

                    case GameEventType.PenaltyMissed:
                        const penaltyMissedGameEvent = event as CreatePenaltyMissedGameEventDto;
                        const takenBy = await this.resolvePersonId(tx, penaltyMissedGameEvent.takenBy);
                        const takenByGamePlayerEntry = getOrThrow(personGamePlayerIdMap, takenBy, `failed to find taken by in game player map (person ID ${takenBy})`);
                        let goalkeeperGamePlayerId;

                        if (takenByGamePlayerEntry.forMain) {
                            penaltiesTakenMain += 1;

                            const penaltyOpponentGoalkeeper = getOrThrow(personGamePlayerIdMap, goalkeeperOpponentPersonId, `failed to find penalty opponent goalkeeper in game player map (person ID ${goalkeeperOpponentPersonId})`);
                            penaltyOpponentGoalkeeper.regulationPenaltiesFaced += 1;
                            penaltyOpponentGoalkeeper.regulationPenaltiesSaved += 1;
                            goalkeeperGamePlayerId = penaltyOpponentGoalkeeper.id;
                        } else {
                            penaltiesTakenOpponent += 1;

                            const penaltyMainGoalkeeper = getOrThrow(personGamePlayerIdMap, goalkeeperMainPersonId, `failed to find penalty opponent goalkeeper in game player map (person ID ${goalkeeperMainPersonId})`);
                            penaltyMainGoalkeeper.regulationPenaltiesFaced += 1;
                            penaltyMainGoalkeeper.regulationPenaltiesSaved += 1;
                            goalkeeperGamePlayerId = penaltyMainGoalkeeper.id;
                        }

                        takenByGamePlayerEntry.regulationPenaltiesTaken += 1;

                        gameEvents.push({
                            gameId,
                            type: event.type,
                            sortOrder: event.sortOrder,
                            minute: event.minute,
                            takenBy: takenByGamePlayerEntry.id,
                            goalkeeper: goalkeeperGamePlayerId,
                            reason: penaltyMissedGameEvent.reason,
                        });

                        break;

                    case GameEventType.PenaltyShootOut:
                        const psoGameEvent = event as CreatePenaltyShootOutGameEventDto;
                        const psoTakenBy = await this.resolvePersonId(tx, psoGameEvent.takenBy);
                        const psoTakenByGamePlayerEntry = getOrThrow(personGamePlayerIdMap, psoTakenBy, `failed to find PSO taken by in game player map (person ID ${psoTakenBy})`);

                        if (!hasPenaltyShootOut) {
                            hasPenaltyShootOut = true;
                            psoGoalsMain = 0;
                            psoGoalsOpponent = 0;
                        }

                        const psoMainGoalkeeper = getOrThrow(personGamePlayerIdMap, goalkeeperMainPersonId, `failed to find PSO goalkeeper main`);
                        const psoOpponentGoalkeeper = getOrThrow(personGamePlayerIdMap, goalkeeperOpponentPersonId, `failed to find PSO goalkeeper opponent`);

                        let psoGoalkeeperId;

                        psoTakenByGamePlayerEntry.psoPenaltiesTaken += 1;

                        if (psoTakenByGamePlayerEntry.forMain) {
                            psoGoalkeeperId = psoOpponentGoalkeeper.id;
                            psoOpponentGoalkeeper.psoPenaltiesFaced += 1;

                            if (psoGameEvent.result === PsoResult.Goal) {
                                psoGoalsMain = (psoGoalsMain as number) + 1;
                                psoTakenByGamePlayerEntry.psoPenaltiesScored += 1;
                            } else {
                                psoOpponentGoalkeeper.psoPenaltiesSaved += 1;
                            }
                        } else if (!psoTakenByGamePlayerEntry.forMain) {
                            psoGoalkeeperId = psoMainGoalkeeper.id;
                            psoMainGoalkeeper.psoPenaltiesFaced += 1;

                            if (psoGameEvent.result === PsoResult.Goal) {
                                psoGoalsOpponent = (psoGoalsOpponent as number) + 1;
                                psoTakenByGamePlayerEntry.psoPenaltiesScored += 1;
                            } else {
                                psoMainGoalkeeper.psoPenaltiesSaved += 1;
                            }
                        }

                        const psoScoreMain = psoGoalsMain;
                        const psoScoreOpponent = psoGoalsOpponent;
                        
                        gameEvents.push({
                            gameId,
                            type: event.type,
                            sortOrder: event.sortOrder,
                            minute: event.minute,
                            takenBy: psoTakenByGamePlayerEntry.id,
                            goalkeeper: psoGoalkeeperId,
                            decision: psoGameEvent.result,
                            scoreMain: psoScoreMain,
                            scoreOpponent: psoScoreOpponent,
                        });

                        break;

                    case GameEventType.YellowCard:
                    case GameEventType.YellowRedCard:
                    case GameEventType.RedCard:
                        const cardEvent = event as CreateYellowCardGameEventDto;
                        const affectedPlayer = cardEvent.affectedPlayer !== undefined ? await this.resolvePersonId(tx, cardEvent.affectedPlayer) : null;
                        const affectedPlayerPlayerEntry = affectedPlayer !== null ? getOrThrow(personGamePlayerIdMap, affectedPlayer, `failed to find affected player in game player map (person ID ${affectedPlayer})`) : null;
                        const affectedManager = cardEvent.affectedManager !== undefined ? await this.resolvePersonId(tx, cardEvent.affectedManager) : null;
                        const affectedManagerEntry = affectedManager !== null ? getOrThrow(personGameManagerIdMap, affectedManager, `failed to find affected manager in game manager map (person ID ${affectedManager})`) : null;
                        const reason = cardEvent.reason;        // will also work for reds

                        const wasForMain = affectedPlayerPlayerEntry?.forMain || affectedManagerEntry?.forMain;
                        if (event.type === GameEventType.YellowCard) {
                            if (affectedPlayerPlayerEntry !== null) {
                                affectedPlayerPlayerEntry.yellow = true;

                                // right now, we only count cards for players, not managers
                                if (wasForMain) {
                                    yellowCardsMain += 1;
                                } else {
                                    yellowCardsOpponent += 1;
                                }
                            }
                        } else if (event.type === GameEventType.YellowRedCard) {
                            if (affectedPlayerPlayerEntry !== null) {
                                affectedPlayerPlayerEntry.yellowRed = true;
                                affectedPlayerPlayerEntry.yellow = false;

                                if (wasForMain) {
                                    yellowRedCardsMain += 1;
                                    yellowCardsMain -= 1;

                                    if (affectedPlayer === goalkeeperMainPersonId) {
                                        hasMainGoalkeeperBeenSentOff = true;
                                    }
                                } else {
                                    yellowRedCardsOpponent += 1;
                                    yellowCardsOpponent -= 1;

                                    if (affectedPlayer === goalkeeperOpponentPersonId) {
                                        hasOpponentGoalkeeperBeenSentOff = true;
                                    }
                                }
                            }
                        } else if (event.type === GameEventType.RedCard) {
                            if (affectedPlayerPlayerEntry !== null) {
                                affectedPlayerPlayerEntry.red = true;

                                if (wasForMain) {
                                    redCardsMain += 1;

                                    if (affectedPlayer === goalkeeperMainPersonId) {
                                        hasMainGoalkeeperBeenSentOff = true;
                                    }
                                } else {
                                    redCardsOpponent += 1;

                                    if (affectedPlayer === goalkeeperOpponentPersonId) {
                                        hasOpponentGoalkeeperBeenSentOff = true;
                                    }
                                }
                            }
                        }

                        gameEvents.push({
                            gameId,
                            type: event.type,
                            sortOrder: event.sortOrder,
                            minute: event.minute,
                            affectedPlayer: affectedPlayerPlayerEntry !== null ? affectedPlayerPlayerEntry.id : undefined,
                            affectedManager: affectedManagerEntry !== null ? affectedManagerEntry.id : undefined,
                            reason,
                            notOnPitch: cardEvent.notOnPitch,
                        })

                        break;
                    
                    default:
                        throw new Error(`Unhandled game event type ${event.type}`);
                }

            }

            await tx`insert into game_events ${ tx(gameEvents, 'gameId', 'type', 'sortOrder', 'minute', 'scoreMain', 'scoreOpponent', 'scoredBy', 'assistBy', 'goalType', 'bicycleKick', 'directFreeKick', 'penalty', 'ownGoal', 'playerOn', 'playerOff', 'affectedPlayer', 'affectedManager', 'reason', 'decision', 'injured', 'takenBy', 'goalkeeper', 'notOnPitch', 'additionalMinutes') }`;

            const gameMinutes = getGameMinutes(hasExtraTime);
            for (const gamePlayer of personGamePlayerIdMap.values()) {
                if (gamePlayer.isStarting) {
                    gamePlayer.minutesPlayed = gameMinutes;
                }
            }

            const substitutionEvents = gameEvents.filter(event => event.type === GameEventType.Substitution);
            for (const substitution of substitutionEvents) {
                const gameMinute = new GameMinute(substitution.minute);
                const playerOnPersonId = getOrThrow(gamePlayerPersonIdMap, substitution.playerOn, `failed to find game player person ID ${substitution.playerOn}`);
                const playerOffPersonId = getOrThrow(gamePlayerPersonIdMap, substitution.playerOff, `failed to find game player person ID ${substitution.playerOff}`);

                const gamePlayerOn = getOrThrow(personGamePlayerIdMap, playerOnPersonId, `failed to find game player on with ID ${substitution.playerOn}`);
                const gamePlayerOff = getOrThrow(personGamePlayerIdMap, playerOffPersonId, `failed to find game player off with ID ${substitution.playerOff}`);
                const minutesPlayedValue = gameMinute.getMinutesPlayedValue();
                gamePlayerOff.minutesPlayed = minutesPlayedValue;
                gamePlayerOn.minutesPlayed = gameMinutes - minutesPlayedValue;
            }

            const onPitchGamePlayerExpulsionEvents = gameEvents.filter(event => [GameEventType.RedCard, GameEventType.YellowRedCard].includes(event.type) && event.affectedPlayer !== undefined && event.notOnPitch !== true);
            for (const expulsion of onPitchGamePlayerExpulsionEvents) {
                const gameMinute = new GameMinute(expulsion.minute);
                const remainingTimeInGame = gameMinutes - gameMinute.getMinutesPlayedValue();
                const expelledPlayerPersonId = getOrThrow(gamePlayerPersonIdMap, expulsion.affectedPlayer, `failed to find game player person ID ${expulsion.affectedPlayer}`);
                const expelledPlayer = getOrThrow(personGamePlayerIdMap, expelledPlayerPersonId, `failed to find affected game player with ID ${expulsion.affectedPlayer}`);
                expelledPlayer.minutesPlayed = (expelledPlayer.minutesPlayed as number) - remainingTimeInGame;
            }

            for (const value of personGamePlayerIdMap.values()) {
                await tx`update game_players set minutes_played = ${value.minutesPlayed}, goals_scored = ${value.goalsScored}, assists = ${value.assists}, own_goals = ${value.ownGoals}, yellow_card = ${value.yellow}, yellow_red_card = ${value.yellowRed}, red_card = ${value.red}, goals_conceded = ${value.goalsConceded}, regulation_penalties_taken = ${value.regulationPenaltiesTaken}, regulation_penalties_scored = ${value.regulationPenaltiesScored}, regulation_penalties_faced = ${value.regulationPenaltiesFaced}, regulation_penalties_saved = ${value.regulationPenaltiesSaved}, pso_penalties_taken = ${value.psoPenaltiesTaken}, pso_penalties_scored = ${value.psoPenaltiesScored}, pso_penalties_faced = ${value.psoPenaltiesFaced}, pso_penalties_saved = ${value.psoPenaltiesSaved} where id = ${value.id}`;
            }

            const resultTendency = determineResultTendency({
                fullTimeGoalsMain,
                fullTimeGoalsOpponent,
                aetGoalsMain,
                aetGoalsOpponent,
                psoGoalsMain,
                psoGoalsOpponent,
            });
            const gameUpdate: Pick<Game, 'resultTendency' | 'fullTimeGoalsMain' | 'fullTimeGoalsOpponent' | 'halfTimeGoalsMain' | 'halfTimeGoalsOpponent' | 'aetGoalsMain' | 'aetGoalsOpponent' | 'psoGoalsMain' | 'psoGoalsOpponent' | 'yellowCardsMain' | 'yellowCardsOpponent' | 'yellowRedCardsMain' | 'yellowRedCardsOpponent' | 'redCardsMain' | 'redCardsOpponent' | 'penaltiesScoredMain' | 'penaltiesScoredOpponent' | 'penaltiesMissedMain' | 'penaltiesMissedOpponent' | 'directFreeKickGoalsMain' | 'directFreeKickGoalsOpponent' | 'bicycleKickGoalsMain' | 'bicycleKickGoalsOpponent' | 'ownGoalsMain' | 'ownGoalsOpponent' | 'turnaroundsMain' | 'turnaroundsOpponent'> = {
                resultTendency,
                fullTimeGoalsMain,
                fullTimeGoalsOpponent,
                halfTimeGoalsMain,
                halfTimeGoalsOpponent,
                ownGoalsMain,
                ownGoalsOpponent,
                penaltiesScoredMain,
                penaltiesScoredOpponent,
                penaltiesMissedMain: penaltiesTakenMain - penaltiesScoredMain,
                penaltiesMissedOpponent: penaltiesTakenOpponent - penaltiesScoredOpponent,
                bicycleKickGoalsMain,
                bicycleKickGoalsOpponent,
                directFreeKickGoalsMain,
                directFreeKickGoalsOpponent,
                yellowCardsMain,
                yellowCardsOpponent,
                yellowRedCardsMain,
                yellowRedCardsOpponent,
                redCardsMain,
                redCardsOpponent,
                aetGoalsMain,
                aetGoalsOpponent,
                psoGoalsMain,
                psoGoalsOpponent,
                turnaroundsMain,
                turnaroundsOpponent,
            };
            await tx`update game set ${ tx(gameUpdate, 'resultTendency', 'fullTimeGoalsMain', 'fullTimeGoalsOpponent', 'halfTimeGoalsMain', 'halfTimeGoalsOpponent', 'aetGoalsMain', 'aetGoalsOpponent', 'psoGoalsMain', 'psoGoalsOpponent', 'yellowCardsMain', 'yellowCardsOpponent', 'yellowRedCardsMain', 'yellowRedCardsOpponent', 'redCardsMain', 'redCardsOpponent', 'penaltiesScoredMain', 'penaltiesScoredOpponent', 'penaltiesMissedMain', 'penaltiesMissedOpponent', 'directFreeKickGoalsMain', 'directFreeKickGoalsOpponent', 'bicycleKickGoalsMain', 'bicycleKickGoalsOpponent', 'ownGoalsMain', 'ownGoalsOpponent', 'turnaroundsMain', 'turnaroundsOpponent') } where id = ${gameId}`;

            return gameId;
        });
    }

    async getLastFinishedGames(
        take: number,
        queryOptions: {
            onlySeasons?: ReadonlyArray<SeasonId>,
            onlyOpponents?: ReadonlyArray<ClubId>,
            onlyCompetitions?: ReadonlyArray<CompetitionId>,
            onlyHome?: boolean,
            onlyAway?: boolean, 
            excludeNeutralGround?: boolean,
            onlyDomestic?: boolean,
            onlyInternational?: boolean,
        },
    ): Promise<Game[]> {
        const result = await this.sql<GameDaoInterface[]>`
            select
                g.*
            from
                game g left join
                competition c on g.competition_id = c.id
            where
                g.status = ${ GameStatus.Finished } 
                ${isDefined(queryOptions.onlySeasons) ? this.andWhereInSeasonIds(queryOptions.onlySeasons) : this.sql``}
                ${isDefined(queryOptions.onlyOpponents) ? this.andWhereInOpponentIds(queryOptions.onlyOpponents) : this.sql``}
                ${isDefined(queryOptions.onlyCompetitions) ? this.andWhereInCompetitionIds(queryOptions.onlyCompetitions) : this.sql``}
                ${queryOptions.onlyHome === true ? this.andWhereHome(true) : this.sql``}
                ${queryOptions.onlyAway === true ? this.andWhereHome(false) : this.sql``}
                ${queryOptions.excludeNeutralGround === true ? this.andWhereNeutralGround(false) : this.sql``}
                ${queryOptions.onlyDomestic === true ? this.andWhereDomesticCompetition(true) : this.sql``}
                ${queryOptions.onlyInternational === true ? this.andWhereDomesticCompetition(false) : this.sql``}
            order by
                g.kickoff desc
            limit ${take}`;

        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    private andWhereHome(isHome: boolean) {
        return this.sql`and g.is_home_team = ${ isHome }`;
    }

    private andWhereNeutralGround(isNeutralGround: boolean) {
        return this.sql`and g.is_neutral_ground = ${ isNeutralGround }`;
    }

    private andWhereInOpponentIds(opponentIds: ReadonlyArray<ClubId>) {
         return this.sql`and g.opponent_id in ${ this.sql(opponentIds) }`;
    }

    private andWhereInCompetitionIds(competitionIds: ReadonlyArray<CompetitionId>) {
         return this.sql`and g.competition_id in ${ this.sql(competitionIds) }`;
    }

    private andWhereInSeasonIds(seasonIds: ReadonlyArray<SeasonId>) {
         return this.sql`and g.season_id in ${ this.sql(seasonIds) }`;
    }

    private andWhereDomesticCompetition(isDomestic: boolean) {
         return this.sql`and c.is_domestic = ${ isDomestic }`;
    }

    private async getMultipleByIdsResult(ids: number[]): Promise<GameDaoInterface[]> {
        return await this.sql<GameDaoInterface[]>`select * from game where id in ${ this.sql(ids) }`;
    }

    private convertToEntity(item: GameDaoInterface): Game {
        return {
            ...item,
            resultTendency: item.resultTendency as Tendency,
            status: item.status as GameStatus,
        }
    }

    private async resolveClubId(tx: postgres.TransactionSql, club: ClubInputDto): Promise<number> {
        if (club.clubId !== undefined) {
            return club.clubId;
        }

        const clubId = await this.getClubIdViaExternalProvider(tx, club.externalClub as ExternalClubDto);        
        if (clubId !== null) {
            return clubId;
        }

        let homeVenueId: number | undefined;
        if (club.externalClub?.homeVenue) {
            homeVenueId = await this.resolveVenueId(tx, club.externalClub.homeVenue);
        }

        return await this.createClubViaExternalProvider(tx, club.externalClub as ExternalClubDto, homeVenueId);
    }

    private async getClubIdViaExternalProvider(tx: postgres.TransactionSql, externalClub: ExternalClubDto): Promise<number | null> {
        const result = await tx`select club_id from external_provider_club where external_provider = ${externalClub.provider} and external_id = ${externalClub.id};`;
        if (result.length !== 1) {
            return null;
        }

        return result[0].clubId;
    }

    private async createClubViaExternalProvider(tx: postgres.TransactionSql, externalClub: ExternalClubDto, homeVenueId?: number): Promise<number> {
        const createdClubId = await this.clubMapper.create({
            name: externalClub.name,
            shortName: externalClub.shortName,
            city: externalClub.city,
            countryCode: externalClub.countryCode,
            iconSmall: externalClub.iconSmall,
            iconLarge: externalClub.iconLarge,
            primaryColour: externalClub.primaryColour,
            secondaryColour: externalClub.secondaryColour,
            district: externalClub.district,
            normalizedSearch: normalizeForSearch(externalClub.name),
            homeVenueId,
        }, tx);

        await tx`insert into external_provider_club (external_provider, external_id, club_id) values (${externalClub.provider}, ${externalClub.id}, ${createdClubId});`;

        return createdClubId;
    }

    private async resolveExistingScheduledGame(tx: postgres.TransactionSql, kickoff: DateString): Promise<GameId | null> {
        const existingGameResult = await tx<IdInterface[]>`select id from game where kickoff = ${kickoff} and status = ${ GameStatus.Scheduled }`;
        if (existingGameResult.length !== 1) {
            return null;
        }

        return existingGameResult[0].id;
    }

    private async resolvePersonId(tx: postgres.TransactionSql, person: PersonInputDto): Promise<number> {
        if (person.personId !== undefined) {
            return person.personId;
        }

        const personId = await this.getPersonIdViaExternalProvider(tx, person.externalPerson as ExternalPersonDto);        
        if (personId !== null) {
            return personId;
        }

        return await this.createPersonViaExternalProvider(tx, person.externalPerson as ExternalPersonDto);
    }

    private async getPersonIdViaExternalProvider(tx: postgres.TransactionSql, externalPerson: ExternalPersonDto): Promise<number | null> {
        const result = await tx`select person_id from external_provider_person where external_provider = ${externalPerson.provider} and external_id = ${externalPerson.id};`;
        if (result.length !== 1) {
            return null;
        }

        return result[0].personId;
    }

    private async createPersonViaExternalProvider(tx: postgres.TransactionSql, externalPerson: ExternalPersonDto): Promise<number> {
        const createdPersonId = await this.personMapper.create({
            firstName: externalPerson.firstName,
            lastName: externalPerson.lastName,
            avatar: externalPerson.avatarUrl,
            birthday: externalPerson.birthday,
            normalizedSearch: normalizeForSearch([externalPerson.firstName, externalPerson.lastName].join(" ")),
        }, tx);

        await tx`insert into external_provider_person (external_provider, external_id, person_id) values (${externalPerson.provider}, ${externalPerson.id}, ${createdPersonId});`;

        return createdPersonId;
    }

    private async resolveCompetitionId(tx: postgres.TransactionSql, competition: CompetitionInputDto): Promise<number> {
        if (competition.competitionId !== undefined) {
            return competition.competitionId;
        }

        const competitionId = await this.getCompetitionIdViaExternalProvider(tx, competition.externalCompetition as ExternalCompetitionDto);        
        if (competitionId !== null) {
            return competitionId;
        }

        return await this.createCompetitionViaExternalProvider(tx, competition.externalCompetition as ExternalCompetitionDto);
    }

    private async getCompetitionIdViaExternalProvider(tx: postgres.TransactionSql, externalCompetition: ExternalCompetitionDto): Promise<number | null> {
        const result = await tx`select competition_id from external_provider_competition where external_provider = ${externalCompetition.provider} and external_id = ${externalCompetition.id};`;
        if (result.length !== 1) {
            return null;
        }

        return result[0].competitionId;
    }

    private async createCompetitionViaExternalProvider(tx: postgres.TransactionSql, externalCompetition: ExternalCompetitionDto): Promise<number> {
        const createdCompetitionId = await this.competitionMapper.create({
            name: externalCompetition.name,
            shortName: externalCompetition.shortName,
            isDomestic: true,
            normalizedSearch: normalizeForSearch(externalCompetition.name),
        }, tx);

        await tx`insert into external_provider_competition (external_provider, external_id, competition_id) values (${externalCompetition.provider}, ${externalCompetition.id}, ${createdCompetitionId});`;

        return createdCompetitionId;
    }

    private async resolveVenueId(tx: postgres.TransactionSql, venue: VenueInputDto): Promise<number> {
        if (venue.venueId !== undefined) {
            return venue.venueId;
        }

        const venueId = await this.getVenueIdViaExternalProvider(tx, venue.externalVenue as ExternalVenueDto);        
        if (venueId !== null) {
            return venueId;
        }

        return await this.createVenueViaExternalProvider(tx, venue.externalVenue as ExternalVenueDto);
    }

    private async getVenueIdViaExternalProvider(tx: postgres.TransactionSql, externalVenue: ExternalVenueDto): Promise<number | null> {
        const result = await tx`select venue_id from external_provider_venue where external_provider = ${externalVenue.provider} and external_id = ${externalVenue.id};`;
        if (result.length !== 1) {
            return null;
        }

        return result[0].venueId;
    }

    private async createVenueViaExternalProvider(tx: postgres.TransactionSql, externalVenue: ExternalVenueDto): Promise<number> {
        const createdVenueId = await this.venueMapper.create({
            name: externalVenue.name,
            shortName: externalVenue.shortName,
            city: externalVenue.city,
            capacity: externalVenue.capacity,
            countryCode: externalVenue.countryCode,
            latitude: externalVenue.latitude,
            longitude: externalVenue.longitude,
            district: externalVenue.district,
            normalizedSearch: normalizeForSearch([externalVenue.name, externalVenue.city].join(" ")),
        }, tx);

        await tx`insert into external_provider_venue (external_provider, external_id, venue_id) values (${externalVenue.provider}, ${externalVenue.id}, ${createdVenueId});`;

        return createdVenueId;
    }

    private async resolveGamePlayers(tx: postgres.TransactionSql, gameId: number, lineups: CreateGamePlayerDto[]): Promise<CreateGamePlayer[]> {
        const result: CreateGamePlayer[] = [];

        for (const item of lineups) {
            result.push({
                sortOrder: item.sortOrder,
                gameId,
                personId: await this.resolvePersonId(tx, item.person),
                shirt: item.shirt,
                forMain: item.forMain,
                isStarting: item.isStarting,
                isCaptain: item.isCaptain,
                positionKey: item.positionKey,
                positionGrid: item.positionGrid,
                goalsScored: 0,
                assists: 0,
                ownGoals: 0,
                yellowCard: false,
                yellowRedCard: false,
                redCard: false,
                regulationPenaltiesTaken: 0,
                regulationPenaltiesScored: 0,
                regulationPenaltiesFaced: 0,
                regulationPenaltiesSaved: 0,
                psoPenaltiesTaken: 0,
                psoPenaltiesScored: 0,
                psoPenaltiesFaced: 0,
                psoPenaltiesSaved: 0,
            })
        }

        return result;
    }

    private async resolveGameManagers(tx: postgres.TransactionSql, gameId: number, managers: CreateGameManagerDto[]): Promise<CreateGameManager[]> {
        const result: CreateGameManager[] = [];

        for (const item of managers) {
            result.push({
                sortOrder: item.sortOrder,
                gameId,
                personId: await this.resolvePersonId(tx, item.person),
                forMain: item.forMain,
                role: item.role,
            })
        }

        return result;
    }

    private async resolveGameReferees(tx: postgres.TransactionSql, gameId: number, referees: CreateGameRefereeDto[]): Promise<CreateGameReferee[]> {
        const result: CreateGameReferee[] = [];

        for (const item of referees) {
            result.push({
                sortOrder: item.sortOrder,
                gameId,
                personId: await this.resolvePersonId(tx, item.person),
                role: item.role,
            })
        }

        return result;
    }

}