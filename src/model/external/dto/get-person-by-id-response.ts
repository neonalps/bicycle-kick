import { BasicPersonDto } from "./basic-person";
import { GoalsAgainstClubStatsItemDto, PlayerSeasonStatsItemDto } from "./stats-player";
import { ExternalProviderLinkDto } from "@src/model/external/dto/external-provider-link";

export interface GetPersonByIdResponseDto {
    person: BasicPersonDto;
    stats?: {
        performance?: ReadonlyArray<PlayerSeasonStatsItemDto>;
        goalsAgainstClubs?: ReadonlyArray<GoalsAgainstClubStatsItemDto>;
    },
    externalLinks?: ReadonlyArray<ExternalProviderLinkDto>;
}