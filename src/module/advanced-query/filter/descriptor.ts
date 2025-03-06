import { FilterName } from "@src/module/advanced-query/scenario/constants";
import { IdResolveResult } from "@src/module/advanced-query/id-resolver/base";
import { FilterParameter } from "./parameter";

export interface FilterDescriptor {
    name: FilterName;
    parameters: FilterParameter[];
    resolveResults?: IdResolveResult[];
}