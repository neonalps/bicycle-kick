import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { PlayerSentOffGameEventFilter } from "@src/module/advanced-query/filter/player-sent-off-game-event";

export class PlayerSentOffGameEventFilterProvider implements FilterProvider<PlayerSentOffGameEventFilter> {

    provide(_: FilterDescriptor): PlayerSentOffGameEventFilter {
        return new PlayerSentOffGameEventFilter();
    }

}