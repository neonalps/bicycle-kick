import { QueryContext } from "@src/module/advanced-query/context";
import { Filter, QuantityComparison } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists, resolveQuantityComparison } from "@src/module/advanced-query/helper";

export interface TeamDirectFreeKickFilterPayload extends QuantityComparison {
    quantity: number;
};

export class TeamDirectFreeKickFilter implements Filter {

    constructor(private readonly payload: TeamDirectFreeKickFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);

        const { quantity } = this.payload;

        // the rest is done in post-processing
        context.where.push(`(g.direct_free_kick_goals_main + g.direct_free_kick_goals_opponent) ${resolveQuantityComparison(this.payload)} ${quantity}`);
    }
    
}