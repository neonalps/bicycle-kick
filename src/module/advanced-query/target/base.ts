import { Filter } from "@src/module/advanced-query/filter/base";
import { TargetName, TargetResultParameter } from "@src/module/advanced-query/scenario/constants";

export interface Target extends Filter {
    getName(): TargetName;
    getResultParameter(): TargetResultParameter;
    getSelector(): string;
    getOrderSelector(): string;
}