import { Modifier } from "@src/module/advanced-query/filter/base";

export interface Scenario {
    getModifiers(): Modifier[];
}