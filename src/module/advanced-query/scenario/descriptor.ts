import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { ScenarioName } from "@src/module/advanced-query/scenario/constants";
import { Target } from "@src/module/advanced-query/target/base";
import { OrderDescriptor } from "@src/module/advanced-query/order/descriptor";
import { LimitDescriptor } from "@src/module/advanced-query/limit/descriptor";

export interface ScenarioDescriptor {
    name: ScenarioName;
    targets: Target[];
    filters: FilterDescriptor[];
    orders: OrderDescriptor[];
    limit?: LimitDescriptor;
}