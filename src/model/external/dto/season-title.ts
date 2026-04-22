import { DateString, GameId, SeasonTitleId } from "@src/util/domain-types";
import { SmallSeasonDto } from "./small-season";
import { SmallCompetitionDto } from "./small-competition";

export interface SeasonTitleDto {
    id: SeasonTitleId;
    season: SmallSeasonDto;
    competition: SmallCompetitionDto;
    titleCount: number;
    victoryDate?: DateString;
    victoryGameId?: GameId;
}