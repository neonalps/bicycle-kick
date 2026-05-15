import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { StoreGameAbsencesHandler } from "./handler";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { StoreGameAbsencesRequestDto } from "@src/model/external/dto/store-game-absences-request";
import { GameAbsenceType } from "@src/model/type/game-absence";

export class StoreGameAbsencesRouteProvider implements RouteProvider<StoreGameAbsencesRequestDto, void> {

    private readonly handler: StoreGameAbsencesHandler;

    constructor(handler: StoreGameAbsencesHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<StoreGameAbsencesRequestDto, void> {
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
            },
            body: {
                type: 'object',
                required: [
                    'absences'
                ],
                properties: {
                    absences: { 
                        type: 'array', 
                        items: {
                            type: 'object',
                            required: [
                                'personId',
                            ],
                            properties: {
                                personId: { type: 'number' },
                                absenceType: { type: 'string', enum: [GameAbsenceType.AtRisk, GameAbsenceType.Exempt, GameAbsenceType.Injured, GameAbsenceType.Suspended] },
                                absenceReason: { type: 'string' }, // we cannot validate the absence reason here because we do some postfix shenanigans to pass additional data (e.g. "yellowCard:5")
                            },
                            additionalProperties: false,
                        }
                    },
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'StoreGameAbsences',
            method: 'PUT',
            path: '/api/v1/games/:gameId/absences',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.WriteGame,
            ]
        }
    }

}