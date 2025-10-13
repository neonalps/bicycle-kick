import { BasicVenueDto } from "@src/model/external/dto/basic-venue";
import { UpdateVenueByIdRequestDto } from "@src/model/external/dto/update-venue-by-id-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { VenueService } from "@src/module/venue/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class UpdateVenueByIdRouteHandler implements RouteHandler<UpdateVenueByIdRequestDto, BasicVenueDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly venueService: VenueService,
    ) {}

    public async handle(_: AuthenticationContext, dto: UpdateVenueByIdRequestDto): Promise<BasicVenueDto> {
        const updatedClub = await this.venueService.updateById(dto.venueId, {
            name: dto.name,
            shortName: dto.shortName,
            city: dto.city,
            countryCode: dto.countryCode,
            district: dto.district,
            capacity: dto.capacity,
            latitude: dto.latitude,
            longitude: dto.longitude,
        });

        return this.apiHelper.convertClubToBasicDto(updatedClub)
    }

}