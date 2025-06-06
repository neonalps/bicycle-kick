import { QueryContext } from "@src/module/advanced-query/context";
import { Filter } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export class GameEventFilter implements Filter {

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);
        addFromIfNotExists(context.from, `game_events ge`, `ge.game_id = g.id`);
    }

    postProcess(input: unknown): boolean | undefined {
        return;
    }

}