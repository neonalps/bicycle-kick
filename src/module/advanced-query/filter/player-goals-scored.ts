import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier, NumberComparison } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists, resolveNumberComparison } from "@src/module/advanced-query/helper";

export interface PlayerGoalsScoredFilterPayload extends NumberComparison {
    goals: number;
};

export class PlayerGoalsScoredFilter implements Modifier {

    constructor(private readonly payload: PlayerGoalsScoredFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);
        addFromIfNotExists(context.from, `game_players gp`, `gp.game_id = g.id`);

        const { goals } = this.payload;

        context.where.push(`gp.goals_scored ${resolveNumberComparison(this.payload)} ${goals}`);
    }
    
}