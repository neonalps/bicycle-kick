import { QueryContext } from "@src/module/advanced-query/context";
import { TargetName, TargetResultParameter } from "@src/module/advanced-query/scenario/constants";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";
import { Target } from "./base";

export class PlayerTarget implements Target {

    getName(): TargetName {
        return TargetName.Player;
    }

    getResultParameter(): TargetResultParameter {
        return TargetResultParameter.PlayerId;
    }

    getSelector(): string {
        return `gp.player_id`;
    }

    getOrderSelector(): string {
        return `gp.player_id`;
    }

    apply(context: QueryContext): void {
        context.select.push(`${this.getSelector()} as '${this.getResultParameter()}'`);
        addFromIfNotExists(context.from, `game g`);
        addFromIfNotExists(context.from, `game_players gp`, `gp.game_id = g.id`);
    }
    
}