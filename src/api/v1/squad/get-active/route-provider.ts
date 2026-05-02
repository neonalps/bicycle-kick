import { CacheableResponse, RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetActiveSquadMembersRouteHandler } from "./handler";
import { Capability } from "@src/model/internal/capabilities";
import { GetActiveSquadResponseDto } from "@src/model/external/dto/get-active-squad-response";

export class GetActiveSquadMembersRouteProvider implements RouteProvider<void, CacheableResponse<GetActiveSquadResponseDto>> {

    private readonly handler: GetActiveSquadMembersRouteHandler;
    
    constructor(handler: GetActiveSquadMembersRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<void, CacheableResponse<GetActiveSquadResponseDto>> {
        const schema: RequestSchema = {};

        return {
            name: 'GetActiveSquad',
            method: 'GET',
            path: '/api/v1/squad',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadPerson,
            ]
        }
    }

}