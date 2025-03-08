import { Scenario } from "@src/module/advanced-query/scenario/base";
import { Modifier } from "@src/module/advanced-query/filter/base";
import { GameTarget } from "@src/module/advanced-query/target/game";
import { PlayerTarget } from "@src/module/advanced-query/target/player";

/**
 * Example:
 *  - When was the last time one of our players scored a clean hattrick in a home game?
 *  - When was the last time an opponent player scored a clean hattrick?
 *  - When was the last time someone scored a clean hattrick?
 * 
 * DB:
 *  - check for games where main or opponent team scored at least three goals
 * 
 * Post-processing:
 *  - 
 */
export class CleanHattrickScenario implements Scenario {

    getModifiers(): Modifier[] {
        return [
            new GameTarget(),
            new PlayerTarget(),
        ];
    }

}