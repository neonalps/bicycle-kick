import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { collectResolvedIds } from "@src/module/advanced-query/helper";
import { RefereeFilter } from "@src/module/advanced-query/filter/referee";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";
import { RefereeRole } from "@src/model/external/dto/referee-role";

export class RefereeFilterProvider implements FilterProvider<RefereeFilter> {
    
    provide(descriptor: FilterDescriptor): RefereeFilter {
        const resolvedIds = collectResolvedIds(descriptor);
        if (resolvedIds.length !== 1) {
            throw new Error(`A referee filter can only receive one resolved ID`);
        }

        const officiatingTypeParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.OfficiatingType);
        if (officiatingTypeParameter !== undefined) {
            return new RefereeFilter({ id: resolvedIds[0], officiatingType: officiatingTypeParameter.value[0] as RefereeRole });
        }

        return new RefereeFilter({ id: resolvedIds[0] });
    }
    
}