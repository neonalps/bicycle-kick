import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { UnattendGameHandler } from "./handler";
import { GameIdRequestDto } from "@src/model/external/dto/game-id-request";

export class UnattendGameRouteProvider implements RouteProvider<GameIdRequestDto, void> {

    private readonly handler: UnattendGameHandler;

    constructor(handler: UnattendGameHandler) {
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
            name: 'UnattendGame',
            method: 'DELETE',
            path: '/api/v1/games/:gameId/attend',
            schema,
            handler: this.handler,
            authenticated: true,
            response: {
                statusCode: 204,
            }
        }
    }

}