import { requireNonNull } from "@src/util/common";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { SendMagicLinkHandler } from "./handler";

export class SendMagicLinkRouteProvider implements RouteProvider<void, void> {

    private readonly handler: SendMagicLinkHandler;

    constructor(handler: SendMagicLinkHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<void, void> {
        const schema: RequestSchema = {};

        return {
            name: 'SendMagicLinkLoginMail',
            method: 'POST',
            path: '/api/v1/auth/send-magic-link',
            schema,
            handler: this.handler,
            authenticated: true,
        };
    }

}