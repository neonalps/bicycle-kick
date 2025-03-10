import { ScenarioDescriptor } from "@src/module/advanced-query/scenario/descriptor";
import { Tokenizer } from "@src/module/advanced-query/tokenizer/tokenizer";
import { FilterName, Language, ParameterName, ScenarioName } from "@src/module/advanced-query/scenario/constants";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { AdvancedQueryConfig } from "../service";
import { UuidSource } from "@src/util/uuid";
import { FilterParameter } from "../filter/parameter";

export class EnglishTokenizer implements Tokenizer {

    constructor(private readonly config: AdvancedQueryConfig, private readonly uuidSource: UuidSource) {}

    private static readonly THRESHOLD_APPLICABLE_WORDS = 3;

    private static readonly DETECTION_WORDS: string[] = [
        "a", "an", "against", "did", "how", "in", "last", "many", "goals", "of", "score", "the", "time", "when", "was", "were"
    ];

    private static readonly KEYWORDS_DERBY = [
        "derby",
    ];

    private static readonly NUMBER_MAP: Record<string, number> = {
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
        "seven": 7,
        "eight": 8,
        "nine": 9,
        "ten": 10,
        "eleven": 11,
        "twelve": 12,
        "thirteen": 13,
        "fourteen": 14,
        "fifteen": 15,
        "sixteen": 16,
        "seventeen": 17,
        "eighteen": 18,
        "nineteen": 19,
        "twenty": 20,
    };

    getLanguage(): Language {
        return Language.English;
    }

    tokenize(raw: string): ScenarioDescriptor | null {
        const parts = raw.split(" ");
        if (!this.isApplicable(parts)) {
            return null;
        }

        return {
            name: ScenarioName.GoalsScoredByPlayer,
            filters: this.getFilterDescriptors(raw, parts),
        }

        /*return {
            name: ScenarioName.GoalsScoredByPlayer,
            filters: [
                //{ name: FilterName.Competition, parameters: [{ id: "uuid-competition", name: ParameterName.Name, value: ["bundesliga"], needsResolving: true, }, { id: "uuid-competition-cup", name: ParameterName.Name, value: ["cup"], needsResolving: true, }], },
                { name: FilterName.Derby, parameters: [{ id: "uuid-derby", name: ParameterName.City, value: ["Graz"], needsResolving: false, }], },
                //{ name: FilterName.TablePositionAfter, parameters: [{ id: "uuid-table-position-after", name: ParameterName.Quantity, value: ["1"], needsResolving: false, }, { id: "uuid-table-position-after-comparision", name: ParameterName.Exactly, value: [], needsResolving: false, }], },
                { name: FilterName.ResultTendency, parameters: [{ id: "uuid-result-tendency", name: ParameterName.Won, value: ["0"], needsResolving: false, }], },
                { name: FilterName.Turnaround, parameters: [{ id: "uuid-turnaround", name: ParameterName.Main, value: ["1"], needsResolving: false, }, { id: "uuid-turnaround-comparison", name: ParameterName.AtLeast, value: [], needsResolving: false, }], },
                //{ name: FilterName.PlayerPenaltyMissed, parameters: [{ id: "uuid-player-penalty-missed", name: ParameterName.Quantity, value: ["1"], needsResolving: false, }, { id: "uuid-turnaround-comparison", name: ParameterName.Exactly, value: [], needsResolving: false, }], },
                //{ name: FilterName.TeamPenaltyConceded, parameters: [{ id: "uuid-team-penalty-conceded", name: ParameterName.Main, value: ["1"], needsResolving: false, }, { id: "uuid-turnaround-comparison", name: ParameterName.AtLeast, value: [], needsResolving: false, }], },
                //{ name: FilterName.AnyPlayerSentOff, parameters: [{ id: "uuid-any-player-sent-off", name: ParameterName.Main, value: ["2"], needsResolving: false, }, { id: "uuid-turnaround-comparison", name: ParameterName.AtLeast, value: [], needsResolving: false, }], },
                //{ name: FilterName.Season, parameters: [{ id: "uuid-season", name: ParameterName.Current, value: [], needsResolving: true, }], },
                //{ name: FilterName.Referee, parameters: [{ id: "uuid-referee", name: ParameterName.Name, value: ["lechner"], needsResolving: true, }, { id: "uuid-referee-officiating", name: ParameterName.OfficiatingType, value: ["fourthOfficial"], needsResolving: false }], },
                //{ name: FilterName.GoalDifference, parameters: [{ id: "uuid-goal-difference", name: ParameterName.GoalDifference, value: ["3"], needsResolving: false, }, { id: "uuid-goal-difference-2", name: ParameterName.AtLeast, value: [], needsResolving: false, }], },
                //{ name: FilterName.Player, parameters: [{ id: "uuid-player", name: ParameterName.Name, value: ["manprit", "sarkaria"], needsResolving: true, }], },
                //{ name: FilterName.Opponent, parameters: [{ id: "uuid-opponent", name: ParameterName.Name, value: ["rapid"], needsResolving: true, }], },
                //{ name: FilterName.SoldOut, parameters: [{ id: "uuid-sold-out", name: ParameterName.SoldOut, value: ["1"], needsResolving: false, }], },
                //{ name: FilterName.Minute, parameters: [{ id: "uuid-minute", name: "name", value: ["0", "15"], needsResolving: false, }], },
            ],
        };*/
    }

    private isApplicable(parts: string[]): boolean {
        return parts.filter(item => EnglishTokenizer.DETECTION_WORDS.includes(item)).length >= EnglishTokenizer.THRESHOLD_APPLICABLE_WORDS;
    }

    private createParameter(name: ParameterName, value: string[], needsResolving: boolean): FilterParameter {
        return {
            id: this.uuidSource.getRandom(),
            name,
            value,
            needsResolving,
        }
    }

    private getFilterDescriptors(raw: string, parts: string[]): FilterDescriptor[] {
        return [
            this.getDerbyDescriptor(parts),
        ].filter(descriptor => descriptor !== null);
    }

    private getDerbyDescriptor(parts: string[]): FilterDescriptor | null {
        if (!EnglishTokenizer.KEYWORDS_DERBY.some(item => parts.includes(item))) {
            return null;
        }

        return { 
            name: FilterName.Derby,
            parameters: [
                this.createParameter(ParameterName.City, [this.config.mainClubCity], false),
            ]
        };
    }
    
}