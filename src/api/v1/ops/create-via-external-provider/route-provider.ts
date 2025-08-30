import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { SofascoreGameDto } from "@src/module/external-provider/sofascore/types";
import { CreateGameViaExternalProviderRouteHandler } from "./handler";
import { DetailedGameDto } from "@src/model/external/dto/detailed-game";
import { Capability } from "@src/model/internal/capabilities";

export class CreateGameViaExternalProviderRouteProvider implements RouteProvider<SofascoreGameDto, DetailedGameDto> {

    private readonly handler: CreateGameViaExternalProviderRouteHandler;

    constructor(handler: CreateGameViaExternalProviderRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<SofascoreGameDto, DetailedGameDto> {
        const schema: RequestSchema = {
            
        };

        return {
            name: 'CreateGameViaExternalProvider',
            method: 'POST',
            path: '/api/v1/ops/create-game-via-external-provider',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.WriteGame,
                Capability.WriteClub,
                Capability.WritePerson,
            ]
        }
    }

}