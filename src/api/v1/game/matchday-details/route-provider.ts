import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetMatchdayDetailsRouteHandler } from "./handler";
import { MatchdayDetailsResponseDto } from "@src/model/external/dto/matchday-details-response";
import { GetMatchdayDetailsRequestDto } from "@src/model/external/dto/get-matchday-details-request";

export class GetMatchdayDetailsRouteProvider implements RouteProvider<GetMatchdayDetailsRequestDto, MatchdayDetailsResponseDto> {

    private readonly handler: GetMatchdayDetailsRouteHandler;

    constructor(handler: GetMatchdayDetailsRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetMatchdayDetailsRequestDto, MatchdayDetailsResponseDto> {
        const schema: RequestSchema = {
            
        };

        return {
            name: 'GetMatchdayDetails',
            method: 'GET',
            path: '/api/v1/games/:gameId/matchday-details',
            schema,
            handler: this.handler,
            authenticated: false,
        }
    }

}