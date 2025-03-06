import { QueryContext } from "@src/module/advanced-query/context";

export function createEmptyQueryContext(): QueryContext {
    return {
        select: [],
        from: [],
        where: [],
        orderBy: [],
    }
}