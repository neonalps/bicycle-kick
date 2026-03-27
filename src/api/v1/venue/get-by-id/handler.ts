import { BasicVenueDto } from "@src/model/external/dto/basic-venue";
import { GetVenueByIdRequestDto } from "@src/model/external/dto/get-venue-by-id-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { VenueService } from "@src/module/venue/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { promiseAllObject } from "@src/util/common";

export class GetVenueByIdRouteHandler implements RouteHandler<GetVenueByIdRequestDto, BasicVenueDto> {

    constructor(
        private readonly apiHelper: ApiHelperService, 
        private readonly venueService: VenueService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetVenueByIdRequestDto): Promise<BasicVenueDto> {
        const { venue, flavors } = await promiseAllObject({
            venue: this.venueService.requireById(dto.venueId),
            flavors: this.venueService.getFlavorsForVenue(dto.venueId),
        });

        return this.apiHelper.convertVenueToBasicDto(venue, flavors);
    }

}