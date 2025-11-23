import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { extractNumberComparison, extractQuantity } from "@src/module/advanced-query/helper";
import { TeamDirectFreeKickFilter } from "@src/module/advanced-query/filter/team-direct-free-kick";

export class TeamDirectFreeKickFilterProvider implements FilterProvider<TeamDirectFreeKickFilter> {

    provide(descriptor: FilterDescriptor): TeamDirectFreeKickFilter {
        const quantity = extractQuantity(descriptor);
        if (quantity === null) {
            throw new Error(`Missing mandatory parameter quantity`);
        }

        const numberComparison = extractNumberComparison(descriptor);
        if (numberComparison === null) {
            throw new Error(`Missing mandatory number comparison parameter`);
        }

        return new TeamDirectFreeKickFilter({ quantity, ...numberComparison });
    }

}