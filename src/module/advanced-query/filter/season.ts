import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export interface SeasonFilterPayload {
    ids: number[];
};

export class SeasonFilter implements Modifier {

    constructor(private readonly payload: SeasonFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);

        context.where.push(this.payload.ids.map(item => `g.season_id = ${item}`).join(' or '));
    }
    
}