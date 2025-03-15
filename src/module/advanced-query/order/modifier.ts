import { QueryContext } from "@src/module/advanced-query/context";
import { Filter } from "@src/module/advanced-query/filter/base";
import { OrderDescriptor } from "@src/module/advanced-query/order/descriptor";

export class OrderModifier implements Filter {

    constructor(private readonly descriptor: OrderDescriptor) {}

    apply(context: QueryContext): void {
        context.orderBy.push([this.descriptor.target.getOrderSelector(), this.descriptor.order].join(" "));
    }
    
}