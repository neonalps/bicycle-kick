import { AccountProfileDto } from "@src/model/external/dto/account-profile";
import { ApiHelperService } from "@src/module/api-helper/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { ensureNotNullish } from "@src/util/common";

export class GetAccountProfileRouteHandler implements RouteHandler<void, AccountProfileDto> {

    constructor(private readonly apiHelperService: ApiHelperService) {}

    public async handle(context: AuthenticationContext): Promise<AccountProfileDto> {
        const account = ensureNotNullish(context.account);
        return this.apiHelperService.convertAccountToProfileDto(account);
    }

}