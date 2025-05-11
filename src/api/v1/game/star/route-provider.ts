import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { StarGameHandler } from "./handler";
import { GameIdRequestDto } from "@src/model/external/dto/game-id-request";

export class StarGameRouteProvider implements RouteProvider<GameIdRequestDto, void> {

    private readonly handler: StarGameHandler;

    constructor(handler: StarGameHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GameIdRequestDto, void> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: ['gameId'],
                properties: {
                    gameId: {
                        'type': 'string',
                    },
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'StarGame',
            method: 'POST',
            path: '/api/v1/games/:gameId/star',
            schema,
            handler: this.handler,
            authenticated: true,
            response: {
                statusCode: 204,
            }
        }
    }

}