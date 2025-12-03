import { GamePlayedDto } from "@src/model/external/dto/game-played";
import { GetGamesPlayedRequestDto } from "@src/model/external/dto/get-games-played-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GamePlayerService, GetPlayerGamesPlayedPaginationParams } from "@src/module/game-player/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { MAX_DATE, MIN_DATE, SortOrder } from "@src/module/pagination/constants";
import { PaginationService } from "@src/module/pagination/service";
import { isDefined } from "@src/util/common";

export class GetPersonGamesPlayedRouteHandler implements RouteHandler<GetGamesPlayedRequestDto, PaginatedResponseDto<GamePlayedDto>> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly gamePlayerService: GamePlayerService,
        private readonly paginationService: PaginationService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetGamesPlayedRequestDto): Promise<PaginatedResponseDto<GamePlayedDto>> {
        this.paginationService.validateQueryParams(dto);
        const paginationParams = this.getPaginationParams(dto);

        const orderedPlayedGames = await this.gamePlayerService.getGamesPlayedPaginated(Number(dto.personId), paginationParams);
        const responseItems = await this.apiHelperService.convertGamePlayerToGamePlayedDtos(orderedPlayedGames);

        return {
            nextPageKey: this.buildNextPageKey(responseItems, paginationParams),
            items: responseItems,
        }
    }

    private getPaginationParams(dto: GetGamesPlayedRequestDto): GetPlayerGamesPlayedPaginationParams {
        if (!dto.nextPageKey) {
            const order: SortOrder = dto.order === SortOrder.Ascending ? SortOrder.Ascending : SortOrder.Descending;
            const limit: number = dto.limit || 50;
            const lastSeen: Date = order === SortOrder.Ascending ? MIN_DATE : MAX_DATE;

            const params: GetPlayerGamesPlayedPaginationParams = {
                order,
                limit,
                lastSeen: lastSeen.toISOString(),
            };

            if (isDefined(dto.forMain)) {
                params.forMain = dto.forMain;
            }

            if (isDefined(dto.opponentId)) {
                params.opponentId = dto.opponentId;
            }

            if (isDefined(dto.competitionId)) {
                params.competitionId = dto.competitionId;
            }

            if (isDefined(dto.seasonId)) {
                params.seasonId = dto.seasonId;
            }

            if (isDefined(dto.minutesPlayed)) {
                params.minutesPlayed = dto.minutesPlayed;
            }

            if (isDefined(dto.goalsScored)) {
                params.goalsScored = dto.goalsScored;
            }

            if (isDefined(dto.assists)) {
                params.assists = dto.assists;
            }

            if (isDefined(dto.goalsConceded)) {
                params.goalsConceded = dto.goalsConceded;
            }

            if (isDefined(dto.yellowCard)) {
                params.yellowCard = dto.yellowCard;
            }

            if (isDefined(dto.yellowRedCard)) {
                params.yellowRedCard = dto.yellowRedCard;
            }

            if (isDefined(dto.redCard)) {
                params.redCard = dto.redCard;
            }

            if (isDefined(dto.regulationPenaltiesTaken)) {
                params.regulationPenaltiesTaken = dto.regulationPenaltiesTaken;
            }

            if (isDefined(dto.regulationPenaltiesScored)) {
                params.regulationPenaltiesScored = dto.regulationPenaltiesScored;
            }

            if (isDefined(dto.regulationPenaltiesFaced)) {
                params.regulationPenaltiesFaced = dto.regulationPenaltiesFaced;
            }

            if (isDefined(dto.regulationPenaltiesSaved)) {
                params.regulationPenaltiesSaved = dto.regulationPenaltiesSaved;
            }

            if (isDefined(dto.psoPenaltiesTaken)) {
                params.psoPenaltiesTaken = dto.psoPenaltiesTaken;
            }

            if (isDefined(dto.psoPenaltiesScored)) {
                params.psoPenaltiesScored = dto.psoPenaltiesScored;
            }

            if (isDefined(dto.psoPenaltiesFaced)) {
                params.psoPenaltiesFaced = dto.psoPenaltiesFaced;
            }

            if (isDefined(dto.psoPenaltiesSaved)) {
                params.psoPenaltiesSaved = dto.psoPenaltiesSaved;
            }

            return params;
        }

        return this.paginationService.decode<GetPlayerGamesPlayedPaginationParams>(dto.nextPageKey);
    }

    private buildNextPageKey(items: GamePlayedDto[], oldParams: GetPlayerGamesPlayedPaginationParams): string | undefined {
        if (items.length < oldParams.limit) {
            return;
        }

        const newParams: GetPlayerGamesPlayedPaginationParams = {
            limit: oldParams.limit,
            order: oldParams.order,
            lastSeen: this.paginationService.getLastElement(items).game.kickoff,
        };

        if (isDefined(oldParams.forMain)) {
            newParams.forMain = oldParams.forMain;
        }

        if (isDefined(oldParams.opponentId)) {
            newParams.opponentId = oldParams.opponentId;
        }

        if (isDefined(oldParams.competitionId)) {
            newParams.competitionId = oldParams.competitionId;
        }

        if (isDefined(oldParams.seasonId)) {
            newParams.seasonId = oldParams.seasonId;
        }

        if (isDefined(oldParams.minutesPlayed)) {
            newParams.minutesPlayed = oldParams.minutesPlayed;
        }

        if (isDefined(oldParams.goalsScored)) {
            newParams.goalsScored = oldParams.goalsScored;
        }

        if (isDefined(oldParams.assists)) {
            newParams.assists = oldParams.assists;
        }

        if (isDefined(oldParams.goalsConceded)) {
            newParams.goalsConceded = oldParams.goalsConceded;
        }

        if (isDefined(oldParams.yellowCard)) {
            newParams.yellowCard = oldParams.yellowCard;
        }

        if (isDefined(oldParams.yellowRedCard)) {
            newParams.yellowRedCard = oldParams.yellowRedCard;
        }

        if (isDefined(oldParams.redCard)) {
            newParams.redCard = oldParams.redCard;
        }

        if (isDefined(oldParams.regulationPenaltiesFaced)) {
            newParams.regulationPenaltiesFaced = oldParams.regulationPenaltiesFaced;
        }

        if (isDefined(oldParams.regulationPenaltiesSaved)) {
            newParams.regulationPenaltiesSaved = oldParams.regulationPenaltiesSaved;
        }

        if (isDefined(oldParams.regulationPenaltiesTaken)) {
            newParams.regulationPenaltiesTaken = oldParams.regulationPenaltiesTaken;
        }

        if (isDefined(oldParams.regulationPenaltiesScored)) {
            newParams.regulationPenaltiesScored = oldParams.regulationPenaltiesScored;
        }

        if (isDefined(oldParams.psoPenaltiesFaced)) {
            newParams.psoPenaltiesFaced = oldParams.psoPenaltiesFaced;
        }

        if (isDefined(oldParams.psoPenaltiesSaved)) {
            newParams.psoPenaltiesSaved = oldParams.psoPenaltiesSaved;
        }

        if (isDefined(oldParams.psoPenaltiesTaken)) {
            newParams.psoPenaltiesTaken = oldParams.psoPenaltiesTaken;
        }

        if (isDefined(oldParams.psoPenaltiesScored)) {
            newParams.psoPenaltiesScored = oldParams.psoPenaltiesScored;
        }

        return this.paginationService.encode(newParams);
    }

}