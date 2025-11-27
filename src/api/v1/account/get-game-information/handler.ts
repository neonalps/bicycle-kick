import { AccountGameInformationDto } from "@src/model/external/dto/account-game-information";
import { CacheService } from "@src/module/cache/service";
import { GameAttendedService } from "@src/module/game-attended/service";
import { GameStarService } from "@src/module/game-star/service";
import { ApplicationHeader, AuthenticationContext, CacheableResponse, RouteHandler } from "@src/router/types";
import { ensureNotNullish, promiseAllObject } from "@src/util/common";

export class GetAccountGameInformationRouteHandler implements RouteHandler<void, CacheableResponse<AccountGameInformationDto>> {

    constructor(
        private readonly cacheService: CacheService,
        private readonly gameAttendService: GameAttendedService,
        private readonly gameStarService: GameStarService
    ) {}
    
    public async handle(context: AuthenticationContext, _: void, headers: Record<ApplicationHeader, string>): Promise<CacheableResponse<AccountGameInformationDto>> {
        const account = ensureNotNullish(context.account);

        const gameInformation = await promiseAllObject({
            attended: this.gameAttendService.getGameAttendedForAccount(account.id),
            stars: this.gameStarService.getGameStarsForAccount(account.id),
        });

        const previousContentHash = headers[ApplicationHeader.ContentHash];
        const currentContentHash = this.cacheService.getContentHash(gameInformation);
        if (previousContentHash === currentContentHash) {
            return null;
        }
        
        return {
            attended: gameInformation.attended,
            stars: gameInformation.stars,
            contentHash: currentContentHash,
        }
    }

}