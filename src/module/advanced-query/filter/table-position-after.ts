import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier, QuantityComparison } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists, resolveQuantityComparison } from "@src/module/advanced-query/helper";

export interface TablePositionAfterFilterPayload extends QuantityComparison {
    quantity: number;
};

export class TablePositionAfterFilter implements Modifier {

    constructor(private readonly payload: TablePositionAfterFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);

        context.where.push(`(g.table_position_after + g.table_position_offset) ${resolveQuantityComparison(this.payload)} ${this.payload.quantity}`);
    }
    
}