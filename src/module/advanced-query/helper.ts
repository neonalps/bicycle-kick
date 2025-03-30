import { Game } from "@src/model/internal/game";
import { Person } from "@src/model/internal/person";
import { QueryContext } from "@src/module/advanced-query/context";
import { QuantityComparison } from "@src/module/advanced-query/filter/base";
import { FilterDescriptor } from "./filter/descriptor";
import { FilterParameter } from "./filter/parameter";
import { ParameterName } from "./scenario/constants";
import { Target } from "./target/base";

export interface PersonGameTuple {
    person: Person;
    game: Game;
}

export function convertContextToSql(context: QueryContext): string {
    const query: string[] = ["select"];
    query.push(context.select.join(", "));

    query.push("from");
    query.push(context.from.join(" left join "));

    if (context.where.length > 0) {
        query.push("where");
        query.push(context.where.join(" and "));
    }

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

export function addTargetIfNotExists(targets: Target[], toAdd: Target): void {
    if (targets.some(target => target.getName() === toAdd.getName())) {
        return;
    }

    targets.push(toAdd);
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

export function extractNumberComparison(descriptor: FilterDescriptor): QuantityComparison | null {
    const atLeastParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.AtLeast);
    if (atLeastParameter !== undefined) {
        return { atLeast: true };
    }

    const atMostParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.AtMost);
    if (atMostParameter !== undefined) {
        return { atMost: true };
    }

    const lessThanParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.LessThan);
    if (lessThanParameter !== undefined) {
        return { lessThan: true };
    }

    const moreThanParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.MoreThan);
    if (moreThanParameter !== undefined) {
        return { moreThan: true };
    }

    const exactlyParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Exactly);
    if (exactlyParameter !== undefined) {
        return { exactly: true };
    }

    return null;
}

export function extractQuantity(descriptor: FilterDescriptor): number | null {
    const quantityParameter = descriptor.parameters.find(parameter => parameter.name === ParameterName.Quantity);
    if (quantityParameter !== undefined) {
        return Number(quantityParameter.value[0]);
    }

    return null;
}

export function resolveQuantityComparison(comparison: QuantityComparison): string {
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

export function collectResolvedIds(descriptor: FilterDescriptor): number[] {
    return Array.from(descriptor.parameters
        .filter(parameter => parameter.needsResolving === true)
        .reduce((accumulator: Set<number>, current: FilterParameter) => {
            const resolveResult = descriptor.resolveResults?.find(item => item.forId === current.id);
            if (resolveResult === undefined) {
                throw new Error(`No resolve result present for parameter ID ${current.id}`);
            }

            const resolvedId = resolveResult.resolved;
            if (resolvedId === undefined) {
                throw new Error(`Resolve result for parameter ID ${current.id} did not contain a resolved ID`);
            }

            accumulator.add(resolvedId);
            return accumulator;
        }, new Set()));
}