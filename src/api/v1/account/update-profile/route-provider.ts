import { AccountProfileDto } from "@src/model/external/dto/account-profile";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { UpdateAccountProfileDto } from "@src/model/external/dto/update-account-profile";
import { UpdateAccountProfileRouteHandler } from "./handler";

export class UpdateAccountProfileRouteProvider implements RouteProvider<UpdateAccountProfileDto, AccountProfileDto> {

    private readonly handler: UpdateAccountProfileRouteHandler;

    constructor(handler: UpdateAccountProfileRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<UpdateAccountProfileDto, AccountProfileDto> {
        const schema: RequestSchema = {};

        return {
            name: 'UpdateAccountProfile',
            method: 'PUT',
            path: '/api/v1/account/profile',
            schema,
            handler: this.handler,
            authenticated: true,
        }
    }

}