import { AuthorizationError } from "@src/api/error/authorization";
import { AccountRole } from "@src/model/type/account-role";
import { validateNotNull } from "@src/util/validation";

export class PermissionService {

    validatePermission(required: AccountRole, granted: AccountRole[]): void {
        validateNotNull(required, "required permission");
        validateNotNull(granted, "granted permissions");

        if (!this.hasPermission(required, granted)) {
            throw new AuthorizationError(`Lacking required permission ${required}`);
        }
    }

    private hasPermission(required: AccountRole, granted: AccountRole[]): boolean {
        return granted.includes(required);
    }

}