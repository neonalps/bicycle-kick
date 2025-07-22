import { BasicPersonDto } from "./basic-person";
import { GoalsAgainstClubStatsItemDto, PlayerSeasonStatsItemDto } from "./stats-player";

export interface GetPersonByIdResponseDto {
    person: BasicPersonDto;
    stats?: {
        performance?: ReadonlyArray<PlayerSeasonStatsItemDto>;
        goalsAgainstClubs?: ReadonlyArray<GoalsAgainstClubStatsItemDto>;
    }
}