import { QueryContext } from "@src/module/advanced-query/context";
import { Filter } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export interface SeasonFilterPayload {
    ids: number[];
};

export class SeasonFilter implements Filter {

    constructor(private readonly payload: SeasonFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);

        context.where.push(this.payload.ids.map(item => `g.season_id = ${item}`).join(' or '));
    }
    
}