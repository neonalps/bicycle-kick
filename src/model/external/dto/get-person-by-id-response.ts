import { BasicGameDto } from "./basic-game";
import { BasicPersonDto } from "./basic-person";
import { ShirtDistributionItemDto } from "./shirt-distribution-item";
import { GoalsAgainstClubStatsItemDto, PlayerSeasonStatsItemDto, PlayerStatsItemDto } from "./stats-player";
import { ExternalProviderLinkDto } from "@src/model/external/dto/external-provider-link";

export interface GetPersonByIdResponseDto {
    person: BasicPersonDto;
    stats?: {
        performance?: ReadonlyArray<PlayerSeasonStatsItemDto>;
        opponent?: PlayerStatsItemDto;
        goalsAgainstClubs?: ReadonlyArray<GoalsAgainstClubStatsItemDto>;
        refereeGames?: ReadonlyArray<BasicGameDto>;
        shirtDistribution?: ReadonlyArray<ShirtDistributionItemDto>;
    },
    externalLinks?: ReadonlyArray<ExternalProviderLinkDto>;
}