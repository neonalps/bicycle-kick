import { QueryContext } from "@src/module/advanced-query/context";
import { Filter, QuantityComparison } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists, resolveQuantityComparison } from "@src/module/advanced-query/helper";

export interface PlayerPenaltyMissedFilterPayload extends QuantityComparison {
    quantity: number;
};

export class PlayerPenaltyMissedFilter implements Filter {

    constructor(private readonly payload: PlayerPenaltyMissedFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);
        addFromIfNotExists(context.from, `game_players gp`, `gp.game_id = g.id`);

        const { quantity } = this.payload;

        context.where.push(`(gp.regulation_penalties_taken - gp.regulation_penalties_scored) ${resolveQuantityComparison(this.payload)} ${quantity}`);
    }
    
}