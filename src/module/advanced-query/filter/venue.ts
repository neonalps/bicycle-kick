import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export interface VenueFilterPayload {
    ids: number[];
};

export class VenueFilter implements Modifier {

    constructor(private readonly payload: VenueFilterPayload) {}

    async apply(context: QueryContext): Promise<void> {
        addFromIfNotExists(context.from, `game g`);

        context.where.push(`g.venue_id in (${this.payload.ids.join(", ")})`);
    }
    
}