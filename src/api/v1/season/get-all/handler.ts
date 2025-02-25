import { GetAllSeasonsRequestDto } from "@src/model/external/dto/get-all-seasons-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { SeasonDto } from "@src/model/external/dto/season";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class GetAllSeasonsRouteHandler implements RouteHandler<GetAllSeasonsRequestDto, PaginatedResponseDto<SeasonDto>> {

    constructor() {
    }

    public async handle(context: AuthenticationContext, dto: GetAllSeasonsRequestDto): Promise<PaginatedResponseDto<SeasonDto>> {
        return {
            items: []
        }
    }

}