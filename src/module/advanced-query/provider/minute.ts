import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { MinuteFilter } from "@src/module/advanced-query/filter/minute";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";
import { GameMinute } from "@src/model/internal/game-minute";

export class MinuteFilterProvider implements FilterProvider<MinuteFilter> {
    
    provide(descriptor: FilterDescriptor): MinuteFilter {
        const fromParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.From);
        if (fromParameter === undefined) {
            throw new Error(`Missing mandatory parameter: from`);
        }

        const toParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.To);
        if (toParameter === undefined) {
            throw new Error(`Missing mandatory parameter: to`);
        }

        return new MinuteFilter({ 
            from: new GameMinute(fromParameter.value[0]), 
            to: new GameMinute(toParameter.value[0]) 
        });
    }
    
}