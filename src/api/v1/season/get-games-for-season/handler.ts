import { BasicGameDto } from "@src/model/external/dto/basic-game";
import { GetAllSeasonsRequestDto } from "@src/model/external/dto/get-all-seasons-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class GetGamesForSeasonRouteHandler implements RouteHandler<GetAllSeasonsRequestDto, PaginatedResponseDto<BasicGameDto>> {

    constructor() {
    }

    public async handle(context: AuthenticationContext, dto: GetAllSeasonsRequestDto): Promise<PaginatedResponseDto<BasicGameDto>> {
        return {
            items: []
        }
    }

}