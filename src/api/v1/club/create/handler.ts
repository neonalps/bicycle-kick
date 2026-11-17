import { BasicClubDto } from "@src/model/external/dto/basic-club";
import { CreateClubRequestDto } from "@src/model/external/dto/create-club-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { ClubService } from "@src/module/club/service";
import { VenueService } from "@src/module/venue/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class CreateClubRouteHandler implements RouteHandler<CreateClubRequestDto, BasicClubDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly clubService: ClubService,
        private readonly venueService: VenueService,
    ) {}

    public async handle(_: AuthenticationContext, dto: CreateClubRequestDto): Promise<BasicClubDto> {
        const homeVenueId = dto.homeVenueFlavorId ? await this.venueService.requireVenueIdForFlavorId(Number(dto.homeVenueFlavorId)) : undefined;        

        const createdClub = await this.clubService.create({
            name: dto.name,
            shortName: dto.shortName,
            city: dto.city,
            district: dto.district,
            countryCode: dto.countryCode,
            primaryColour: dto.primaryColour,
            secondaryColour: dto.secondaryColour,
            homeVenueId: homeVenueId,
        });

        return this.apiHelper.convertClubToBasicDto(createdClub);
    }

}