import { BasicGameDto } from "./basic-game";
import { BasicPersonDto } from "./basic-person";
import { GoalsAgainstClubStatsItemDto, PlayerSeasonStatsItemDto, PlayerStatsItemDto } from "./stats-player";
import { ExternalProviderLinkDto } from "@src/model/external/dto/external-provider-link";

export interface GetPersonByIdResponseDto {
    person: BasicPersonDto;
    stats?: {
        performance?: ReadonlyArray<PlayerSeasonStatsItemDto>;
        opponent?: PlayerStatsItemDto;
        goalsAgainstClubs?: ReadonlyArray<GoalsAgainstClubStatsItemDto>;
        refereeGames?: ReadonlyArray<BasicGameDto>;
    },
    externalLinks?: ReadonlyArray<ExternalProviderLinkDto>;
}