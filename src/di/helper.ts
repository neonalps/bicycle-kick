import { AdvancedQueryConfig, AdvancedQueryService } from "@src/module/advanced-query/service";
import { Dependencies } from "./dependencies";
import dependencyManager from "./manager";
import { CompetitionService } from "@src/module/competition/service";
import { EnglishTokenizer } from "@src/module/advanced-query/tokenizer/tokenizer-en";
import { IdResolver } from "@src/module/advanced-query/id-resolver/base";
import { FilterName } from "@src/module/advanced-query/scenario/constants";
import { FilterProvider } from "@src/module/advanced-query/provider/base";
import { CompetitionIdResolver } from "@src/module/advanced-query/id-resolver/competition";
import { CompetitionFilterProvider } from "@src/module/advanced-query/provider/competition";

export class DependencyHelper {

    private constructor() {}

    public static initDependencies(): void {
        dependencyManager.registerAll(this.getDependencies());
    }

    private static getDependencies(): Map<Dependencies, any> {

        const competitionService = new CompetitionService();

        const englishTokenizer = new EnglishTokenizer();

        const config: AdvancedQueryConfig = {
            mainClubId: 1,
            enabledTokenizers: [englishTokenizer],
        };

        const idResolvers: Map<FilterName, IdResolver> = new Map();
        idResolvers.set(FilterName.Competition, new CompetitionIdResolver(competitionService));

        const filterProviders: Map<FilterName, FilterProvider<unknown>> = new Map();
        filterProviders.set(FilterName.Competition, new CompetitionFilterProvider());

        const advancedQueryService = new AdvancedQueryService(config, idResolvers, filterProviders);

        const dependencies: Map<Dependencies, any> = new Map();
        
        dependencies.set(Dependencies.AdvancedQueryService, advancedQueryService);

        return dependencies;
    }

}