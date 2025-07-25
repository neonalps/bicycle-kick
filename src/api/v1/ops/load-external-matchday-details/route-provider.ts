import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { LoadExternalMatchdayDetailsRouteHandler } from "./handler";
import { MatchdayDetailsResponseDto } from "@src/model/external/dto/matchday-details-response";

export class LoadExternalMatchdayDetailsRouteProvider implements RouteProvider<void, MatchdayDetailsResponseDto> {

    private readonly handler: LoadExternalMatchdayDetailsRouteHandler;

    constructor(handler: LoadExternalMatchdayDetailsRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<void, MatchdayDetailsResponseDto> {
        const schema: RequestSchema = {
            
        };

        return {
            name: 'LoadExternalMatchdayDetails',
            method: 'GET',
            path: '/api/v1/ops/load-external-matchday-details',
            schema,
            handler: this.handler,
            authenticated: false,
        }
    }

}