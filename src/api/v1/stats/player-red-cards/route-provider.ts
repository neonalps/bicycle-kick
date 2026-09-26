import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { GetPlayerRedCardsStatsRouteHandler } from "./handler";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES } from "@src/module/pagination/constants";
import { GetPlayerCardsRequestDto } from "@src/model/external/dto/get-player-cards-request";
import { GetPlayerCardsResponseDto } from "@src/model/external/dto/get-player-cards-response";

export class GetPlayerRedCardsStatsRouteProvider implements RouteProvider<GetPlayerCardsRequestDto, PaginatedResponseDto<GetPlayerCardsResponseDto>> {

    private readonly handler: GetPlayerRedCardsStatsRouteHandler;

    constructor(handler: GetPlayerRedCardsStatsRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetPlayerCardsRequestDto, PaginatedResponseDto<GetPlayerCardsResponseDto>> {
        const schema: RequestSchema = {
            querystring: {
                type: 'object',
                required: [],
                properties: {
                    forMain: { type: 'boolean' },
                    competitions: { type: 'string' },
                    opponents: { type: 'string' },
                    seasons: { type: 'string' },
                    ...PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES,
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'GetPlayerRedCardsStats',
            method: 'GET',
            path: '/api/v1/stats/player-yellow-red-cards',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadStats,
                Capability.ReadPerson,
            ]
        }
    }

}