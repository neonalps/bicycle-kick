import { AdvancedQueryService } from "@src/module/advanced-query/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { MagicSearchRequestDto } from "@src/model/external/dto/magic-search-request";
import { MagicSearchResponseDto } from "@src/model/external/dto/magic-search-response";
import { AdvancedQueryResult } from "@src/module/advanced-query/result";
import { ApiHelperService } from "@src/module/api-helper/service";

export class MagicSearchRouteHandler implements RouteHandler<MagicSearchRequestDto, MagicSearchResponseDto> {

    constructor(private readonly advancedQueryService: AdvancedQueryService, private readonly apiHelperService: ApiHelperService) {}

    public async handle(_: AuthenticationContext, dto: MagicSearchRequestDto): Promise<MagicSearchResponseDto> {
        const queryResult = await this.advancedQueryService.search(dto.inquiry) as AdvancedQueryResult;
        
        const games = queryResult.games;
        const detailedResults = await this.apiHelperService.getMultipleGamesWithDetails(games.map(game => game.id));

        return {
            gameDetails: detailedResults,
            response: queryResult.query,
        }
    }

}