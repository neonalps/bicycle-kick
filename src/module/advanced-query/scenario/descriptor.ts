import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { ScenarioName } from "@src/module/advanced-query/scenario/constants";

export interface ScenarioDescriptor {
    name: ScenarioName;
    filters: FilterDescriptor[];
}