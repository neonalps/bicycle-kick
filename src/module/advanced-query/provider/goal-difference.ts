import { GoalDifferenceFilter } from "@src/module/advanced-query/filter/goal-difference";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";
import { extractNumberComparison, extractQuantity } from "@src/module/advanced-query/helper";

export class GoalDifferenceFilterProvider implements FilterProvider<GoalDifferenceFilter> {

    provide(descriptor: FilterDescriptor): GoalDifferenceFilter {
        const quantity = extractQuantity(descriptor);
        if (quantity === null) {
            throw new Error(`Missing mandatory parameter with name ${ParameterName.Quantity}`);
        }

        const numberComparison = extractNumberComparison(descriptor);
        if (numberComparison === null) {
            throw new Error(`Missing mandatory number comparison parameter`);
        }

        return new GoalDifferenceFilter({ quantity: quantity, ...numberComparison, })
    }

}