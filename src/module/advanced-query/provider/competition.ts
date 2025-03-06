import { CompetitionFilter, CompetitionFilterPayload } from "@src/module/advanced-query/filter/competition";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { FilterProvider } from "@src/module/advanced-query/provider/base";

export class CompetitionFilterProvider implements FilterProvider<CompetitionFilter> {
    
    provide(descriptor: FilterDescriptor): CompetitionFilter {
        const payload: CompetitionFilterPayload = {};

        const ids: number[] = [];

        for (const parameter of descriptor.parameters) {
            if (parameter.needsResolving) {
                const resolveResult = descriptor.resolveResults?.find(item => item.forId === parameter.id);
                if (resolveResult === undefined) {
                    throw new Error(`No resolve result present for parameter ID ${parameter.id}`);
                }

                const resolvedId = resolveResult.resolved;
                if (resolvedId === undefined) {
                    throw new Error(`Resolve result for parameter ID ${parameter.id} did not contain a resolved ID`);
                }

                ids.push(resolvedId);
            } else if (parameter.value.includes("domestic")) {
                payload.domestic = true;
            } else if (parameter.value.includes("international")) {
                payload.international = true;
            }
        }

        if (ids.length > 0) {
            payload.ids = ids;
        }

        return new CompetitionFilter(payload);
    }
    
}