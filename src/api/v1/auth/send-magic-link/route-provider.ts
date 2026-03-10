import { requireNonNull } from "@src/util/common";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { SendMagicLinkHandler } from "./handler";
import { SendMagicLinkMailRequestDto } from "@src/model/external/dto/send-magic-link-request";

export class SendMagicLinkRouteProvider implements RouteProvider<SendMagicLinkMailRequestDto, void> {

    private readonly handler: SendMagicLinkHandler;

    constructor(handler: SendMagicLinkHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<SendMagicLinkMailRequestDto, void> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['email'],
                properties: {
                    email: {
                        type: 'string'
                    }
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'SendMagicLinkLoginMail',
            method: 'POST',
            path: '/api/v1/auth/send-magic-link',
            schema,
            handler: this.handler,
            authenticated: false,
        };
    }

}