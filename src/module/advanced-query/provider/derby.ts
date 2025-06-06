import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { DerbyFilter } from "@src/module/advanced-query/filter/derby";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";

export class DerbyFilterProvider implements FilterProvider<DerbyFilter> {
    
    provide(descriptor: FilterDescriptor): DerbyFilter {
        const cityParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.City);
        if (cityParameter !== undefined) {
            return new DerbyFilter({ city: cityParameter.value });
        }

        const districtParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.District);
        if (districtParameter !== undefined) {
            return new DerbyFilter({ district: districtParameter.value });
        }

        throw new Error(`One of the following parameters must be present: ${[ParameterName.City, ParameterName.District].join(', ')}`);
    }
    
}