import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetAllSeasonsRouteHandler } from "@src/api/v1/season/get-all/handler";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { GetAllSeasonsRequestDto } from "@src/model/external/dto/get-all-seasons-request";
import { PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES } from "@src/module/pagination/constants";
import { SmallSeasonDto } from "@src/model/external/dto/small-season";

export class GetAllSeasonsRouteProvider implements RouteProvider<GetAllSeasonsRequestDto, PaginatedResponseDto<SmallSeasonDto>> {

    private readonly handler: GetAllSeasonsRouteHandler;

    constructor(handler: GetAllSeasonsRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetAllSeasonsRequestDto, PaginatedResponseDto<SmallSeasonDto>> {
        const schema: RequestSchema = {
            querystring: {
                type: 'object',
                required: [],
                properties: {
                    ...PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES,
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'GetAllSeasons',
            method: 'GET',
            path: '/api/v1/seasons',
            schema,
            handler: this.handler,
            authenticated: false,
        }
    }

}