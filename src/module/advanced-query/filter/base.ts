import { QueryContext } from "@src/module/advanced-query/context";

export interface Filter {
    apply(context: QueryContext): void;
}

export interface QuantityComparison {
    exactly?: boolean;
    atLeast?: boolean;
    atMost?: boolean;
    moreThan?: boolean;
    lessThan?: boolean;
}

export interface TeamQuantitySelection {
    main?: number;
    opponent?: number;
    total?: number;
}