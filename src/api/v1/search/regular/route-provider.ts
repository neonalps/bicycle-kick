import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { SearchEntity } from "@src/module/search/entities";
import { RegularSearchRouteHandler } from "./handler";
import { RegularSearchRequestDto } from "@src/model/external/dto/regular-search-request";
import { RegularSearchResponseDto } from "@src/model/external/dto/regular-search-response";

export class RegularSearchRouteProvider implements RouteProvider<RegularSearchRequestDto, RegularSearchResponseDto> {

    private readonly handler: RegularSearchRouteHandler;

    constructor(handler: RegularSearchRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<RegularSearchRequestDto, RegularSearchResponseDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['search'],
                properties: {
                    search: { type: 'string' },
                    filters: {
                        type: 'array', 
                        items: {
                            type: 'string',
                            enum: [SearchEntity.Club, SearchEntity.Game, SearchEntity.Person, SearchEntity.Season],
                        },
                    },
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'RegularSearch',
            method: 'POST',
            path: '/api/v1/search/regular',
            schema,
            handler: this.handler,
            authenticated: false,
            response: {
                statusCode: 200,
            }
        }
    }

}