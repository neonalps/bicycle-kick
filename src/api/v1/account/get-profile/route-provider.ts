import { AccountProfileDto } from "@src/model/external/dto/account-profile";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { GetAccountProfileRouteHandler } from "./handler";
import { requireNonNull } from "@src/util/common";

export class GetAccountProfileRouteProvider implements RouteProvider<void, AccountProfileDto> {

    private readonly handler: GetAccountProfileRouteHandler;

    constructor(handler: GetAccountProfileRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<void, AccountProfileDto> {
        const schema: RequestSchema = {};

        return {
            name: 'GetAccountProfile',
            method: 'GET',
            path: '/api/v1/account/profile',
            schema,
            handler: this.handler,
            authenticated: true,
        }
    }

}