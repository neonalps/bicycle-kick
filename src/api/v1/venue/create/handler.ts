import { BasicVenueDto } from "@src/model/external/dto/basic-venue";
import { CreateVenueRequestDto } from "@src/model/external/dto/create-venue-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { VenueService } from "@src/module/venue/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class CreateVenueRouteHandler implements RouteHandler<CreateVenueRequestDto, BasicVenueDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly venueService: VenueService,
    ) {}

    public async handle(_: AuthenticationContext, dto: CreateVenueRequestDto): Promise<BasicVenueDto> {
        const createdVenue = await this.venueService.create({
            name: dto.name,
            shortName: dto.shortName,
            city: dto.city,
            district: dto.district,
            countryCode: dto.countryCode,
            capacity: dto.capacity ?? 0,
            latitude: dto.latitude,
            longitude: dto.longitude,
        });

        return this.apiHelper.convertVenueToBasicDto(createdVenue);
    }

}