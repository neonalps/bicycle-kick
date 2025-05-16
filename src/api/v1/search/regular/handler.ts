import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { RegularSearchRequestDto } from "@src/model/external/dto/regular-search-request";
import { SearchService } from "@src/module/search/service";
import { RegularSearchResponseDto } from "@src/model/external/dto/regular-search-response";

export class RegularSearchRouteHandler implements RouteHandler<RegularSearchRequestDto, RegularSearchResponseDto> {

    constructor(private readonly searchService: SearchService) {}

    public async handle(_: AuthenticationContext, dto: RegularSearchRequestDto): Promise<RegularSearchResponseDto> {
        return {
            items: await this.searchService.search(dto.search, dto.filters),
        }
    }

}