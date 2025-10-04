import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetSeasonSquadRouteHandler } from "./handler";
import { GetSeasonSquadRequestDto } from "@src/model/external/dto/get-season-squad-request";
import { GetSeasonSquadResponseDto } from "@src/model/external/dto/get-season-squad-response";
import { Capability } from "@src/model/internal/capabilities";

export class GetSeasonSquadRouteProvider implements RouteProvider<GetSeasonSquadRequestDto, GetSeasonSquadResponseDto> {

    private readonly handler: GetSeasonSquadRouteHandler;
    
    constructor(handler: GetSeasonSquadRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetSeasonSquadRequestDto, GetSeasonSquadResponseDto> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: ['seasonId'],
                properties: {
                    seasonId: { type: 'string' }
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'GetSeasonSquad',
            method: 'GET',
            path: '/api/v1/seasons/:seasonId/squad',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadSeason,
                Capability.ReadPerson,
            ]
        }
    }

}