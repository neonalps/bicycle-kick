import { Scenario } from "@src/module/advanced-query/scenario/base";
import { Filter } from "@src/module/advanced-query/filter/base";

export class StandardScenario implements Scenario {

    getModifiers(): Filter[] {
        return [];
    }

}