import { ScenarioDescriptor } from "@src/module/advanced-query/scenario/descriptor";
import { Tokenizer } from "@src/module/advanced-query/tokenizer/tokenizer";
import { FilterName, ParameterName, ScenarioName } from "@src/module/advanced-query/scenario/constants";

export class EnglishTokenizer implements Tokenizer {

    tokenize(raw: string): ScenarioDescriptor | null {
        return {
            name: ScenarioName.GoalsScoredByPlayer,
            filters: [
                { name: FilterName.Competition, parameters: [{ id: "uuid-competition", name: ParameterName.Name, value: ["bundesliga"], needsResolving: true, }, { id: "uuid-competition-cup", name: ParameterName.Name, value: ["cup"], needsResolving: true, }], },
                //{ name: FilterName.ResultTendency, parameters: [{ id: "uuid-result-tendency", name: ParameterName.Won, value: ["0"], needsResolving: false, }], },
                //{ name: FilterName.Turnaround, parameters: [{ id: "uuid-turnaround", name: ParameterName.Main, value: ["1"], needsResolving: false, }, { id: "uuid-turnaround-comparison", name: ParameterName.AtLeast, value: [], needsResolving: false, }], },
                //{ name: FilterName.PlayerPenaltyMissed, parameters: [{ id: "uuid-player-penalty-missed", name: ParameterName.Quantity, value: ["1"], needsResolving: false, }, { id: "uuid-turnaround-comparison", name: ParameterName.Exactly, value: [], needsResolving: false, }], },
                //{ name: FilterName.TeamPenaltyConceded, parameters: [{ id: "uuid-team-penalty-conceded", name: ParameterName.Main, value: ["1"], needsResolving: false, }, { id: "uuid-turnaround-comparison", name: ParameterName.AtLeast, value: [], needsResolving: false, }], },
                //{ name: FilterName.AnyPlayerSentOff, parameters: [{ id: "uuid-any-player-sent-off", name: ParameterName.Main, value: ["2"], needsResolving: false, }, { id: "uuid-turnaround-comparison", name: ParameterName.AtLeast, value: [], needsResolving: false, }], },
                //{ name: FilterName.Season, parameters: [{ id: "uuid-season", name: ParameterName.Current, value: [], needsResolving: true, }], },
                //{ name: FilterName.Referee, parameters: [{ id: "uuid-referee", name: ParameterName.Name, value: ["lechner"], needsResolving: true, }, { id: "uuid-referee-officiating", name: ParameterName.OfficiatingType, value: ["fourthOfficial"], needsResolving: false }], },
                //{ name: FilterName.GoalDifference, parameters: [{ id: "uuid-goal-difference", name: ParameterName.GoalDifference, value: ["3"], needsResolving: false, }, { id: "uuid-goal-difference-2", name: ParameterName.AtLeast, value: [], needsResolving: false, }], },
                { name: FilterName.Player, parameters: [{ id: "uuid-player", name: ParameterName.Name, value: ["manprit", "sarkaria"], needsResolving: true, }], },
                //{ name: FilterName.Opponent, parameters: [{ id: "uuid-opponent", name: ParameterName.Name, value: ["rapid"], needsResolving: true, }], },
                //{ name: FilterName.SoldOut, parameters: [{ id: "uuid-sold-out", name: ParameterName.SoldOut, value: ["1"], needsResolving: false, }], },
                //{ name: FilterName.Minute, parameters: [{ id: "uuid-minute", name: "name", value: ["0", "15"], needsResolving: false, }], },
            ],
        };
    }
    
}