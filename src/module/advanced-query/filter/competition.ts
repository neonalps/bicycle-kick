import { QueryContext } from "@src/module/advanced-query/context";
import { Filter } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "../helper";

export interface CompetitionFilterPayload {
    ids?: number[];
    domestic?: boolean;
    international?: boolean;
};

export class CompetitionFilter implements Filter {

    constructor(private readonly payload: CompetitionFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, "game g");

        if (this.payload.ids !== undefined && this.payload.ids.length > 0) {
            context.where.push(`g.competition_id in (${this.payload.ids.join(", ")})`);
        }

        if (this.payload.domestic !== undefined) {
            context.from.push(`competition c on c.id = g.competition_id`);
            context.where.push(`c.is_domestic = ${this.payload.domestic === true ? '1' : '0'}`)
        }

        if (this.payload.international !== undefined) {
            context.from.push(`competition c on c.id = g.competition_id`);
            context.where.push(`c.is_domestic = ${this.payload.domestic === true ? '0' : '1'}`)
        }
    }
    
}