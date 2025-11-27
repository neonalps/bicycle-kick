import { AccountGameInformationDto } from "@src/model/external/dto/account-game-information";
import { CacheableResponse, RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetAccountGameInformationRouteHandler } from "./handler";

export class GetAccountGameInformationRouteProvider implements RouteProvider<void, CacheableResponse<AccountGameInformationDto>> {

    private readonly handler: GetAccountGameInformationRouteHandler;

    constructor(handler: GetAccountGameInformationRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<void, CacheableResponse<AccountGameInformationDto>> {
        const schema: RequestSchema = {};

        return {
            name: 'GetAccountGameInformation',
            method: 'GET',
            path: '/api/v1/account/game-information',
            schema,
            handler: this.handler,
            authenticated: true,
        }
    }

}