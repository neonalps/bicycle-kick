import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { CreateClubRequestDto } from "@src/model/external/dto/create-club-request";
import { BasicClubDto } from "@src/model/external/dto/basic-club";
import { CreateClubRouteHandler } from "./handler";

export class CreateClubRouteProvider implements RouteProvider<CreateClubRequestDto, BasicClubDto> {

    private readonly handler: CreateClubRouteHandler;

    constructor(handler: CreateClubRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<CreateClubRequestDto, BasicClubDto> {
        const schema: RequestSchema = {
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
            name: 'CreateClub',
            method: 'POST',
            path: '/api/v1/clubs',
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