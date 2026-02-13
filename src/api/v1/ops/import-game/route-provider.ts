import { ImportGameRequestDto } from "@src/model/external/dto/import-game-request";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { ImportGameRouteHandler } from "./handler";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { ImportGameResponseDto } from "@src/model/external/dto/import-game-response";

export class ImportGameRouteProvider implements RouteProvider<ImportGameRequestDto, ImportGameResponseDto> {

    private readonly handler: ImportGameRouteHandler;

    constructor(handler: ImportGameRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<ImportGameRequestDto, ImportGameResponseDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['gameId'],
                properties: {
                    gameId: { type: 'number' },
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'ImportGame',
            method: 'POST',
            path: '/api/v1/ops/import-game',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ImportGame,
            ]
        }
    }

}