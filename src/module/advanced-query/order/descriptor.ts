import { SortOrder } from "@src/module/advanced-query/scenario/constants";
import { Target } from "@src/module/advanced-query/target/base";

export interface OrderDescriptor {
    target: Target;
    order: SortOrder;
}