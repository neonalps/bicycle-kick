import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetPersonByIdRequestDto } from "@src/model/external/dto/get-person-by-id-request";
import { GetPersonByIdRouteHandler } from "./handler";
import { GetPersonByIdResponseDto } from "@src/model/external/dto/get-person-by-id-response";

export class GetPersonByIdRouteProvider implements RouteProvider<GetPersonByIdRequestDto, GetPersonByIdResponseDto> {

    private readonly handler: GetPersonByIdRouteHandler;

    constructor(handler: GetPersonByIdRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetPersonByIdRequestDto, GetPersonByIdResponseDto> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: [ 'personId' ],
                properties: {
                    personId: { type: 'string' },
                },
                additionalProperties: false,
            },
            querystring: {
                type: 'object',
                required: [],
                properties: {
                    includeStatistics: { type: 'boolean' },
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'GetPersonById',
            method: 'GET',
            path: '/api/v1/people/:personId',
            schema,
            handler: this.handler,
            authenticated: false,
        }
    }

}