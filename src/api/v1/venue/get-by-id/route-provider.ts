import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetVenueByIdRouteHandler } from "./handler";
import { Capability } from "@src/model/internal/capabilities";
import { BasicVenueDto } from "@src/model/external/dto/basic-venue";
import { GetVenueByIdRequestDto } from "@src/model/external/dto/get-venue-by-id-request";

export class GetVenueByIdRouteProvider implements RouteProvider<GetVenueByIdRequestDto, BasicVenueDto> {

    private readonly handler: GetVenueByIdRouteHandler;

    constructor(handler: GetVenueByIdRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetVenueByIdRequestDto, BasicVenueDto> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: [ 'venueId' ],
                properties: {
                    venueId: { type: 'string' },
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'GetVenueById',
            method: 'GET',
            path: '/api/v1/venues/:venueId',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadVenue,
            ],
        }
    }

}