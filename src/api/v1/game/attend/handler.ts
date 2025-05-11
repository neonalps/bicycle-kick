import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { GameIdRequestDto } from "@src/model/external/dto/game-id-request";
import { AuthenticationError } from "@src/api/error/authentication";
import { GameAttendedService } from "@src/module/game-attended/service";

export class AttendGameHandler implements RouteHandler<GameIdRequestDto, void> {

    constructor(private readonly gameAttendedService: GameAttendedService) {}

    public async handle(context: AuthenticationContext, dto: GameIdRequestDto): Promise<void> {
        if (!context.authenticated || context.account === null) {
            throw new AuthenticationError(`No authentication present`);
        }
        
        await this.gameAttendedService.setGameAttendedStatus(context.account.id, dto.gameId, true);
    }

}