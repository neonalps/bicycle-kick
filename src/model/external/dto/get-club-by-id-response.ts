import { OmitStrict } from "@src/util/types";
import { BasicClubDto } from "./basic-club";
import { BasicGameDto } from "./basic-game";
import { ExternalProviderLinkDto } from "@src/model/external/dto/external-provider-link";

export interface GetClubByIdResponseDto {
    club: BasicClubDto;
    allGames?: OmitStrict<BasicGameDto, 'opponent'>[];
    lastGames?: OmitStrict<BasicGameDto, 'opponent'>[];
    externalLinks?: ReadonlyArray<ExternalProviderLinkDto>;
}