import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { CreateGameRequestDto } from "@src/model/external/dto/create-game-request";
import { CreateGameRouteHandler } from "./handler";

export class CreateGameRouteProvider implements RouteProvider<CreateGameRequestDto, void> {

    private readonly handler: CreateGameRouteHandler;

    constructor(handler: CreateGameRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<CreateGameRequestDto, void> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: [],
                properties: {
                    
                },
            },
        };

        return {
            name: 'CreateGame',
            method: 'POST',
            path: '/api/v1/games',
            schema,
            handler: this.handler,
            authenticated: true,
        }
    }

}