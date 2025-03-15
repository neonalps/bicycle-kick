import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";
import { isBooleanValueTrue } from "@src/module/advanced-query/scenario/helper";
import { LocationFilter } from "@src/module/advanced-query/filter/location";

export class LocationFilterProvider implements FilterProvider<LocationFilter> {

    provide(descriptor: FilterDescriptor): LocationFilter {
        const homeParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Home);
        if (homeParameter !== undefined) {
            return new LocationFilter({ atHome: isBooleanValueTrue(homeParameter.value[0]) });
        }

        const awayParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Away);
        if (awayParameter !== undefined) {
            return new LocationFilter({ away: isBooleanValueTrue(awayParameter.value[0]) });
        }

        const neutralParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Neutral);
        if (neutralParameter !== undefined) {
            return new LocationFilter({ away: isBooleanValueTrue(neutralParameter.value[0]) });
        }

        throw new Error(`Missing one mandatory parameter of: ${[ParameterName.Home, ParameterName.Away, ParameterName.Neutral].join(", ")}`);
    }

}