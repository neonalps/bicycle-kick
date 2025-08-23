import { Capability } from "@src/model/internal/capabilities";
import { AccountRole } from "@src/model/type/account-role";
import { validateNotNull } from "@src/util/validation";
import { provideRoleToCapabilities } from "./capabilities";

export class PermissionService {

    private static readonly ROLE_TO_CAPABILITIES = provideRoleToCapabilities();

    determineMissingCapabilities(role: AccountRole, requiredCapabilities: ReadonlyArray<Capability>): ReadonlyArray<Capability> {
        validateNotNull(role, "accountRole");
        validateNotNull(requiredCapabilities, "requireCapabilities");

        if (requiredCapabilities.length === 0) {
            return [];
        }

        return requiredCapabilities.filter(requiredCapability => !PermissionService.ROLE_TO_CAPABILITIES[role].includes(requiredCapability));
    }

}