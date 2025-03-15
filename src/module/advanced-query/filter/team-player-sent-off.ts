import { QueryContext } from "@src/module/advanced-query/context";
import { Filter, QuantityComparison } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists, resolveQuantityComparison } from "@src/module/advanced-query/helper";

export interface TeamPlayerSentOffFilterPayload extends QuantityComparison {
    main?: number;
    opponent?: number;
    total?: number;
};

export class TeamPlayerSentOffFilter implements Filter {

    constructor(private readonly payload: TeamPlayerSentOffFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);

        if (this.payload.main !== undefined) {
            context.where.push(`(g.yellow_red_cards_main + g.red_cards_main) ${resolveQuantityComparison(this.payload)} ${this.payload.main}`);
        } else if (this.payload.opponent !== undefined) {
            context.where.push(`(g.yellow_red_cards_opponent + g.red_cards_opponent) ${resolveQuantityComparison(this.payload)} ${this.payload.opponent}`);
        } else if (this.payload.total !== undefined) {
            context.where.push(`(g.yellow_red_cards_main + g.red_cards_main + g.yellow_red_cards_opponent + g.red_cards_opponent) ${resolveQuantityComparison(this.payload)} ${this.payload.total}`);
        } else {
            throw new Error(`At least one of the following properties must be present: main, opponent, total`);
        }
    }
    
}