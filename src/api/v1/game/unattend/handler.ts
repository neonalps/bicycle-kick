import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { GameIdRequestDto } from "@src/model/external/dto/game-id-request";
import { GameAttendedService } from "@src/module/game-attended/service";
import { ensureNotNullish } from "@src/util/common";

export class UnattendGameHandler implements RouteHandler<GameIdRequestDto, void> {

    constructor(private readonly gameAttendedService: GameAttendedService) {}

    public async handle(context: AuthenticationContext, dto: GameIdRequestDto): Promise<void> {
        await this.gameAttendedService.setGameAttendedStatus(ensureNotNullish(context.account).id, +dto.gameId, false);
    }

}