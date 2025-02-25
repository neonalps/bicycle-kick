import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { SeasonDto } from "@src/model/external/dto/season";
import { PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES } from "@src/module/pagination/constants";
import { BasicGameDto } from "@src/model/external/dto/basic-game";

export class GetGamesForSeasonRouteProvider implements RouteProvider<GetGamesForSeasonRequestDto, PaginatedResponseDto<BasicGameDto>> {

    private readonly handler: MagicSearchRouteHandler;

    constructor(handler: MagicSearchRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<void, PaginatedResponseDto<SeasonDto>> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: ['seasonId'],
                properties: {
                    seasonId: {
                        type: 'string',
                    },
                },
            },
        };

        return {
            name: 'GetGamesForSeason',
            method: 'GET',
            path: '/api/v1/seasons/:seasonId/games',
            schema,
            handler: this.handler,
            authenticated: true,
        }
    }

}