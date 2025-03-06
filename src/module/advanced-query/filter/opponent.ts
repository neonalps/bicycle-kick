import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export interface OpponentFilterPayload {
    ids?: number[];
    fromCity?: string[];
};

export class OpponentFilter implements Modifier {

    constructor(private readonly payload: OpponentFilterPayload) {}

    apply(context: QueryContext): void {
        if (this.payload.ids !== undefined && this.payload.ids.length > 0) {
            context.where.push(`g.opponent_id in (${this.payload.ids.join(", ")})`);
        }

        if (this.payload.fromCity !== undefined && this.payload.fromCity.length > 0) {
            addFromIfNotExists(context.from, `club c`, `g.opponent_id = c.id`);
            context.where.push(this.payload.fromCity.map(item => `c.city_name ilike '%${item}%'`).join(' or '));
        }
    }
    
}