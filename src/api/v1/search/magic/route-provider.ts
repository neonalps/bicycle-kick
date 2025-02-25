import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { MagicSearchRouteHandler } from "./handler";

export class MagicSearchRouteProvider implements RouteProvider<void, void> {

    private readonly handler: MagicSearchRouteHandler;

    constructor(handler: MagicSearchRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<ProfileLoginRequestDto, ProfileLoginResponseDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['inquiry'],
                properties: {
                    inquiry: { type: 'string' },
                    source: { type: 'string' },
                },
            },
        };

        return {
            name: 'MagicSearch',
            method: 'POST',
            path: '/api/v1/search/magic',
            schema,
            handler: this.handler,
            authenticated: false,
        }
    }

}