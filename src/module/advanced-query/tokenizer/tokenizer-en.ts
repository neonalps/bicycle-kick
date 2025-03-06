import { ScenarioDescriptor } from "@src/module/advanced-query/scenario/descriptor";
import { Tokenizer } from "@src/module/advanced-query/tokenizer/tokenizer";
import { FilterName, ScenarioName } from "@src/module/advanced-query/scenario/constants";

export class EnglishTokenizer implements Tokenizer {

    tokenize(raw: string): ScenarioDescriptor | null {
        return {
            name: ScenarioName.GoalsScoredByPlayer,
            filters: [
                { name: FilterName.Competition, parameters: [{ id: "uuid-competition", value: ["bundesliga"], needsResolving: true, }], },
                /*{ name: FilterName.Opponent, parameters: [{ id: "uuid-opponent", value: ["rapid"], needsResolving: true, }], },
                { name: FilterName.Player, parameters: [{ id: "uuid-player", value: ["manprit", "sarkaria"], needsResolving: true, }], },
                { name: FilterName.Minute, parameters: [{ id: "uuid-minute", value: ["0", "15"], needsResolving: false, }], },*/
            ],
        };
    }
    
}