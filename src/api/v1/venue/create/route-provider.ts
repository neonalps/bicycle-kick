import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { CreateVenueRequestDto } from "@src/model/external/dto/create-venue-request";
import { BasicVenueDto } from "@src/model/external/dto/basic-venue";
import { CreateVenueRouteHandler } from "./handler";

export class CreateVenueRouteProvider implements RouteProvider<CreateVenueRequestDto, BasicVenueDto> {

    private readonly handler: CreateVenueRouteHandler;

    constructor(handler: CreateVenueRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<CreateVenueRequestDto, BasicVenueDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: [ 'name', 'shortName', 'city', 'countryCode' ],
                properties: {
                    name: { type: 'string' },
                    shortName: { type: 'string' },
                    city: { type: 'string' },
                    countryCode: { type: 'string' },
                    district: { type: 'string' },
                    capacity: { type: 'number' },
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'CreateVenue',
            method: 'POST',
            path: '/api/v1/venues',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadVenue,
                Capability.WriteVenue,
            ]
        }
    }

}