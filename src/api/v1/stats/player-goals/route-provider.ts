import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { GetPlayerGoalsStatsRouteHandler } from "./handler";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES } from "@src/module/pagination/constants";
import { GetPlayerGoalsResponseDto } from "@src/model/external/dto/get-player-goals-response";
import { GetPlayerGoalsRequestDto } from "@src/model/external/dto/get-player-goals-request";

export class GetPlayerGoalsStatsRouteProvider implements RouteProvider<GetPlayerGoalsRequestDto, PaginatedResponseDto<GetPlayerGoalsResponseDto>> {

    private readonly handler: GetPlayerGoalsStatsRouteHandler;

    constructor(handler: GetPlayerGoalsStatsRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetPlayerGoalsRequestDto, PaginatedResponseDto<GetPlayerGoalsResponseDto>> {
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
            name: 'GetPlayerGoalsStats',
            method: 'GET',
            path: '/api/v1/stats/player-goals',
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