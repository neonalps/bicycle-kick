import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { CreateGameRequestDto } from "@src/model/external/dto/create-game-request";
import { CreateGameRouteHandler } from "./handler";
import { DetailedGameDto } from "@src/model/external/dto/detailed-game";
import { createGameRequestSchema } from "@src/model/external/validation/create-game-request";

export class CreateGameRouteProvider implements RouteProvider<CreateGameRequestDto, DetailedGameDto> {

    private readonly handler: CreateGameRouteHandler;

    constructor(handler: CreateGameRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<CreateGameRequestDto, DetailedGameDto> {
        const schema: RequestSchema = {
            body: createGameRequestSchema,
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