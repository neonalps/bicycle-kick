import { BasicGameDto } from "@src/model/external/dto/basic-game";
import { GetGamesRequestDto } from "@src/model/external/dto/get-games-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { Capability } from "@src/model/internal/capabilities";
import { PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES } from "@src/module/pagination/constants";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { GetGamesPaginatedRouteHandler } from "./handler";
import { requireNonNull } from "@src/util/common";

export class GetGamesPaginatedRouteProvider implements RouteProvider<GetGamesRequestDto, PaginatedResponseDto<BasicGameDto>> {

    private readonly handler: GetGamesPaginatedRouteHandler;

    constructor(handler: GetGamesPaginatedRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetGamesRequestDto, PaginatedResponseDto<BasicGameDto>> {
        const schema: RequestSchema = {
            querystring: {
                type: 'object',
                required: [],
                properties: {
                    tendency: { type: 'string', enum: ['w', 'l', 'd'] },
                    competitionId: { type: 'string' },
                    opponentId: { type: 'string' },
                    seasonId: { type: 'string' },
                    ...PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES,
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'GetGamesPaginated',
            method: 'GET',
            path: '/api/v1/games',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadGame,
            ]
        }
    }

}