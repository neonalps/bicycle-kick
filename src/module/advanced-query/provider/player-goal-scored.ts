import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { extractNumberComparison, extractQuantity } from "@src/module/advanced-query/helper";
import { PlayerGoalsScoredFilter } from "@src/module/advanced-query/filter/player-goals-scored";

export class PlayerGoalScoredFilterProvider implements FilterProvider<PlayerGoalsScoredFilter> {

    provide(descriptor: FilterDescriptor): PlayerGoalsScoredFilter {
        const quantity = extractQuantity(descriptor);
        if (quantity === null) {
            throw new Error(`Missing mandatory parameter quantity`);
        }

        const numberComparison = extractNumberComparison(descriptor);
        if (numberComparison === null) {
            throw new Error(`Missing mandatory number comparison parameter`);
        }

        return new PlayerGoalsScoredFilter({ quantity, ...numberComparison });
    }

}