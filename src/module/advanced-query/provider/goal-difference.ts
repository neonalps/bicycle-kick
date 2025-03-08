import { GoalDifferenceFilter } from "@src/module/advanced-query/filter/goal-difference";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";
import { extractNumberComparison } from "@src/module/advanced-query/helper";

export class GoalDifferenceFilterProvider implements FilterProvider<GoalDifferenceFilter> {

    provide(descriptor: FilterDescriptor): GoalDifferenceFilter {
        const goalDifferenceParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.GoalDifference);
        if (goalDifferenceParameter === undefined) {
            throw new Error(`Missing mandatory parameter with name ${ParameterName.GoalDifference}`);
        }

        const numberComparison = extractNumberComparison(descriptor);
        if (numberComparison === null) {
            throw new Error(`Missing mandatory number comparison parameter`);
        }

        return new GoalDifferenceFilter({ goalDifference: Number(goalDifferenceParameter.value[0]), ...numberComparison, })
    }

}