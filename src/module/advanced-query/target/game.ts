import { QueryContext } from "@src/module/advanced-query/context";
import { TargetName, TargetResultParameter } from "@src/module/advanced-query/scenario/constants";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";
import { Target } from "./base";

export class GameTarget implements Target {

    getName(): TargetName {
        return TargetName.Game;
    }

    getResultParameter(): TargetResultParameter {
        return TargetResultParameter.GameId;
    }

    getSelector(): string {
        return `g.id`;
    }

    getOrderSelector(): string {
        return `g.kickoff`;
    }

    apply(context: QueryContext): void {
        context.select.push(`${this.getSelector()} as '${this.getResultParameter()}'`);
        addFromIfNotExists(context.from, `game g`);
    }
    
}