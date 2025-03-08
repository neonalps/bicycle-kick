import { CompetitionFilter, CompetitionFilterPayload } from "@src/module/advanced-query/filter/competition";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { collectResolvedIds } from "@src/module/advanced-query/helper";

export class CompetitionFilterProvider implements FilterProvider<CompetitionFilter> {
    
    provide(descriptor: FilterDescriptor): CompetitionFilter {
        const payload: CompetitionFilterPayload = {};

        for (const parameter of descriptor.parameters) {
            if (parameter.needsResolving === true) {
                continue;
            }
            
            if (parameter.value.includes("domestic")) {
                payload.domestic = true;
            } else if (parameter.value.includes("international")) {
                payload.international = true;
            }
        }

        const ids = collectResolvedIds(descriptor);
        if (ids.length > 0) {
            payload.ids = ids;
        }

        return new CompetitionFilter(payload);
    }
    
}