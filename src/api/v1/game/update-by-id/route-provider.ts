import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { UpdateGameByIdRouteHandler } from "./handler";
import { Capability } from "@src/model/internal/capabilities";
import { updateGameRequestSchema } from "@src/model/external/validation/update-game-request";
import { UpdateGameRequestDto } from "@src/model/external/dto/update-game-request";
import { DetailedGameDto } from "@src/model/external/dto/detailed-game";

export class UpdateGameByIdRouteProvider implements RouteProvider<UpdateGameRequestDto, DetailedGameDto> {

    private readonly handler: UpdateGameByIdRouteHandler;

    constructor(handler: UpdateGameByIdRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<UpdateGameRequestDto, DetailedGameDto> {
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
            },
            body: updateGameRequestSchema,
        };

        return {
            name: 'UpdateGameById',
            method: 'POST',
            path: '/api/v1/games/:gameId',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.WriteGame,
            ]
        }
    }

}