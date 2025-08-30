import { DashboardResponseDto } from "@src/model/external/dto/dashboard-response";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { GetDashboardHandler } from "./handler";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { DashboardRequestDto } from "@src/model/external/dto/dashboard-request";

export class GetDashboardRouteProvider implements RouteProvider<DashboardRequestDto, DashboardResponseDto> {

    private readonly handler: GetDashboardHandler;

    constructor(handler: GetDashboardHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<DashboardRequestDto, DashboardResponseDto> {
        const schema: RequestSchema = {
            querystring: {
                type: 'object',
                required: [],
                properties: {
                    widgets: { type: 'string' },
                    competition: { type: 'string' },
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'GetDashboard',
            method: 'GET',
            path: '/api/v1/dashboard',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadGame,
                Capability.ReadPerson,
            ]
        }
    }

}