import { QueryContext } from "@src/module/advanced-query/context";
import { Filter, QuantityComparison } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists, resolveQuantityComparison } from "@src/module/advanced-query/helper";

export interface GoalDifferenceFilterPayload extends QuantityComparison {
    quantity: number;
};

export class GoalDifferenceFilter implements Filter {

    constructor(private readonly payload: GoalDifferenceFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);

        context.where.push(`g.ft_goals_main - g.ft_goals_opponent ${resolveQuantityComparison(this.payload)} ${this.payload.quantity}`);
    }
    
}