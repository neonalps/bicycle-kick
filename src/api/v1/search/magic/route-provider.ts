import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { MagicSearchRouteHandler } from "@src/api/v1/search/magic/handler";
import { MagicSearchRequestDto } from "@src/model/external/dto/magic-search-request";
import { MagicSearchResponseDto } from "@src/model/external/dto/magic-search-response";

export class MagicSearchRouteProvider implements RouteProvider<MagicSearchRequestDto, MagicSearchResponseDto> {

    private readonly handler: MagicSearchRouteHandler;

    constructor(handler: MagicSearchRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<MagicSearchRequestDto, MagicSearchResponseDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['inquiry'],
                properties: {
                    inquiry: { type: 'string' },
                    channel: { type: 'string' },
                },
                additionalProperties: false,
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