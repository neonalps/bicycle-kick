import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { PlayerFilter } from "@src/module/advanced-query/filter/player";
import { collectResolvedIds } from "@src/module/advanced-query/helper";

export class PlayerFilterProvider implements FilterProvider<PlayerFilter> {
    
    provide(descriptor: FilterDescriptor): PlayerFilter {
        return new PlayerFilter({ ids: collectResolvedIds(descriptor) });
    }
    
}