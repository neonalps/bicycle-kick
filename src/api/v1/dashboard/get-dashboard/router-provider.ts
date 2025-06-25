import { DashboardResponseDto } from "@src/model/external/dto/dashboard-response";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { GetDashboardHandler } from "./handler";
import { requireNonNull } from "@src/util/common";

export class GetDashboardRouteProvider implements RouteProvider<void, DashboardResponseDto> {

    private readonly handler: GetDashboardHandler;

    constructor(handler: GetDashboardHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<void, DashboardResponseDto> {
        const schema: RequestSchema = {};

        return {
            name: 'GetDashboard',
            method: 'GET',
            path: '/api/v1/dashboard',
            schema,
            handler: this.handler,
            authenticated: false,
        }
    }

}