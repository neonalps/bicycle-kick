import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier, QuantityComparison, TeamQuantitySelection } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists, resolveQuantityComparison } from "@src/module/advanced-query/helper";

export interface TeamPenaltyConcededFilterPayload extends QuantityComparison, TeamQuantitySelection {};

export class TeamPenaltyConcededFilter implements Modifier {

    constructor(private readonly payload: TeamPenaltyConcededFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);

        if (this.payload.main !== undefined) {
            context.where.push(`(g.penalties_scored_opponent + g.penalties_missed_opponent) ${resolveQuantityComparison(this.payload)} ${this.payload.main}`);
        } else if (this.payload.opponent !== undefined) {
            context.where.push(`(g.penalties_scored_main + g.penalties_missed_main) ${resolveQuantityComparison(this.payload)} ${this.payload.opponent}`);
        } else if (this.payload.total !== undefined) {
            context.where.push(`(g.penalties_scored_opponent + g.penalties_missed_opponent + g.penalties_scored_main + g.penalties_missed_main) ${resolveQuantityComparison(this.payload)} ${this.payload.total}`);
        } else {
            throw new Error(`At least one of the following properties must be present: main, opponent, total`);
        }
    }
    
}