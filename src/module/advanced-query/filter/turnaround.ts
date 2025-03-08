import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier, NumberComparison } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists, resolveNumberComparison } from "@src/module/advanced-query/helper";

export interface TurnaroundFilterPayload extends NumberComparison {
    main?: number;
    opponent?: number;
    total?: number;
};

export class TurnaroundFilter implements Modifier {

    constructor(private readonly payload: TurnaroundFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);

        if (this.payload.main !== undefined) {
            context.where.push(`g.turn_arounds_main ${resolveNumberComparison(this.payload)} ${this.payload.main}`);
        } else if (this.payload.opponent !== undefined) {
            context.where.push(`g.turn_arounds_opponent ${resolveNumberComparison(this.payload)} ${this.payload.main}`);
        } else if (this.payload.total !== undefined) {
            context.where.push(`g.turn_arounds_main + g.turn_arounds_opponent ${resolveNumberComparison(this.payload)} ${this.payload.total}`);
        } else {
            throw new Error(`At least one of the mandatory parameters must be present: main, opponent or total`);
        }
    }
    
}