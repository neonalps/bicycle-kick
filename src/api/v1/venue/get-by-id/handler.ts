import { BasicVenueDto } from "@src/model/external/dto/basic-venue";
import { GetVenueByIdRequestDto } from "@src/model/external/dto/get-venue-by-id-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { VenueService } from "@src/module/venue/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class GetVenueByIdRouteHandler implements RouteHandler<GetVenueByIdRequestDto, BasicVenueDto> {

    constructor(
        private readonly apiHelper: ApiHelperService, 
        private readonly venueService: VenueService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetVenueByIdRequestDto): Promise<BasicVenueDto> {
        const venue = await this.venueService.requireById(dto.venueId);

        return this.apiHelper.convertVenueToBasicDto(venue);
    }

}