import { CompetitionId, DateString, GameId, SeasonId, SeasonTitleId } from "@src/util/domain-types";

export interface SeasonTitleDaoInterface {
    id: SeasonTitleId;
    seasonId: SeasonId;
    competitionId: CompetitionId;
    victoryDate?: DateString;
    victoryGame?: GameId;
    titleCount: number;
}