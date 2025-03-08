import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { collectResolvedIds } from "@src/module/advanced-query/helper";
import { OpponentFilter, OpponentFilterPayload } from "@src/module/advanced-query/filter/opponent";

export class OpponentFilterProvider implements FilterProvider<OpponentFilter> {
    
    provide(descriptor: FilterDescriptor): OpponentFilter {
        const payload: OpponentFilterPayload = {};

        // TODO handle fromCity?

        const ids = collectResolvedIds(descriptor);
        if (ids.length > 0) {
            payload.ids = ids;
        }

        return new OpponentFilter(payload);
    }
    
}