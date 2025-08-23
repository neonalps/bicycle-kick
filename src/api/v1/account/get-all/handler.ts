import { GetAccountsRequestDto } from "@src/model/external/dto/get-accounts-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { AccountDto } from "@src/model/external/dto/account";
import { AccountService, GetAccountPaginationParams } from "@src/module/account/service";
import { MAX_NUMBER, MIN_NUMBER, SortOrder } from "@src/module/pagination/constants";
import { PaginationService } from "@src/module/pagination/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { Account } from "@src/model/internal/account";
import { ApiHelperService } from "@src/module/api-helper/service";

export class GetAllAccountsRouteHandler implements RouteHandler<GetAccountsRequestDto, PaginatedResponseDto<AccountDto>> {

    constructor(
        private readonly accountService: AccountService,
        private readonly apiHelper: ApiHelperService,
        private readonly paginationService: PaginationService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetAccountsRequestDto): Promise<PaginatedResponseDto<AccountDto>> {
        this.paginationService.validateQueryParams(dto);
        
        const paginationParams = this.getPaginationParams(dto);
        const paginatedAccounts = await this.accountService.getAllPaginated(paginationParams);

        return {
            nextPageKey: this.buildNextPageKey(paginatedAccounts, paginationParams),
            items: paginatedAccounts.map(item => this.apiHelper.convertAccountToDto(item)),
        }
    }

    private getPaginationParams(dto: GetAccountsRequestDto): GetAccountPaginationParams {
            if (!dto.nextPageKey) {
                const order: SortOrder = dto.order === SortOrder.Ascending ? SortOrder.Ascending : SortOrder.Descending;
                const limit: number = dto.limit || 50;
                const lastSeen: number = order === SortOrder.Ascending ? MIN_NUMBER : MAX_NUMBER;
    
                const params: GetAccountPaginationParams = {
                    order,
                    limit,
                    lastSeen,
                };
    
                if (dto.search) {
                    params.search = dto.search;
                }

                if (dto.role) {
                    params.role = dto.role;
                }

                if (dto.search) {
                    params.search = dto.search;
                }
    
                return params;
            }
    
            return this.paginationService.decode<GetAccountPaginationParams>(dto.nextPageKey);
        }
    
        private buildNextPageKey(items: Account[], oldParams: GetAccountPaginationParams): string | undefined {
            if (items.length < oldParams.limit) {
                return;
            }
    
            const newParams: GetAccountPaginationParams = {
                limit: oldParams.limit,
                order: oldParams.order,
                lastSeen: this.paginationService.getLastElement(items).id,
            };
    
            return this.paginationService.encode(newParams);
        }

}   