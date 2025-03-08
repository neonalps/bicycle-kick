import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { TurnaroundFilter } from "@src/module/advanced-query/filter/turnaround";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { extractNumberComparison } from "@src/module/advanced-query/helper";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";

export class TurnaroundFilterProvider implements FilterProvider<TurnaroundFilter> {

    provide(descriptor: FilterDescriptor): TurnaroundFilter {
        const numberComparison = extractNumberComparison(descriptor);
        if (numberComparison === null) {
            throw new Error(`Missing mandatory number comparison parameter`);
        }

        const mainParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Main);
        if (mainParameter !== undefined) {
            return new TurnaroundFilter({ main: Number(mainParameter.value[0]), ...numberComparison });
        }

        const opponentParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Opponent);
        if (opponentParameter !== undefined) {
            return new TurnaroundFilter({ opponent: Number(opponentParameter.value[0]), ...numberComparison });
        }

        const totalParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Total);
        if (totalParameter !== undefined) {
            return new TurnaroundFilter({ total: Number(totalParameter.value[0]), ...numberComparison });
        }

        throw new Error(`Missing one mandatory parameter of: ${[ParameterName.Main, ParameterName.Opponent, ParameterName.Total].join(", ")}`)
    }

}