import { GetGamesRequestDto } from "@src/model/external/dto/get-games-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { UserBasicGameDto } from "@src/model/external/dto/user-basic-game";
import { ApiHelperService } from "@src/module/api-helper/service";
import { CompetitionService } from "@src/module/competition/service";
import { GameAttendedService } from "@src/module/game-attended/service";
import { GameStarService } from "@src/module/game-star/service";
import { GameService, GetGamesPaginationParams } from "@src/module/game/service";
import { MAX_DATE, MIN_DATE, SortOrder } from "@src/module/pagination/constants";
import { PaginationService } from "@src/module/pagination/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { isDefined, promiseAllObject, requireNonNull } from "@src/util/common";
import { CompetitionId } from "@src/util/domain-types";

export class GetGamesPaginatedRouteHandler implements RouteHandler<GetGamesRequestDto, PaginatedResponseDto<UserBasicGameDto>> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly competitionService: CompetitionService,
        private readonly gameService: GameService,
        private readonly gameAttendedService: GameAttendedService,
        private readonly gameStarService: GameStarService,
        private readonly paginationService: PaginationService,
    ) {}

    public async handle(authContext: AuthenticationContext, dto: GetGamesRequestDto): Promise<PaginatedResponseDto<UserBasicGameDto>> {
        this.paginationService.validateQueryParams(dto);
        const paginationParams = this.getPaginationParams(dto);

        // we have to overwrite the competitionId property with the effective competition IDs
        const clonedParams = { ...paginationParams };
        if (clonedParams.competitionId) {
            const deserializedCompetitionIds: CompetitionId[] = clonedParams.competitionId.split(",").map(item => Number(item));
            const effectiveCompetitionIds = await this.competitionService.getEffectiveCompetitionIds(deserializedCompetitionIds);
            clonedParams.competitionId = effectiveCompetitionIds.join(",");
        }

        const accountId = requireNonNull(authContext.account).id;

        const orderedGames = await this.gameService.getGamesPaginated(clonedParams, accountId);
        const responseItems: UserBasicGameDto[] = await this.apiHelperService.getOrderedBasicGameDtos(orderedGames);

        const gameIds = orderedGames.map(item => item.id);

        const { attended, starred } = await promiseAllObject({
            attended: this.gameAttendedService.getGameAttended(accountId, gameIds),
            starred: this.gameStarService.getGameStars(accountId, gameIds),
        });

        for (const responseItem of responseItems) {
            if (attended.includes(responseItem.id)) {
                responseItem.attended = true;
            }

            if (starred.includes(responseItem.id)) {
                responseItem.favourite = true;
            }
        }

        return {
            nextPageKey: this.buildNextPageKey(responseItems, paginationParams),
            items: responseItems,
        };
    }

    private getPaginationParams(dto: GetGamesRequestDto): GetGamesPaginationParams {
        if (!dto.nextPageKey) {
            const order: SortOrder = dto.order === SortOrder.Ascending ? SortOrder.Ascending : SortOrder.Descending;
            const limit: number = dto.limit || 50;
            const lastSeen: Date = order === SortOrder.Ascending ? MIN_DATE : MAX_DATE;

            const params: GetGamesPaginationParams = {
                order,
                limit,
                lastSeen: lastSeen.toISOString(),
            };

            if (isDefined(dto.opponentId)) {
                params.opponentId = dto.opponentId;
            }

            if (isDefined(dto.tendency)) {
                params.tendency = dto.tendency;
            }

            if (isDefined(dto.status)) {
                params.status = dto.status;
            }

            if (isDefined(dto.competitionId)) {
                params.competitionId = dto.competitionId;
            }

            if (isDefined(dto.seasonId)) {
                params.seasonId = dto.seasonId;
            }

            if (isDefined(dto.isHomeGame)) {
                params.isHomeGame = dto.isHomeGame;
            }

            if (isDefined(dto.isNeutralGround)) {
                params.isNeutralGround = dto.isNeutralGround;
            }

            if (isDefined(dto.hasAccountAttended)) {
                params.hasAccountAttended = dto.hasAccountAttended;
            }

            if (isDefined(dto.hasAccountStarred)) {
                params.hasAccountStarred = dto.hasAccountStarred;
            }

            return params;
        }

        return this.paginationService.decode<GetGamesPaginationParams>(dto.nextPageKey);
    }

    private buildNextPageKey(items: UserBasicGameDto[], oldParams: GetGamesPaginationParams): string | undefined {
        if (items.length < oldParams.limit) {
            return;
        }

        const newParams: GetGamesPaginationParams = {
            limit: oldParams.limit,
            order: oldParams.order,
            lastSeen: this.paginationService.getLastElement(items).kickoff,
        };

        if (isDefined(oldParams.opponentId)) {
            newParams.opponentId = oldParams.opponentId;
        }

        if (isDefined(oldParams.tendency)) {
            newParams.tendency = oldParams.tendency;
        }

        if (isDefined(oldParams.status)) {
            newParams.status = oldParams.status;
        }

        if (isDefined(oldParams.competitionId)) {
            newParams.competitionId = oldParams.competitionId;
        }

        if (isDefined(oldParams.seasonId)) {
            newParams.seasonId = oldParams.seasonId;
        }

        if (isDefined(oldParams.isHomeGame)) {
            newParams.isHomeGame = oldParams.isHomeGame;
        }

        if (isDefined(oldParams.isNeutralGround)) {
            newParams.isNeutralGround = oldParams.isNeutralGround;
        }

        if (isDefined(oldParams.hasAccountAttended)) {
            newParams.hasAccountAttended = oldParams.hasAccountAttended;
        }

        if (isDefined(oldParams.hasAccountStarred)) {
            newParams.hasAccountStarred = oldParams.hasAccountStarred;
        }

        return this.paginationService.encode(newParams);
    }

}