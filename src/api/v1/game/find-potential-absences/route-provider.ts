import { GameIdRequestDto } from "@src/model/external/dto/game-id-request";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { FindPotentialGameAbsencesHandler } from "./handler";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { PotentialGameAbsencesResponseDto } from "@src/model/external/dto/get-potential-game-absences-response";

export class FindPotentialGameAbsencesRouteProvider implements RouteProvider<GameIdRequestDto, PotentialGameAbsencesResponseDto> {

    private readonly handler: FindPotentialGameAbsencesHandler;

    constructor(handler: FindPotentialGameAbsencesHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GameIdRequestDto, PotentialGameAbsencesResponseDto> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: [
                    'gameId'
                ],
                properties: {
                    gameId: { type: 'string' },
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'FindPotentialGameAbsences',
            method: 'GET',
            path: '/api/v1/games/:gameId/potential-absences',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadGame,
                Capability.ReadPerson,
            ]
        }
    }

}