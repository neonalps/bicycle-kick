import { Tokenizer, TokenizerResult } from "@src/module/advanced-query/tokenizer/tokenizer";
import { ScenarioDescriptor } from "@src/module/advanced-query/scenario/descriptor";
import { FilterName, ScenarioName } from "@src/module/advanced-query/scenario/constants";
import { IdResolver } from "@src/module/advanced-query/id-resolver/base";
import { ClarificationQuery, ClarificationQueryItem } from "@src/module/advanced-query/clarification/query";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { Scenario } from "@src/module/advanced-query/scenario/base";
import { GoalsScoredByPlayerScenario } from "@src/module/advanced-query/scenario/goals-scored-by-player";
import { Filter } from "@src/module/advanced-query/filter/base";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { getOrThrow } from "@src/util/common";
import { createEmptyQueryContext } from "@src/module/advanced-query/scenario/helper";
import { convertContextToSql } from "@src/module/advanced-query/helper";
import { UuidSource } from "@src/util/uuid";
import { StandardScenario } from "@src/module/advanced-query/scenario/standard";
import { OrderModifier } from "@src/module/advanced-query/order/modifier";
import { LimitModifier } from "@src/module/advanced-query/limit/modifier";
import { GameEvent } from "@src/model/internal/game-event";
import { GameEventPostProcessingFilter } from "@src/module/advanced-query/post-processor/game-event-processing-filter";
import { Sql } from "@src/db";
import { GameService } from "@src/module/game/service";
import { Game } from "@src/model/internal/game";
import { AdvancedQueryResult } from "@src/module/advanced-query/result";
import { Answer, AnswerComposer } from "./answer/composer";

export interface AdvancedQueryConfig {
    mainClubId: number;
    mainClubCity: string;
    mainClubNames: string[];
    enabledTokenizers: Tokenizer[];
    enabledComposers: AnswerComposer[];
    batchSize: number;
}

export class AdvancedQueryService {

    constructor(
        private readonly config: AdvancedQueryConfig, 
        private readonly idResolvers: Map<FilterName, IdResolver>,
        private readonly filterProviders: Map<FilterName, FilterProvider<unknown>>,
        private readonly gameService: GameService,
        private readonly sql: Sql,
        private readonly uuidSource: UuidSource,
    ) {}

    async search(raw: string): Promise<ClarificationQuery | AdvancedQueryResult> {
        // TODO input validation

        // strip punctuation from input
        const sanitizedInput = raw
            .replaceAll('.', '')
            .replaceAll('!', '')
            .replaceAll('?', '')
            .replaceAll('\n', '')
            .toLocaleLowerCase();

        // stage 1: get scenario descriptor
        const tokenizerResult = await this.getTokenizerResult(sanitizedInput);
        const descriptor = tokenizerResult.descriptor;

        console.log(descriptor.filters.map(filter => filter.name));

        // stage 2: resolve filters
        await this.resolveFilters(descriptor);

        // stage 3: check if any filters returned ambiguous possibilities
        const clarificationQuery = this.getClarificationQuery(descriptor);
        if (clarificationQuery !== null) {
            // TODO we need to store the scenario descriptor here to continue processing it later

            return clarificationQuery;
        }

        // stage 4: get all query modifiers and apply them to build the query context
        const context = createEmptyQueryContext();
        const queryModifiers = [
            ...descriptor.targets,
            ...this.getQueryModifiers(descriptor, this.config.batchSize),
        ];
        for (const modifier of queryModifiers) {
            modifier.apply(context);
        }

        // stage 5: execute SQL query
        const sqlQuery = convertContextToSql(context);
        console.log(sqlQuery);
        const queryResult = await this.sql.unsafe(sqlQuery);

        // get all game ids
        const targetParameterNames = descriptor.targets.map(target => target.getResultParameterName());
        const resultMap = new Map<string, number[]>();
        for (const name of targetParameterNames) {
            resultMap.set(name, []);
        }
        queryResult.forEach(item => {
            for (const name of targetParameterNames) {
                resultMap.get(name)?.push(item[name]);
            }
        })

        console.log(`queryResult`, queryResult);
        console.log('resultMap', resultMap);

        const orderedGames = await this.resolveOrderedGameIds(resultMap.get('gameId') as number[]);

        // returns game ids (batched to 50)
        // load game events for all ids
        // process, exit early if match is found (compare with descriptor limit)
        // if has not been reached and cursor has next, request next page

        // stage 6: apply post-processors to result
        /*const gameEvents: GameEvent[] = [
            { id: 1, eventType: GameEventType.VarDecision, minute: "7", sortOrder: 1, },
            { id: 2, eventType: GameEventType.RedCard, minute: "7", sortOrder: 2, },
        ];*/

        // TODO we need a way to determine whether a "qualified" filter is present (i.e. the minute filter is present)
        // otherwise we should not invoke it at all

        /*const postProcessingFilters = queryModifiers
            .filter(filter => isPostProcessingFilter(filter)) as GameEventPostProcessingFilter[];

        const checkResult = this.check(gameEvents, postProcessingFilters);
        console.log(`checkResult is ${checkResult}`);*/

        // compose answer
        const answer = await this.getAnswerComposerResult();

        // stage 7: return
        return {
            games: orderedGames,
            query: sqlQuery,
            answer: answer,
        }
        
    }

    private check(gameEvents: GameEvent[], filters: GameEventPostProcessingFilter[]): boolean {
        if (filters.length === 0) {
            return true;
        }

        for (const event of gameEvents) {
            if (filters.every(filter => filter.process(event))) {
                return true;
            }
        }

        return false;
    }

    private async resolveOrderedGameIds(orderedGameIds: number[]): Promise<Game[]> {
        if (orderedGameIds.length === 0) {
            return [];
        }

        const games = await this.gameService.getMultipleByIds(orderedGameIds);
        return orderedGameIds.map(gameId => games.find(item => item.id === gameId) as Game);
    }

    private async getTokenizerResult(input: string): Promise<TokenizerResult> {
        for (const tokenizer of this.config.enabledTokenizers) {
            const descriptor = await tokenizer.tokenize(input);
            if (descriptor !== null) {
                return {
                    id: this.uuidSource.getRandom(),
                    language: tokenizer.getLanguage(),
                    descriptor,
                };
            }
        }

        throw new Error("No tokenizer returned a result");
    }

    private async getAnswerComposerResult(): Promise<Answer> {
        for (const composer of this.config.enabledComposers) {
            const answer = composer.answer();
            if (answer !== null) {
                return answer;
            }
        }

        throw new Error("No composer returned an answer");
    }

    private async resolveFilters(descriptor: ScenarioDescriptor): Promise<void> {
        await Promise.all(descriptor.filters.filter(filter => filter.parameters.some(parameter => parameter.needsResolving === true && filter.resolveResults === undefined)).map(filter => this.resolveSingleFilter(filter)));
    }

    private async resolveSingleFilter(descriptor: FilterDescriptor): Promise<void> {
        const resolver = this.idResolvers.get(descriptor.name);
        if (resolver === undefined) {
            throw new Error(`No ID resolver available for ${descriptor.name}`);
        }
        descriptor.resolveResults = await resolver.resolve(descriptor.parameters);
    }

    private getClarificationQuery(descriptor: ScenarioDescriptor): ClarificationQuery | null {
        const required: ClarificationQueryItem[] = [];

        for (const filterDescriptor of descriptor.filters) {
            if (filterDescriptor.resolveResults === undefined) {
                continue;
            }

            for (const resolveResult of filterDescriptor.resolveResults) {
                if (resolveResult.resolved !== undefined || resolveResult.possibilities === undefined || resolveResult.possibilities.length < 1) {
                    continue;
                }

                const originalParameter = filterDescriptor.parameters.find(param => param.id === resolveResult.forId);
                if (originalParameter === undefined) {
                    throw new Error(`Something went wrong while fetching the original filter parameter`);
                }

                required.push({
                    parameter: {
                        id: originalParameter.id,
                        value: originalParameter.value,
                    },
                    possibilities: resolveResult.possibilities,
                });
            }
        }

        if (required.length === 0) {
            return null;
        }

        return { required };
    }

    private getQueryModifiers(descriptor: ScenarioDescriptor, batchSize: number): Filter[] {
        const scenario = this.getScenario(descriptor.name);

        const filters = descriptor.filters.map(filter => getOrThrow<FilterProvider<unknown>>(this.filterProviders, filter.name, `Could not find filter provider for filter name ${filter.name}`).provide(filter) as Filter);

        const orders = descriptor.orders.map(order => new OrderModifier(order));

        const limit = new LimitModifier(batchSize);

        return [
            ...scenario.getModifiers(),
            ...filters,
            ...orders,
            limit,
        ];
    }

    private getScenario(name: ScenarioName): Scenario {
        switch (name) {
            case ScenarioName.Standard:
                return new StandardScenario();
            case ScenarioName.GoalsScoredByPlayer:
                return new GoalsScoredByPlayerScenario();
            default:
                throw new Error(`No scenario found for name ${name}`);
        }
    }

}