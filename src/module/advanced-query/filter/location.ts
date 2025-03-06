import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export interface LocationFilterPayload {
    atHome?: boolean;
    away?: boolean;
    neutralGround?: boolean;
    venue?: string[];
};

export class LocationFilter implements Modifier {

    constructor(private readonly payload: LocationFilterPayload) {}

    async apply(context: QueryContext): Promise<void> {
        addFromIfNotExists(context.from, `game g`);

        if (this.payload.atHome !== undefined) {
            context.where.push(`g.is_home_team = ${this.payload.atHome === true ? '1' : '0'}`);
        }

        if (this.payload.away !== undefined) {
            context.where.push(`g.is_home_team = ${this.payload.away === true ? '0' : '1'}`);
        }

        if (this.payload.neutralGround !== undefined) {
            context.where.push(`g.is_neutral_ground = ${this.payload.neutralGround === true ? '1' : '0'}`);
        }

        if (this.payload.venue !== undefined && this.payload.venue.length > 0) {
            addFromIfNotExists(context.from, `venue v`, `v.id = g.venue_id`);

            context.where.push(this.payload.venue.map(item => `v.name ilike '%${item}%'`).join(' or '));
        }
    }
    
}