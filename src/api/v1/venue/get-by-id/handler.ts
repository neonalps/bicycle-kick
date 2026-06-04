import { BasicVenueDto } from "@src/model/external/dto/basic-venue";
import { GetVenueByIdRequestDto } from "@src/model/external/dto/get-venue-by-id-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { ClubService } from "@src/module/club/service";
import { VenueService } from "@src/module/venue/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { promiseAllObject } from "@src/util/common";
import { VenueId } from "@src/util/domain-types";

export class GetVenueByIdRouteHandler implements RouteHandler<GetVenueByIdRequestDto, BasicVenueDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly clubService: ClubService,
        private readonly venueService: VenueService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetVenueByIdRequestDto): Promise<BasicVenueDto> {
        const venueId: VenueId = Number(dto.venueId);
        const { venue, flavors } = await promiseAllObject({
            venue: this.venueService.requireById(venueId),
            flavors: this.venueService.getFlavorsForVenue(venueId),
        });

        const response: BasicVenueDto = this.apiHelper.convertVenueToBasicDto(venue, flavors);

        if (dto.includeHomeVenueFor) {
            const clubsWithThisHomeVenue = await this.clubService.getAllWithHomeVenue(venueId);
            response.homeVenueFor = clubsWithThisHomeVenue.map(item => this.apiHelper.convertClubToBasicDtoWithoutHomeVenue(item));
        }

        return response;
    }

}