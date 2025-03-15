import { QueryContext } from "@src/module/advanced-query/context";
import { Filter, QuantityComparison } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists, resolveQuantityComparison } from "@src/module/advanced-query/helper";

export interface PlayerGoalsScoredFilterPayload extends QuantityComparison {
    goals: number;
};

export class PlayerGoalsScoredFilter implements Filter {

    constructor(private readonly payload: PlayerGoalsScoredFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);
        addFromIfNotExists(context.from, `game_players gp`, `gp.game_id = g.id`);

        const { goals } = this.payload;

        context.where.push(`gp.goals_scored ${resolveQuantityComparison(this.payload)} ${goals}`);
    }
    
}