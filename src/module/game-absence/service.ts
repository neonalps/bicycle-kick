import { GameId } from "@src/util/domain-types";
import { GameAbsenceMapper } from "./mapper";
import { GameAbsence } from "@src/model/internal/game-absence";
import { validateNotNull } from "@src/util/validation";
import { OmitStrict } from "@src/util/types";
import { CompetitionService } from "@src/module/competition/service";
import { GameService } from "@src/module/game/service";
import { promiseAllObject } from "@src/util/common";
import { GameAbsenceType } from "@src/model/type/game-absence";
import { StatsService } from "@src/module/stats/service";

export type PotentialGameAbsence = OmitStrict<GameAbsence, 'id'>;

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

        const game = await this.gameService.requireById(gameId);
        const relevantCompetitionIds = await this.competitionService.getRelevantCompetitionIds(game.competitionId);

        const { previousGameArray: [previousGame], competitionYellowCards } = await promiseAllObject({
            previousGameArray: this.gameService.getPreviousGames(new Date(game.kickoff), 1, { 
                onlyCompetitions: relevantCompetitionIds,
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

        // find all at-risk players (+ managers?)

        // get all injured players from the last game
        // get all exempt players from the last game
        const previousGameAbsences = await this.getForGame(previousGame.id);

        return previousGameAbsences.filter(absence => [GameAbsenceType.Injured, GameAbsenceType.Exempt].includes(absence.absenceType));
    }

}