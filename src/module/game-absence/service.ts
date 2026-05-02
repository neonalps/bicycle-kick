import { GameId } from "@src/util/domain-types";
import { GameAbsenceMapper } from "./mapper";
import { GameAbsence } from "@src/model/internal/game-absence";
import { validateNotNull } from "@src/util/validation";
import { OmitStrict } from "@src/util/types";
import { CompetitionService } from "@src/module/competition/service";
import { GameService } from "@src/module/game/service";
import { isDefined, promiseAllObject } from "@src/util/common";
import { GameAbsenceReason, GameAbsenceType } from "@src/model/type/game-absence";
import { PersonSum, StatsService } from "@src/module/stats/service";

export type PotentialGameAbsence = OmitStrict<GameAbsence, 'id'>;
export type YellowCardSuspensionSequence = number[];

export class GameAbsenceService {

    constructor(
        private readonly mapper: GameAbsenceMapper,
        private readonly competitionService: CompetitionService,
        private readonly gameService: GameService,
        private readonly statsService: StatsService,
    ) {}

    async getForGame(gameId: GameId): Promise<GameAbsence[]> {
        validateNotNull(gameId, "gameId");

        return await this.mapper.getForGame(gameId);
    }

    async getOrderedAbsencesForGamesMap(gameIds: GameId[]): Promise<Map<GameId, GameAbsence[]>> {
        validateNotNull(gameIds, "gameIds");
        if (gameIds.length === 0) {
            return new Map();
        }

        return await this.mapper.getOrderedAbsencesForGamesMap(gameIds);
    }

    async findPotentialAbsencesForGame(gameId: GameId): Promise<Array<PotentialGameAbsence>> {
        validateNotNull(gameId, "gameId");

        const potentialGameAbsences: PotentialGameAbsence[] = [];

        const game = await this.gameService.requireById(gameId);
        
        const { gameCompetition, relevantCompetitionIds } = await promiseAllObject({
            gameCompetition: this.competitionService.requireById(game.competitionId),
            relevantCompetitionIds: this.competitionService.getRelevantCompetitionIds(game.competitionId),
        });

        const { previousGameArray: [previousGame], competitionYellowCards } = await promiseAllObject({
            previousGameArray: this.gameService.getPreviousGames(new Date(game.kickoff), 1, {
                // we do not filter for competition here, as we really want the previous game in this season
                onlySeasons: [game.seasonId],
            }),
            competitionYellowCards: this.statsService.getOrderedYellowCardsSum({
                onlyForMain: true,
                onlyCompetitions: relevantCompetitionIds,
                onlySeasons: [game.seasonId],
                onlyActiveSquadMembers: true,
            }),
        });

        // find all suspended players (+ managers?)
        const competitionYellowCardSuspensions = gameCompetition.yellowCardSuspensions;
        if (isDefined(competitionYellowCardSuspensions) && competitionYellowCardSuspensions.length > 0) {
            // if someone is currently at a value that would result in suspension, we must check whether they already have been suspended for it
            const potentiallySuspendedPersons = this.findPlayersForSuspensionSequenceOffset(competitionYellowCards, competitionYellowCardSuspensions);

            const yellowCardSuspensionsForCompetition = await this.mapper.findYellowCardSuspensionsForCompetition(potentiallySuspendedPersons.map(item => item.personId), [...relevantCompetitionIds], game.seasonId);
            const suspendedPersons = potentiallySuspendedPersons.filter(item => yellowCardSuspensionsForCompetition.find(suspension => suspension.personId === item.personId && suspension.absenceReason === `${GameAbsenceReason.YellowCard}:${item.sum}`) === undefined);
            potentialGameAbsences.push(...suspendedPersons.map(item => this.convertToPotentialYellowCardGameAbsence(item, game.id, GameAbsenceType.Suspended)));

            // find all at-risk players (+ managers?)
            const atRiskPersons = this.findPlayersForSuspensionSequenceOffset(competitionYellowCards, competitionYellowCardSuspensions, 1);
            potentialGameAbsences.push(...atRiskPersons.map(item => this.convertToPotentialYellowCardGameAbsence(item, game.id, GameAbsenceType.AtRisk)));
        }

        // get all injured players from the last game
        // get all exempt players from the last game
        const previousGameAbsences = await this.getForGame(previousGame.id);
        potentialGameAbsences.push(...previousGameAbsences.filter(absence => [GameAbsenceType.Injured, GameAbsenceType.Exempt].includes(absence.absenceType)));

        return potentialGameAbsences;
    }

    private findPlayersForSuspensionSequenceOffset(yellowCardPersonList: PersonSum[], suspensionSequence: YellowCardSuspensionSequence, targetOffset = 0): PersonSum[] {
        return yellowCardPersonList.filter(item => suspensionSequence.includes(item.sum + targetOffset));
    }

    private convertToPotentialYellowCardGameAbsence(item: PersonSum, gameId: GameId, absenceType: GameAbsenceType): PotentialGameAbsence {
        return {
            personId: item.personId,
            gameId: gameId,
            sortOrder: 0,
            absenceType: absenceType,
            absenceReason: `${GameAbsenceReason.YellowCard}:${item.sum}` as GameAbsenceReason,
        };
    }

}