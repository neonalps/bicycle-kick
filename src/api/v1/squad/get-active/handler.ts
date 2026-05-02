import { GetActiveSquadResponseDto } from "@src/model/external/dto/get-active-squad-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { CacheService } from "@src/module/cache/service";
import { SquadService } from "@src/module/squad/service";
import { ApplicationHeader, AuthenticationContext, CacheableResponse, RouteHandler } from "@src/router/types";

export class GetActiveSquadMembersRouteHandler implements RouteHandler<void, CacheableResponse<GetActiveSquadResponseDto>> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly cacheService: CacheService,
        private readonly squadService: SquadService,
    ) {}

    public async handle(_: AuthenticationContext, dto: void, headers: Record<ApplicationHeader, string>): Promise<CacheableResponse<GetActiveSquadResponseDto>> {
        const activeSquadMembers = await this.squadService.getActiveSquadMembers();

        const result = activeSquadMembers.map(item => this.apiHelper.convertPersonToSmallDto(item));

        const previousContentHash = headers[ApplicationHeader.ContentHash];
        const currentContentHash = this.cacheService.getContentHash(result);
        if (previousContentHash === currentContentHash) {
            return null;
        }

        return {
            activeSquadMembers: result,
            contentHash: currentContentHash,
        }
    }

}