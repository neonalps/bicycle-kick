import { QueryContext } from "@src/module/advanced-query/context";
import { Filter } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export interface SoldOutFilterPayload {
    isSoldOut: boolean;
};

export class SoldOutFilter implements Filter {

    constructor(private readonly payload: SoldOutFilterPayload) {}

    async apply(context: QueryContext): Promise<void> {
        addFromIfNotExists(context.from, `game g`);

        context.where.push(`g.is_sold_out = ${this.payload.isSoldOut === true ? '1' : '0'}`);
    }
    
}