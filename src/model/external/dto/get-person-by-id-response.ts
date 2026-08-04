import { BasicGameDto } from "./basic-game";
import { BasicPersonDto } from "./basic-person";
import { ManagerPeriodForPersonDto } from "./manager-period";
import { ContractForPersonDto } from "./person-contract";
import { ShirtDistributionItemDto } from "./shirt-distribution-item";
import { GoalsAgainstClubStatsItemDto, GoalTypeStatsItemDto, PlayerSeasonStatsItemDto, PlayerStatsItemDto } from "./stats-player";
import { ExternalProviderLinkDto } from "@src/model/external/dto/external-provider-link";

export interface GetPersonByIdResponseDto {
    person: BasicPersonDto;
    contract?: ContractForPersonDto;
    stats?: {
        performance?: ReadonlyArray<PlayerSeasonStatsItemDto>;
        opponent?: PlayerStatsItemDto;
        goalsAgainstClubs?: ReadonlyArray<GoalsAgainstClubStatsItemDto>;
        goalTypes?: ReadonlyArray<GoalTypeStatsItemDto>;
        refereeGames?: ReadonlyArray<BasicGameDto>;
        shirtDistribution?: ReadonlyArray<ShirtDistributionItemDto>;
        managerPeriods?: ReadonlyArray<ManagerPeriodForPersonDto>;
    },
    externalLinks?: ReadonlyArray<ExternalProviderLinkDto>;
}