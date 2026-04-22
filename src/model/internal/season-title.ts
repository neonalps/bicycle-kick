import { CompetitionId, GameId, SeasonId, SeasonTitleId } from "@src/util/domain-types";

export interface SeasonTitle {
    id: SeasonTitleId;
    seasonId: SeasonId;
    competitionId: CompetitionId;
    victoryDate?: Date;
    victoryGame?: GameId;
    titleCount: number;
}