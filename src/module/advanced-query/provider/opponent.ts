import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { collectResolvedIds } from "@src/module/advanced-query/helper";
import { OpponentFilter, OpponentFilterPayload } from "@src/module/advanced-query/filter/opponent";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";

export class OpponentFilterProvider implements FilterProvider<OpponentFilter> {
    
    provide(descriptor: FilterDescriptor): OpponentFilter {
        const payload: OpponentFilterPayload = {};

        const ids = collectResolvedIds(descriptor);
        if (ids.length > 0) {
            payload.ids = ids;
        }

        const cityParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.City);
        if (cityParameter !== undefined) {
            payload.fromCity = cityParameter.value;
        }

        const districtParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.District);
        if (districtParameter !== undefined) {
            payload.fromDistrict = districtParameter.value;
        }

        const countryParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Country);
        if (countryParameter !== undefined) {
            payload.fromCountry = countryParameter.value;
        }

        return new OpponentFilter(payload);
    }
    
}