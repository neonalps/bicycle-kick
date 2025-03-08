import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";
import { ResultTendencyFilter } from "@src/module/advanced-query/filter/result-tendency";
import { isBooleanValueTrue } from "@src/module/advanced-query/scenario/helper";

export class ResultTendencyFilterProvider implements FilterProvider<ResultTendencyFilter> {

    provide(descriptor: FilterDescriptor): ResultTendencyFilter {
        const winParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Won);
        if (winParameter !== undefined) {
            return new ResultTendencyFilter({ won: isBooleanValueTrue(winParameter.value[0]) });
        }

        const lostParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Lost);
        if (lostParameter !== undefined) {
            return new ResultTendencyFilter({ lost: isBooleanValueTrue(lostParameter.value[0]) });
        }

        const drawnParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Drawn);
        if (drawnParameter !== undefined) {
            return new ResultTendencyFilter({ drawn: isBooleanValueTrue(drawnParameter.value[0]) });
        }

        throw new Error(`Missing one mandatory parameter of: ${[ParameterName.Won, ParameterName.Drawn, ParameterName.Lost].join(", ")}`);
    }

}