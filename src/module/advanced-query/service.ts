import { Tokenizer } from "@src/module/advanced-query/tokenizer/tokenizer";
import { ScenarioDescriptor } from "@src/module/advanced-query/scenario/descriptor";
import { FilterName, ScenarioName } from "@src/module/advanced-query/scenario/constants";
import { IdResolver } from "@src/module/advanced-query/id-resolver/base";
import { ClarificationQuery, ClarificationQueryItem } from "@src/module/advanced-query/clarification/query";
import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";
import { Scenario } from "@src/module/advanced-query/scenario/base";
import { GoalsScoredByPlayerScenario } from "@src/module/advanced-query/scenario/goals-scored-by-player";
import { Modifier } from "@src/module/advanced-query/filter/base";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { getOrThrow } from "@src/util/common";
import { createEmptyQueryContext } from "@src/module/advanced-query/scenario/helper";
import { convertContextToSql } from "@src/module/advanced-query/helper";

export interface AdvancedQueryConfig {
    mainClubId: number;
    enabledTokenizers: Tokenizer[];
}

export class AdvancedQueryService {

    constructor(
        private readonly config: AdvancedQueryConfig, 
        private readonly idResolvers: Map<FilterName, IdResolver>,
        private readonly filterProviders: Map<FilterName, FilterProvider<unknown>>,
    ) {}

    async search(raw: string): Promise<ClarificationQuery | string> {
        // TODO input validation

        // strip punctuation from input
        const sanitizedInput = raw
            .replaceAll('.', '')
            .replaceAll('!', '')
            .replaceAll('?', '')
            .replaceAll('\n', '')
            .toLocaleLowerCase();

        // stage 1: get scenario descriptor
        const descriptor = this.getScenarioDescriptor(sanitizedInput);

        // stage 2: resolve filters
        await this.resolveFilters(descriptor);

        // stage 3: check if any filters returned ambiguous possibilities
        const clarificationQuery = this.getClarificationQuery(descriptor);
        if (clarificationQuery !== null) {
            // TODO we need to store the scenario descriptor here to continue processing it later

            return clarificationQuery;
        }

        // stage 4: get all  query modifiers and apply them to build the query context
        const context = createEmptyQueryContext();
        const queryModifiers = this.getQueryModifiers(descriptor);
        for (const modifier of queryModifiers) {
            modifier.apply(context);
        }

        return convertContextToSql(context);

        // stage 5: execute SQL query

        // stage 6: apply post-processors to result

        // stage 7: return
    }

    private getScenarioDescriptor(input: string): ScenarioDescriptor {
        for (const tokenizer of this.config.enabledTokenizers) {
            const descriptor = tokenizer.tokenize(input);
            if (descriptor !== null) {
                return descriptor;
            }
        }

        throw new Error("No tokenizer returned a result");
    }

    private async resolveFilters(descriptor: ScenarioDescriptor): Promise<void> {
        await Promise.all(descriptor.filters.filter(filter => filter.parameters.some(parameter => parameter.needsResolving === true)).map(filter => this.resolveSingleFilter(filter)));
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

    private getQueryModifiers(descriptor: ScenarioDescriptor): Modifier[] {
        const scenario = this.getScenario(descriptor.name);

        const filters = descriptor.filters.map(filter => getOrThrow<FilterProvider<unknown>>(this.filterProviders, filter.name, `Could not find filter provider for filter name ${filter.name}`).provide(filter) as Modifier);

        return [
            ...scenario.getModifiers(),
            ...filters,
        ];
    }

    private getScenario(name: ScenarioName): Scenario {
        switch (name) {
            case ScenarioName.GoalsScoredByPlayer:
                return new GoalsScoredByPlayerScenario();
            default:
                throw new Error(`No scenario found for name ${name}`);
        }
    }

}