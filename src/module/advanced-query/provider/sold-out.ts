import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { SoldOutFilter } from "@src/module/advanced-query/filter/sold-out";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";
import { isBooleanValueTrue } from "@src/module/advanced-query/scenario/helper";

export class SoldOutFilterProvider implements FilterProvider<SoldOutFilter> {
    
    provide(descriptor: FilterDescriptor): SoldOutFilter {
        const soldOutParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.SoldOut);
        if (soldOutParameter === undefined) {
            throw new Error(`Missing mandatory parameter with name ${ParameterName.SoldOut}`);
        }

        return new SoldOutFilter({ isSoldOut: isBooleanValueTrue(soldOutParameter.value[0]) });
    }
    
}