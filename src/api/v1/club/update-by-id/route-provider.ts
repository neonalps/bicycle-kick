import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { BasicClubDto } from "@src/model/external/dto/basic-club";
import { UpdateClubByIdRequestDto } from "@src/model/external/dto/update-club-by-id-request";
import { UpdateClubByIdRouteHandler } from "./handler";

export class UpdateClubByIdRouteProvider implements RouteProvider<UpdateClubByIdRequestDto, BasicClubDto> {

    private readonly handler: UpdateClubByIdRouteHandler;

    constructor(handler: UpdateClubByIdRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<UpdateClubByIdRequestDto, BasicClubDto> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: ['clubId'],
                properties: {
                    clubId: { type: 'string' }
                },
                additionalProperties: false,
            },
            body: {
                type: 'object',
                required: [ 'name', 'shortName', 'city', 'countryCode' ],
                properties: {
                    name: { type: 'string' },
                    shortName: { type: 'string' },
                    iconLarge: { type: 'string' },
                    iconSmall: { type: 'string' },
                    city: { type: 'string' },
                    district: { type: 'string' },
                    countryCode: { type: 'string' },
                    primaryColour: { type: 'string' },
                    secondaryColour: { type: 'string' },
                    homeVenueId: { type: 'string' },
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'UpdateClubById',
            method: 'PUT',
            path: '/api/v1/clubs/:clubId',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadClub,
                Capability.WriteClub,
            ]
        }
    }

}