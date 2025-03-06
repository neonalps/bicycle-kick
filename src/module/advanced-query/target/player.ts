import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier } from "@src/module/advanced-query/filter/base";
import { TargetName } from "@src/module/advanced-query/scenario/constants";

export class PlayerTarget implements Modifier {

    apply(context: QueryContext): void {
        context.select.push(`gp.player_id as '${TargetName.PlayerId}'`);
    }
    
}