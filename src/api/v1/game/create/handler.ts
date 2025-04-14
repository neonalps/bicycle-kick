import { AdvancedQueryService } from "@src/module/advanced-query/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { ApiHelperService } from "@src/module/api-helper/service";
import { CreateGameRequestDto } from "@src/model/external/dto/create-game-request";

export class CreateGameRouteHandler implements RouteHandler<CreateGameRequestDto, void> {

    constructor(private readonly advancedQueryService: AdvancedQueryService, private readonly apiHelperService: ApiHelperService) {}

    public async handle(_: AuthenticationContext, dto: CreateGameRequestDto): Promise<void> {
        // TODO implement
    }

}