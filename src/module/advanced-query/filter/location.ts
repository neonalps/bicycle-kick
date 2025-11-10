import { QueryContext } from "@src/module/advanced-query/context";
import { Filter } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export interface LocationFilterPayload {
    atHome?: boolean;
    away?: boolean;
    neutralGround?: boolean;
};

export class LocationFilter implements Filter {

    constructor(private readonly payload: LocationFilterPayload) {}

    async apply(context: QueryContext): Promise<void> {
        addFromIfNotExists(context.from, `game g`);

        if (this.payload.atHome !== undefined) {
            context.where.push(`g.is_home_team = ${this.payload.atHome}`);
        }

        if (this.payload.away !== undefined) {
            context.where.push(`g.is_home_team = ${this.payload.away}`);
        }

        if (this.payload.neutralGround !== undefined) {
            context.where.push(`g.is_neutral_ground = ${this.payload.neutralGround}`);
        }
    }
    
}