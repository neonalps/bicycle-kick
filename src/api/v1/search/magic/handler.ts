import { AdvancedQueryService } from "@src/module/advanced-query/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { MagicSearchRequestDto } from "@src/model/external/dto/magic-search-request";
import { MagicSearchResponseDto } from "@src/model/external/dto/magic-search-response";

export class MagicSearchRouteHandler implements RouteHandler<MagicSearchRequestDto, MagicSearchResponseDto> {

    constructor(private readonly advancedQueryService: AdvancedQueryService) {}

    public async handle(_: AuthenticationContext, dto: MagicSearchRequestDto): Promise<MagicSearchResponseDto> {
        const response = await this.advancedQueryService.search(dto.inquiry) as string;
        return { response };
    }

}