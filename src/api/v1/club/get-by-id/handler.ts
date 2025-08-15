import { BasicGameDto } from "@src/model/external/dto/basic-game";
import { GetClubByIdRequestDto } from "@src/model/external/dto/get-club-by-id-request";
import { GetClubByIdResponseDto } from "@src/model/external/dto/get-club-by-id-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { ClubService } from "@src/module/club/service";
import { ExternalProviderService } from "@src/module/external-provider/service";
import { GameService } from "@src/module/game/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { promiseAllObject } from "@src/util/common";
import { ClubId } from "@src/util/domain-types";
import { OmitStrict } from "@src/util/types";

export class GetClubByIdRouteHandler implements RouteHandler<GetClubByIdRequestDto, GetClubByIdResponseDto> {

    constructor(
        private readonly apiHelper: ApiHelperService, 
        private readonly clubService: ClubService,
        private readonly externalProviderService: ExternalProviderService,
        private readonly gameService: GameService,
        private readonly mainClubId: ClubId,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetClubByIdRequestDto): Promise<GetClubByIdResponseDto> {
        const clubId = typeof dto.clubId === 'string' && dto.clubId === "main" ? this.mainClubId : dto.clubId;

        const { club, externalProviderClubs } = await promiseAllObject({
            club: this.clubService.requireById(clubId),
            externalProviderClubs: this.externalProviderService.getExternalProvidersForClub(dto.clubId),
        });

        const clubDto = await this.apiHelper.convertClubToBasicDto(club);

        const responseDto: GetClubByIdResponseDto = {
            club: clubDto,
        };

        if (externalProviderClubs.length > 0) {
            responseDto.externalLinks = this.apiHelper.convertExternalProviderClubLinks(club, externalProviderClubs);
        }

        if (dto.includeAllGames === true && clubId !== this.mainClubId) {
            const allGames = await this.gameService.getAllOrderedGamesAgainstOpponent(clubId);
            const allGamesDtos = await this.apiHelper.getOrderedBasicGameDtos(allGames);
            responseDto.allGames = allGamesDtos.map(item => this.omitOpponentFromGame(item));
        } else if (dto.includeLastGames === true && clubId !== this.mainClubId) {
            const lastGames = await this.gameService.getLastFinishedGames(10, { onlyOpponents: [ clubId ] });
            const lastGamesDtos = await this.apiHelper.getOrderedBasicGameDtos(lastGames);
            responseDto.lastGames = lastGamesDtos.map(item => this.omitOpponentFromGame(item));
        }

        return responseDto;
    }

    private omitOpponentFromGame(basicGameDto: BasicGameDto): OmitStrict<BasicGameDto, 'opponent'> {
        const { opponent, ...rest } = basicGameDto;
        return rest;
    }

}