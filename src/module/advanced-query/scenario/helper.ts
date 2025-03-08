import { QueryContext } from "@src/module/advanced-query/context";
import { BooleanValueType } from "@src/module/advanced-query/scenario/constants";

export function createEmptyQueryContext(): QueryContext {
    return {
        select: [],
        from: [],
        where: [],
        orderBy: [],
    }
}

export function isBooleanValueTrue(value: string): boolean {
    return value === BooleanValueType.True;
}

export function isBooleanValueFalse(value: string): boolean {
    return value === BooleanValueType.False;
}