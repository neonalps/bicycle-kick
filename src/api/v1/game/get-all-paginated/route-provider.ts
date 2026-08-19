import { GetGamesRequestDto } from "@src/model/external/dto/get-games-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { Capability } from "@src/model/internal/capabilities";
import { PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES } from "@src/module/pagination/constants";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { GetGamesPaginatedRouteHandler } from "./handler";
import { requireNonNull } from "@src/util/common";
import { UserBasicGameDto } from "@src/model/external/dto/user-basic-game";
import { GameStatus } from "@src/model/type/game-status";

export class GetGamesPaginatedRouteProvider implements RouteProvider<GetGamesRequestDto, PaginatedResponseDto<UserBasicGameDto>> {

    private readonly handler: GetGamesPaginatedRouteHandler;

    constructor(handler: GetGamesPaginatedRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetGamesRequestDto, PaginatedResponseDto<UserBasicGameDto>> {
        const schema: RequestSchema = {
            querystring: {
                type: 'object',
                required: [],
                properties: {
                    status: { type: 'string', enum: [
                        GameStatus.Abandoned,
                        GameStatus.Finished,
                        GameStatus.Ongoing,
                        GameStatus.Postponed,
                        GameStatus.Scheduled,
                    ] },
                    tendency: { type: 'string', enum: ['w', 'l', 'd'] },
                    competitionId: { type: 'string' },
                    opponentId: { type: 'string' },
                    seasonId: { type: 'string' },
                    isHomeGame: { type: 'boolean' },
                    isNeutralGround: { type: 'boolean' },
                    ...PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES,
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'GetGamesPaginated',
            method: 'GET',
            path: '/api/v1/games',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadGame,
                Capability.ReadPerson,
                Capability.ReadSeason,
            ]
        }
    }

}