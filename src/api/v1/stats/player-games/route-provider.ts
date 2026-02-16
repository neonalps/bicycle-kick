import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { ApplicationStatsResponseDto } from "@src/model/external/dto/overall-application-stats-response";
import { GetApplicationStatsRouteHandler } from "./handler";

export class GetPlayerGamesRouteProvider implements RouteProvider<void, ApplicationStatsResponseDto> {

    private readonly handler: GetApplicationStatsRouteHandler;

    constructor(handler: GetApplicationStatsRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<void, ApplicationStatsResponseDto> {
        const schema: RequestSchema = {};

        return {
            name: 'GetPlayerGamesStats',
            method: 'GET',
            path: '/api/v1/stats/player-games',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadStats,
            ]
        }
    }

}