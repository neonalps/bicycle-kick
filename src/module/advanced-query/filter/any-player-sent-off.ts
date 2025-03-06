import { QueryContext } from "@src/module/advanced-query/context";
import { Modifier, NumberComparison } from "@src/module/advanced-query/filter/base";
import { addFromIfNotExists, resolveNumberComparison } from "@src/module/advanced-query/helper";

export interface AnyPlayerSentOffFilterPayload extends NumberComparison {
    playersSentOff: number;
    eitherTeam?: boolean;
    mainPlayer?: boolean;
};

export class AnyPlayerSentOffFilter implements Modifier {

    constructor(private readonly payload: AnyPlayerSentOffFilterPayload) {}

    apply(context: QueryContext): void {
        addFromIfNotExists(context.from, `game g`);

        const comparison = `${resolveNumberComparison(this.payload)} ${this.payload.playersSentOff}`;

        if (this.payload.mainPlayer !== undefined) {
            if (this.payload.mainPlayer === true) {
                context.where.push(`(g.yellow_red_cards_main + g.red_cards_main) ${comparison}`);
            } else {
                context.where.push(`(g.yellow_red_cards_opponent + g.red_cards_opponent) ${comparison}`);
            }
        } else if (this.payload.eitherTeam === true) {
            context.where.push(`(g.yellow_red_cards_main + g.red_cards_main + g.yellow_red_cards_opponent + g.red_cards_opponent) ${comparison}`);
        }
    }
    
}