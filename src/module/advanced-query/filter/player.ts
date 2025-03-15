import { QueryContext } from "@src/module/advanced-query/context";
import { Filter } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export interface PlayerFilterPayload {
    ids: number[];
};

export class PlayerFilter implements Filter { 

    constructor(private readonly payload: PlayerFilterPayload) {}

    async apply(context: QueryContext): Promise<void> {
        addFromIfNotExists(context.from, `game g`);
        addFromIfNotExists(context.from, `game_players gp`, `gp.game_id = g.id`);

        context.where.push(`gp.player_id in (${this.payload.ids.join(", ")})`);
    }

}