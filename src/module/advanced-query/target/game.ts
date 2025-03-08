import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier } from "@src/module/advanced-query/filter/base";
import { TargetName } from "@src/module/advanced-query/scenario/constants";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export class GameTarget implements Modifier {

    apply(context: QueryContext): void {
        context.select.push(`g.id as '${TargetName.GameId}'`);
        addFromIfNotExists(context.from, `game g`);
    }
    
}