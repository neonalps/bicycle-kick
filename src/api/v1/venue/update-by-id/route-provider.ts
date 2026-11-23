import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { BasicVenueDto } from "@src/model/external/dto/basic-venue";
import { UpdateVenueByIdRouteHandler } from "./handler";
import { UpdateVenueByIdRequestDto } from "@src/model/external/dto/update-venue-by-id-request";

export class UpdateVenueByIdRouteProvider implements RouteProvider<UpdateVenueByIdRequestDto, BasicVenueDto> {

    private readonly handler: UpdateVenueByIdRouteHandler;

    constructor(handler: UpdateVenueByIdRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<UpdateVenueByIdRequestDto, BasicVenueDto> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: ['venueId'],
                properties: {
                    venueID: { type: 'string' }
                },
                additionalProperties: false,
            },
            body: {
                type: 'object',
                required: [ 'name', 'shortName', 'city', 'countryCode', 'attendance', 'latitude', 'longitude' ],
                properties: {
                    name: { type: 'string' },
                    shortName: { type: 'string' },
                    city: { type: 'string' },
                    district: { type: 'string' },
                    countryCode: { type: 'string' },
                    attendance: { type: 'number' },
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'UpdateVenueById',
            method: 'PUT',
            path: '/api/v1/venues/:venueId',
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