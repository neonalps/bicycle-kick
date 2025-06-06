import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { DeleteGameByIdRouteHandler } from "./handler";
import { DeleteGameByIdRequestDto } from "@src/model/external/dto/delete-game-by-id-request";

export class DeleteGameByIdRouteProvider implements RouteProvider<DeleteGameByIdRequestDto, void> {

    private readonly handler: DeleteGameByIdRouteHandler;

    constructor(handler: DeleteGameByIdRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<DeleteGameByIdRequestDto, void> {
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
            name: 'DeleteGameById',
            method: 'DELETE',
            path: '/api/v1/games/:gameId',
            schema,
            handler: this.handler,
            authenticated: false,
        }
    }

}