import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { GetPlayerYellowCardsStatsRouteHandler } from "./handler";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES } from "@src/module/pagination/constants";
import { GetPlayerYellowCardsRequestDto } from "@src/model/external/dto/get-player-yellow-cards-request";
import { GetPlayerYellowCardsResponseDto } from "@src/model/external/dto/get-player-yellow-cards-response";

export class GetPlayerYellowCardsStatsRouteProvider implements RouteProvider<GetPlayerYellowCardsRequestDto, PaginatedResponseDto<GetPlayerYellowCardsResponseDto>> {

    private readonly handler: GetPlayerYellowCardsStatsRouteHandler;

    constructor(handler: GetPlayerYellowCardsStatsRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetPlayerYellowCardsRequestDto, PaginatedResponseDto<GetPlayerYellowCardsResponseDto>> {
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
            name: 'GetPlayerYellowCardsStats',
            method: 'GET',
            path: '/api/v1/stats/player-yellow-cards',
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