import { BasicPersonDto } from "./basic-person";
import { PlayerSeasonStatsItemDto } from "./stats-player";

export interface GetPersonByIdResponseDto {
    person: BasicPersonDto;
    stats?: Array<PlayerSeasonStatsItemDto>;
}