import { QueryContext } from "@src/module/advanced-query/context";
import { Filter } from "@src/module/advanced-query/filter/base";

export class LimitModifier implements Filter {

    constructor(private readonly limit: number) {}

    apply(context: QueryContext): void {
        context.limit = `${this.limit}`;
    }
    
}