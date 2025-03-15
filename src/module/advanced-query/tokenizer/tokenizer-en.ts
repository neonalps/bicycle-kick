import { ScenarioDescriptor } from "@src/module/advanced-query/scenario/descriptor";
import { Tokenizer } from "@src/module/advanced-query/tokenizer/tokenizer";
import { BooleanValueType, FilterName, Language, ParameterName, ScenarioName, SortOrder, SubjectName, TargetName } from "@src/module/advanced-query/scenario/constants";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { AdvancedQueryConfig } from "@src/module/advanced-query/service";
import { UuidSource } from "@src/util/uuid";
import { FilterParameter } from "@src/module/advanced-query/filter/parameter";
import { ifPresent } from "@src/util/functional-queries";
import { Target } from "@src/module/advanced-query/target/base";
import { GameTarget } from "@src/module/advanced-query/target/game";
import { PlayerTarget } from "@src/module/advanced-query/target/player";
import { OrderDescriptor } from "@src/module/advanced-query/order/descriptor";
import { LimitDescriptor } from "@src/module/advanced-query/limit/descriptor";

export class EnglishTokenizer implements Tokenizer {

    constructor(private readonly config: AdvancedQueryConfig, private readonly uuidSource: UuidSource) {}

    private static readonly THRESHOLD_APPLICABLE_WORDS = 3;

    private static readonly TRIGGER_WORDS: string[] = [
        "a", "an", "against", "away", 
        "did", 
        "first",
        "last",
        "game", "goals",
        "home", "how", 
        "in", "last", 
        "many", "match",
        "of",
        "score",
        "the", "time", 
        "when", "was", "were",
    ];

    private static readonly GAME_TARGET_TRIGGERS = [
        "when",
    ];

    private static readonly PLAYER_TARGET_TRIGGERS = [
        "who",
    ];

    private static readonly NEGATION_STATEMENTS = ["not", "didn't"];

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

        // check for scenario first, otherwise assume standard scenario and simply resolve targets
        const scenarioName = this.resolveScenarioName(raw, parts);

        const subject = this.resolveSubject(parts);
        const targets = this.resolveTargets(raw, parts);
        const filters = this.resolveFilterDescriptors(raw, parts, subject);
        const orders = this.resolveOrders(parts, targets);
        const limit = this.resolveLimit(parts);

        /**
         * When did we last win an away derby after being behind 10 minutes before the end?
         * How many goals did Manprit Sarkaria score against Rapid in domestic games?
         * When did we last win a game after being two goals down in the 60th minute?
         * When did we last have a player sent off in the first 10 minutes of a game and didn't lose?
         * What was our longest unbeaten streak in the season 2023/2024?
         * In which game did we win our last title?
         * Who scored the goals in our last title winning game?
         * Who scored the most goals last season?
         * What is our home record against Salzburg in the last 5 games?
         * When was our last away win in the Bundesliga against Salzburg?
         * Who scored our last bicycle kick goal?
         * Who scored our last direct freekick?
         * When was the last time a Sturm player scored a clean hattrick?
         * Which game had the highest number of players sent off this season?
         * How many games has Stefan Hierländer played for Sturm in the Bundesliga?
         * What were our last 3 wins in the Champions League?
         * What is our record when Harald Lechner was referee in the last 10 games?
         * How did our last Bundesliga game against Austria Wien end?
         */


        return {
            name: scenarioName,
            targets,
            filters,
            orders,
            limit,
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
        return parts.filter(item => EnglishTokenizer.TRIGGER_WORDS.includes(item)).length >= EnglishTokenizer.THRESHOLD_APPLICABLE_WORDS;
    }

    private createResolvableParameter(name: ParameterName, value: string[]): FilterParameter {
        return {
            id: this.uuidSource.getRandom(),
            name,
            value,
            needsResolving: true,
        }
    }

    private createParameter(name: ParameterName, value: string[]): FilterParameter {
        return {
            id: this.uuidSource.getRandom(),
            name,
            value,
            needsResolving: false,
        }
    }

    private resolveScenarioName(raw: string, parts: string[]): ScenarioName {
        // TOOD implement properly
        return ScenarioName.Standard;
    }

    private resolveSubject(parts: string[]): SubjectName {
        for (let i = 0; i < parts.length; i++) {
            const element = parts[i];
            if (["we", "our", ...this.config.mainClubNames].includes(element)) {
                return SubjectName.Main;
            }
            if (["opponent"].includes(element)) {
                return SubjectName.Opponent;
            }
        }

        // default to main
        return SubjectName.Main;
    }

    private resolveTargets(raw: string, parts: string[]): Target[] {
        const targets: Target[] = [];


        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            if (EnglishTokenizer.GAME_TARGET_TRIGGERS.includes(part)) {
                targets.push(new GameTarget());
            }

            if (EnglishTokenizer.PLAYER_TARGET_TRIGGERS.includes(part)) {
                targets.push(new PlayerTarget());
            }
        }

        return targets;
    }

    private resolveLimit(parts: string[]): LimitDescriptor | undefined {
        // TODO implement
        return { limit: 1 };
    }

    private resolveFilterDescriptors(raw: string, parts: string[], subject: SubjectName): FilterDescriptor[] {
        return [
            ...this.getCompetitionDescriptors(raw, parts),
            ...this.getLocationDescriptors(parts),
            ...this.getOpponentDescriptors(parts),
            ...this.getResultTendencyDescriptors(parts),
            ...this.getSentOffDescriptors(raw, subject),
            ...this.getTimeDescriptors(raw, parts),
            ...this.getTurnaroundDescriptors(raw),
            ...this.getDerbyDescriptors(raw),
        ]
    }

    private resolveOrders(parts: string[], targets: Target[]): OrderDescriptor[] {
        for (const part of parts) {
            if (part === "last") {
                // TODO will this work? right now we just take the first target
                return [{ order: SortOrder.Descending, target: targets[0] }];
            }

            if (part === "first") {
                return [{ order: SortOrder.Ascending, target: targets[0] }];
            }
        }

        return [];
    }

    private getCompetitionDescriptors(raw: string, parts: string[]): FilterDescriptor[] {
        const descriptors: FilterDescriptor[] = [];

        ["in a", "in the"].forEach(phrase => ifPresent(raw, phrase, (match) => {
            const competitionNameParts: string[] = [];
            for (let i = match.indexOfList + phrase.split(" ").length; i < parts.length; i++) {
                const element = parts[i];
                if (EnglishTokenizer.TRIGGER_WORDS.includes(element) || ["game", "match", "derby"].includes(element)) {
                    break;
                }
                competitionNameParts.push(element);
            }

            if (competitionNameParts.length > 0) {
                descriptors.push({ name: FilterName.Competition, parameters: [this.createResolvableParameter(ParameterName.Name, competitionNameParts)] });
            }
        }));

        return descriptors;
    }

    private getDerbyDescriptors(raw: string): FilterDescriptor[] {
        const descriptors: FilterDescriptor[] = [];

        ["a derby", "the derby"].forEach(item => ifPresent(raw, item, (_ => {
            descriptors.push({ 
                name: FilterName.Derby,
                parameters: [
                    this.createParameter(ParameterName.City, [this.config.mainClubCity]),
                ]
            });
        })));

        return descriptors;
    }

    private getLocationDescriptors(parts: string[]): FilterDescriptor[] {
        for (let i = 0; i < parts.length; i++) {
            const element = parts[i];
            if (element === "home") {
                return [{ name: FilterName.Location, parameters: [this.createParameter(ParameterName.Home, [BooleanValueType.True])] }];
            } else if (element === "away") {
                return [{ name: FilterName.Location, parameters: [this.createParameter(ParameterName.Away, [BooleanValueType.True])] }];
            } else if (element === "neutral") {
                return [{ name: FilterName.Location, parameters: [this.createParameter(ParameterName.Neutral, [BooleanValueType.True])] }];
            }
        }

        return [];
    }

    private getOpponentDescriptors(parts: string[]): FilterDescriptor[] {
        const opponentFilter: FilterDescriptor = { name: FilterName.Opponent, parameters: []};

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (part === "against") {
                const opponentNameParts = [];
                // peek at next elements to get opponent name
                peekLoop: for (let j = i + 1; j < parts.length; j++) {
                    const peekElement = parts[j];
                    if (EnglishTokenizer.TRIGGER_WORDS.includes(peekElement)) {
                        // TODO if the next word is "or" we should continue peeking to support multiple opponents
                        // TODO a standard phrase could also be useful (something like: against one of)
                        break peekLoop;   
                    }

                    opponentNameParts.push(peekElement);
                }

                if (opponentNameParts.length > 0) {
                    opponentFilter.parameters.push(this.createResolvableParameter(ParameterName.Name, opponentNameParts));
                }
            }
        }

        if (opponentFilter.parameters.length === 0) {
            return [];
        }

        return [opponentFilter];
    }

    private getTimeDescriptors(raw: string, parts: string[]): FilterDescriptor[] {
        const descriptors: FilterDescriptor[] = [];

        if (raw.indexOf("first half") >= 0) {
            descriptors.push(this.createMinuteFilter("1", "HT"));
        } else if (raw.indexOf("second half") >= 0) {
            descriptors.push(this.createMinuteFilter("46", "FT"));
        } else if (raw.indexOf("extra time") >= 0) {
            descriptors.push(this.createMinuteFilter("91", "AET"));
        } else if (raw.indexOf("injury time") >= 0 || raw.indexOf("stoppage time") >= 0) {
            descriptors.push(this.createMinuteFilter("90+1", "FT"));
        } else if (raw.indexOf("minutes") >= 0) {
            const minutesIndex = parts.indexOf("minutes");
            if (minutesIndex >= 2 && !isNaN(parts[minutesIndex - 1] as any)) {
                const amountOfMinutes = parts[minutesIndex - 1];
                const timePositionIndicator = parts[minutesIndex - 2];

                if (timePositionIndicator === "first") {
                    descriptors.push(this.createMinuteFilter("1", amountOfMinutes as string));
                } else if (timePositionIndicator === "last") {
                    const start = 91 - Number(amountOfMinutes);
                    descriptors.push(this.createMinuteFilter(`${start}`, "FT"));
                } else if (timePositionIndicator === "after") {
                    const start = Number(amountOfMinutes);
                    descriptors.push(this.createMinuteFilter(`${start}`, "FT"));
                }
            }
        }

        return descriptors;
    }

    private createMinuteFilter(from: string, to: string): FilterDescriptor {
        return {
            name: FilterName.Minute,
            parameters: [
                this.createParameter(ParameterName.From, [from]),
                this.createParameter(ParameterName.To, [to]),
            ]
        };
    }

    private getResultTendencyDescriptors(parts: string[]): FilterDescriptor[] {
        const descriptors: FilterDescriptor[] = [];

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            if (part === "win" || part === "won") {
                const isNegated = i > 0 && EnglishTokenizer.NEGATION_STATEMENTS.includes(parts[i - 1]);
                descriptors.push({ name: FilterName.ResultTendency, parameters: [this.createParameter(ParameterName.Won, [isNegated ? BooleanValueType.False : BooleanValueType.True])] });
                break;
            }

            if (part === "lose" || part === "lost") {
                const isNegated = i > 0 && EnglishTokenizer.NEGATION_STATEMENTS.includes(parts[i - 1]);
                descriptors.push({ name: FilterName.ResultTendency, parameters: [this.createParameter(ParameterName.Lost, [isNegated ? BooleanValueType.False : BooleanValueType.True])] });
                break;
            }

            if (part === "draw" || part === "drawn") {
                const isNegated = i > 0 && EnglishTokenizer.NEGATION_STATEMENTS.includes(parts[i - 1]);
                descriptors.push({ name: FilterName.ResultTendency, parameters: [this.createParameter(ParameterName.Drawn, [isNegated ? BooleanValueType.False : BooleanValueType.True])] });
                break;
            }
        }

        return descriptors;
    }

    private getSentOffDescriptors(raw: string, subject: SubjectName): FilterDescriptor[] {
        const descriptors: FilterDescriptor[] = [];

        if (raw.indexOf("sent off") >= 0) {
            const subjectParameter = subject === SubjectName.Main ? ParameterName.Main : ParameterName.Opponent;
            const quantity = 1;         // TODO implement support for more detailed quantity queries
            const comparisonParameter = ParameterName.AtLeast;

            const parameters = [this.createParameter(subjectParameter, [`${quantity}`]), this.createParameter(comparisonParameter, [])];

            descriptors.push({ name: FilterName.TeamPlayerSentOff, parameters, });
            descriptors.push({ name: FilterName.PlayerSentOffGameEventFilter, parameters, });
        }

        return descriptors;
    }

    private getTurnaroundDescriptors(raw: string): FilterDescriptor[] {
        const descriptors: FilterDescriptor[] = [];

        // turnover for main
        ["after being behind", "after being down"].forEach(item => ifPresent(raw, item, (_ => {
            // TODO here we need to check whether it is actually about goals
            descriptors.push({
                name: FilterName.Turnaround,
                parameters: [
                    this.createParameter(ParameterName.Main, ["1"]),
                    this.createParameter(ParameterName.AtLeast, []),
                ],
            });
        })));

        return descriptors;
    }
    
}