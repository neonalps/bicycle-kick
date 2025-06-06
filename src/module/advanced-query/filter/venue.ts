import { QueryContext } from "@src/module/advanced-query/context";
import { Filter } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export interface VenueFilterPayload {
    ids: number[];
};

export class VenueFilter implements Filter {

    constructor(private readonly payload: VenueFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);

        context.where.push(`g.venue_id in (${this.payload.ids.join(", ")})`);
    }
    
}