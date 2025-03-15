import { Scenario } from "@src/module/advanced-query/scenario/base";
import { Filter } from "@src/module/advanced-query/filter/base";
import { GameTarget } from "@src/module/advanced-query/target/game";
import { PlayerTarget } from "@src/module/advanced-query/target/player";

export class GoalsScoredByPlayerScenario implements Scenario {

    getModifiers(): Filter[] {
        return [
            new GameTarget(),
            new PlayerTarget(),
        ];
    }

}