import { Game } from "@src/model/internal/game";
import { Person } from "@src/model/internal/person";
import { QueryContext } from "@src/module/advanced-query/context";
import { NumberComparison } from "@src/module/advanced-query/filter/base";

export interface PersonGameTuple {
    person: Person;
    game: Game;
}

export function convertContextToSql(context: QueryContext): string {
    const query: string[] = ["select"];
    query.push(context.select.join(", "));

    query.push("from");
    query.push(context.from.join(" left join "));

    query.push("where");
    query.push(context.where.join(" and "));

    if (context.orderBy.length > 0) {
        query.push("order by");
        query.push(context.orderBy.join(", "));
    }

    if (context.limit !== undefined) {
        query.push("limit");
        query.push(context.limit);
    }

    return query.join(" ");
}

export function addFromIfNotExists(from: string[], table: string, joinCondition?: string): void {
    if (from.some(item => item.startsWith(table))) {
        return;
    }

    const toAdd = [table];
    if (joinCondition !== undefined) {
        toAdd.push(`on ${joinCondition}`);
    }

    from.push(toAdd.join(" "));
}

export function resolveNumberComparison(comparison: NumberComparison): string {
    if (comparison.atLeast === true) {
        return ">=";
    } else if (comparison.atMost === true) {
        return "<=";
    } else if (comparison.lessThan === true) {
        return "<";
    } else if (comparison.moreThan === true) {
        return ">";
    } else {
        return "=";
    }
}