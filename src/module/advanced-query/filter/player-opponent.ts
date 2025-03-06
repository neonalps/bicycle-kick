import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export class OpponentPlayerFilter implements Modifier {

    constructor() {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);
        addFromIfNotExists(context.from, `game_players gp`, `gp.game_id = g.id`);

        context.where.push(`gp.plays_for_main = 0`);
    }
    
}