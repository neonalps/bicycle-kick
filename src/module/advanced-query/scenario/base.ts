import { Filter } from "@src/module/advanced-query/filter/base";

export interface Scenario {
    getModifiers(): Filter[];
}