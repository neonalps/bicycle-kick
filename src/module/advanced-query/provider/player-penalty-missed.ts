import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { extractNumberComparison, extractQuantity } from "@src/module/advanced-query/helper";
import { PlayerPenaltyMissedFilter } from "@src/module/advanced-query/filter/player-penalty-missed";

export class PlayerPenaltyMissedFilterProvider implements FilterProvider<PlayerPenaltyMissedFilter> {

    provide(descriptor: FilterDescriptor): PlayerPenaltyMissedFilter {
        const quantity = extractQuantity(descriptor);
        if (quantity === null) {
            throw new Error(`Missing mandatory parameter quantity`);
        }

        const numberComparison = extractNumberComparison(descriptor);
        if (numberComparison === null) {
            throw new Error(`Missing mandatory number comparison parameter`);
        }

        return new PlayerPenaltyMissedFilter({ quantity, ...numberComparison });
    }

}