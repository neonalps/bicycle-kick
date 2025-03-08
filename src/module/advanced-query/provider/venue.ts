import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { collectResolvedIds } from "@src/module/advanced-query/helper";
import { VenueFilter } from "@src/module/advanced-query/filter/venue";

export class VenueFilterProvider implements FilterProvider<VenueFilter> {
    
    provide(descriptor: FilterDescriptor): VenueFilter {
        return new VenueFilter({ ids: collectResolvedIds(descriptor) });
    }
    
}