import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetClubByIdRouteHandler } from "./handler";
import { GetClubByIdRequestDto } from "@src/model/external/dto/get-club-by-id-request";
import { GetClubByIdResponseDto } from "@src/model/external/dto/get-club-by-id-response";
import { Capability } from "@src/model/internal/capabilities";

export class GetClubByIdRouteProvider implements RouteProvider<GetClubByIdRequestDto, GetClubByIdResponseDto> {

    private readonly handler: GetClubByIdRouteHandler;

    constructor(handler: GetClubByIdRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetClubByIdRequestDto, GetClubByIdResponseDto> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: [ 'clubId' ],
                properties: {
                    clubId: { type: 'string' },
                },
                additionalProperties: false,
            },
            querystring: {
                type: 'object',
                required: [],
                properties: {
                    includeAllGames: { type: 'boolean' },
                    includeLastGames: { type: 'boolean' },
                },
                additionalProperties: false,
            }          
        };

        return {
            name: 'GetClubById',
            method: 'GET',
            path: '/api/v1/clubs/:clubId',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadClub,
            ],
        }
    }

}