import { OfficiatingType } from "@src/model/type/officiating-type";
import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export interface RefereeFilterPayload {
    id: number;
    officiatingType?: OfficiatingType;
};

export class RefereeFilter implements Modifier { 

    constructor(private readonly payload: RefereeFilterPayload) {}

    async apply(context: QueryContext): Promise<void> {
        addFromIfNotExists(context.from, `game g`);
        addFromIfNotExists(context.from, `game_referees gr`, `gr.game_id = g.id`);

        const parts: string[] = [
            `gr.person_id = ${this.payload.id}`
        ];

        if (this.payload.officiatingType !== undefined) {
            parts.push(`gr.officiating_type = '${this.payload.officiatingType}'`);
        }

        context.where.push(parts.join(" and "));
    }

}