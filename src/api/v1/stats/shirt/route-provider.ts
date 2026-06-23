import { GetShirtStatsRequestDto } from "@src/model/external/dto/get-shirt-stats-request";
import { GetShirtStatsResponseDto } from "@src/model/external/dto/get-shirt-stats-response";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { GetShirtStatsRouteHandler } from "./handler";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";

export class GetShirtStatsRouteProvider implements RouteProvider<GetShirtStatsRequestDto, GetShirtStatsResponseDto> {

    private readonly handler: GetShirtStatsRouteHandler;
    
    constructor(handler: GetShirtStatsRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetShirtStatsRequestDto, GetShirtStatsResponseDto> {
        const schema: RequestSchema = {
            querystring: {
                type: 'object',
                required: [],
                properties: {
                    shirt: { type: 'string' },
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'GetOverallShirtStats',
            method: 'GET',
            path: '/api/v1/stats/shirt',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadPerson,
                Capability.ReadStats,
            ]
        }
    }

}