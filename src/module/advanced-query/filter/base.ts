import { QueryContext } from "@src/module/advanced-query/context";

export interface Modifier {
    apply(context: QueryContext): void;
}

export interface NumberComparison {
    exactly?: boolean;
    atLeast?: boolean;
    atMost?: boolean;
    moreThan?: boolean;
    lessThan?: boolean;
}