import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { collectResolvedIds } from "@src/module/advanced-query/helper";
import { SeasonFilter } from "@src/module/advanced-query/filter/season";

export class SeasonFilterProvider implements FilterProvider<SeasonFilter> {
    
    provide(descriptor: FilterDescriptor): SeasonFilter {
        return new SeasonFilter({ ids: collectResolvedIds(descriptor) });
    }
    
}