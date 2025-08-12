import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetGamesPlayedRequestDto } from "@src/model/external/dto/get-games-played-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { GamePlayedDto } from "@src/model/external/dto/game-played";
import { GetPersonGamesPlayedRouteHandler } from "./handler";
import { PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES } from "@src/module/pagination/constants";

export class GetPersonGamesPlayedRouteProvider implements RouteProvider<GetGamesPlayedRequestDto, PaginatedResponseDto<GamePlayedDto>> {

    private readonly handler: GetPersonGamesPlayedRouteHandler;

    constructor(handler: GetPersonGamesPlayedRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetGamesPlayedRequestDto, PaginatedResponseDto<GamePlayedDto>> {
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
                    playerId: { type: 'string' },
                    forMain: { type: 'boolean' },
                    competitionId: { type: 'string' },
                    opponentId: { type: 'string' },
                    seasonId: { type: 'string' },
                    minutesPlayed: { type: 'string' },
                    goalsScored: { type: 'string' },
                    assists: { type: 'string' },
                    yellowCard: { type: 'boolean' },
                    yellowRedCard: { type: 'boolean' },
                    redCard: { type: 'boolean' },
                    ...PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES,
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'GetPersonGamesPlayed',
            method: 'GET',
            path: '/api/v1/people/:personId/games-played',
            schema,
            handler: this.handler,
            authenticated: false,
        }
    }

}