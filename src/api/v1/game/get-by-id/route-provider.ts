import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetGameByIdRouteHandler } from "./handler";
import { GetGameByIdRequestDto } from "@src/model/external/dto/get-game-by-id-request";
import { DetailedGameDto } from "@src/model/external/dto/detailed-game";
import { Capability } from "@src/model/internal/capabilities";

export class GetGameByIdRouteProvider implements RouteProvider<GetGameByIdRequestDto, DetailedGameDto> {

    private readonly handler: GetGameByIdRouteHandler;

    constructor(handler: GetGameByIdRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetGameByIdRequestDto, DetailedGameDto> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: [
                    'gameId'
                ],
                properties: {
                    gameId: { type: 'string' },
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'GetGameById',
            method: 'GET',
            path: '/api/v1/games/:gameId',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadGame,
            ]
        }
    }

}