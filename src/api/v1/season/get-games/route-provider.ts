import { BasicGameDto } from "@src/model/external/dto/basic-game";
import { GetSeasonGamesRequestDto } from "@src/model/external/dto/get-season-games.request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES } from "@src/module/pagination/constants";
import { CacheableResponse, RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetSeasonGamesRouteHandler } from "./handler";
import { Capability } from "@src/model/internal/capabilities";

export class GetSeasonGamesRouteProvider implements RouteProvider<GetSeasonGamesRequestDto, CacheableResponse<PaginatedResponseDto<BasicGameDto>>> {

    private readonly handler: GetSeasonGamesRouteHandler;
    
    constructor(handler: GetSeasonGamesRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetSeasonGamesRequestDto, CacheableResponse<PaginatedResponseDto<BasicGameDto>>> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: ['seasonId'],
                properties: {
                    seasonId: { type: 'string' },
                },
                additionalProperties: false,
            },
            querystring: {
                type: 'object',
                required: [],
                properties: {
                    ...PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES,
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'GetSeasonGames',
            method: 'GET',
            path: '/api/v1/seasons/:seasonId/games',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadSeason,
                Capability.ReadGame,
            ]
        }
    }

}