import { SmallPersonDto } from "./small-person";
import { PlayerSeasonStatsItemDto } from "./stats-player";

export interface GetPersonByIdResponseDto {
    person: SmallPersonDto;
    stats?: Array<PlayerSeasonStatsItemDto>;
}