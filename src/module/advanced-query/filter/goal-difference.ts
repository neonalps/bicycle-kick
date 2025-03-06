import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier, NumberComparison } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists, resolveNumberComparison } from "@src/module/advanced-query/helper";

export interface GoalDifferenceFilterPayload extends NumberComparison {
    goalDifference: number;
};

export class GoalDifferenceFilter implements Modifier {

    constructor(private readonly payload: GoalDifferenceFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);

        if (this.payload.goalDifference !== undefined) {
            context.where.push(`g.ft_goals_main - g.ft_goals_opponent ${resolveNumberComparison(this.payload)} ${this.payload.goalDifference}`)
        }
    }
    
}