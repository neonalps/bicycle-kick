import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { GetPlayerAppearancesResponseDto } from "@src/model/external/dto/get-player-appearances-response";
import { GetPlayerAppearancesRequestDto } from "@src/model/external/dto/get-player-appearances-request";
import { GetPlayerAppearanceStatsRouteHandler } from "./handler";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES } from "@src/module/pagination/constants";

export class GetPlayerAppearanceStatsRouteProvider implements RouteProvider<GetPlayerAppearancesRequestDto, PaginatedResponseDto<GetPlayerAppearancesResponseDto>> {

    private readonly handler: GetPlayerAppearanceStatsRouteHandler;

    constructor(handler: GetPlayerAppearanceStatsRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetPlayerAppearancesRequestDto, PaginatedResponseDto<GetPlayerAppearancesResponseDto>> {
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
            name: 'GetPlayerAppearanceStats',
            method: 'GET',
            path: '/api/v1/stats/player-appearances',
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