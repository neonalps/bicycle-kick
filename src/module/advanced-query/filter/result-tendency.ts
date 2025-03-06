import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists } from "@src/module/advanced-query/helper";

export interface ResultTendencyFilterPayload {
    won?: boolean;
    drawn?: boolean;
    lost?: boolean;
    goalDifference?: number;
};

export class ResultTendencyFilter implements Modifier {

    constructor(private readonly payload: ResultTendencyFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);

        if (this.payload.won !== undefined) {
            if (this.payload.won === true) {
                context.where.push(`g.result_tendency = 'w'`);
            } else {
                context.where.push(`g.result_tendency != 'w'`)
            }
        }

        if (this.payload.drawn !== undefined) {
            if (this.payload.drawn === true) {
                context.where.push(`g.result_tendency = 'd'`);
            } else {
                context.where.push(`g.result_tendency != 'd'`)
            }
        }

        if (this.payload.lost !== undefined) {
            if (this.payload.lost === true) {
                context.where.push(`g.result_tendency = 'l'`);
            } else {
                context.where.push(`g.result_tendency != 'l'`)
            }
        }

        if (this.payload.goalDifference !== undefined) {
            context.where.push(`g.ft_goals_main - g.ft_goals_opponent = ${this.payload.goalDifference}`)
        }
    }
    
}