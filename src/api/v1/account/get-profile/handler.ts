import { AccountProfileDto } from "@src/model/external/dto/account-profile";
import { Language } from "@src/model/type/language";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { ensureNotNullish } from "@src/util/common";

export class GetAccountProfileRouteHandler implements RouteHandler<void, AccountProfileDto> {

    public async handle(context: AuthenticationContext): Promise<AccountProfileDto> {
        const account = ensureNotNullish(context.account);

        return {
            id: account.publicId,
            email: account.email,
            firstName: account.firstName,
            lastName: account.lastName,
            language: Language.AustrianGerman,
            role: account.roles,
            createdAt: account.createdAt.toISOString(),
        }
    }

}