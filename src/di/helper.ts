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
import { PersonIdResolver } from "@src/module/advanced-query/id-resolver/person";
import { PersonService } from "@src/module/person/service";
import { PlayerFilterProvider } from "@src/module/advanced-query/provider/player";
import { ClubService } from "@src/module/club/service";
import { ClubIdResolver } from "@src/module/advanced-query/id-resolver/club";
import { OpponentFilterProvider } from "@src/module/advanced-query/provider/opponent";
import { VenueIdResolver } from "@src/module/advanced-query/id-resolver/venue";
import { VenueService } from "@src/module/venue/service";
import { SoldOutFilterProvider } from "@src/module/advanced-query/provider/sold-out";
import { GoalDifferenceFilterProvider } from "@src/module/advanced-query/provider/goal-difference";
import { ResultTendencyFilterProvider } from "@src/module/advanced-query/provider/result-tendency";
import { SeasonService } from "@src/module/season/service";
import { SeasonIdResolver } from "@src/module/advanced-query/id-resolver/season";
import { SeasonFilterProvider } from "@src/module/advanced-query/provider/season";
import { TurnaroundFilterProvider } from "@src/module/advanced-query/provider/turnaround";
import { TeamPlayerSentOffFilterProvider } from "@src/module/advanced-query/provider/team-player-sent-off";
import { RefereeFilterProvider } from "@src/module/advanced-query/provider/referee";
import { TeamPenaltyConcededFilterProvider } from "@src/module/advanced-query/provider/team-penalty-conceded";
import { PlayerPenaltyMissedFilterProvider } from "@src/module/advanced-query/provider/player-penalty-missed";
import { TablePositionAfterFilterProvider } from "@src/module/advanced-query/provider/table-position-after";
import { DerbyFilterProvider } from "@src/module/advanced-query/provider/derby";
import { UuidSource } from "@src/util/uuid";
import { LocationFilterProvider } from "@src/module/advanced-query/provider/location";
import { MinuteFilterProvider } from "@src/module/advanced-query/provider/minute";
import { PlayerSentOffGameEventFilterProvider } from "@src/module/advanced-query/provider/player-sent-off-game-event";
import { PlayerGoalScoredFilterProvider } from "@src/module/advanced-query/provider/player-goal-scored";
import { GlobalResolveService, GlobalResolveServiceConfig } from "@src/module/advanced-query/global-resolver/service";

export class DependencyHelper {

    private constructor() {}

    public static initDependencies(): void {
        dependencyManager.registerAll(this.getDependencies());
    }

    private static getDependencies(): Map<Dependencies, any> {

        const uuidSource = new UuidSource();

        const clubService = new ClubService();
        const competitionService = new CompetitionService();
        const personService = new PersonService();
        const seasonService = new SeasonService();
        const venueService = new VenueService();

        const advancedQueryConfig: AdvancedQueryConfig = {
            mainClubId: 1,
            mainClubCity: "Graz",
            mainClubNames: ["Sturm", "Blackies"],
            enabledTokenizers: [],
            batchSize: 50,
        };

        const globalResolveConfig: GlobalResolveServiceConfig = {

        };

        const globalResolveService = new GlobalResolveService(globalResolveConfig, clubService, competitionService, personService);

        const englishTokenizer = new EnglishTokenizer(advancedQueryConfig, globalResolveService, uuidSource);
        advancedQueryConfig.enabledTokenizers.push(englishTokenizer);

        const personIdResolver = new PersonIdResolver(personService);
        const idResolvers: Map<FilterName, IdResolver> = new Map();
        idResolvers.set(FilterName.Competition, new CompetitionIdResolver(competitionService));
        idResolvers.set(FilterName.Opponent, new ClubIdResolver(clubService));
        idResolvers.set(FilterName.Player, personIdResolver);
        idResolvers.set(FilterName.Referee, personIdResolver);
        idResolvers.set(FilterName.Season, new SeasonIdResolver(seasonService));
        idResolvers.set(FilterName.Venue, new VenueIdResolver(venueService));

        const filterProviders: Map<FilterName, FilterProvider<unknown>> = new Map();
        filterProviders.set(FilterName.TeamPlayerSentOff, new TeamPlayerSentOffFilterProvider());
        filterProviders.set(FilterName.Competition, new CompetitionFilterProvider());
        filterProviders.set(FilterName.Derby, new DerbyFilterProvider());
        filterProviders.set(FilterName.GoalDifference, new GoalDifferenceFilterProvider());
        filterProviders.set(FilterName.Location, new LocationFilterProvider());
        filterProviders.set(FilterName.Minute, new MinuteFilterProvider());
        filterProviders.set(FilterName.Opponent, new OpponentFilterProvider());
        filterProviders.set(FilterName.Player, new PlayerFilterProvider());
        filterProviders.set(FilterName.PlayerGoalScored, new PlayerGoalScoredFilterProvider());
        filterProviders.set(FilterName.PlayerPenaltyMissed, new PlayerPenaltyMissedFilterProvider());
        filterProviders.set(FilterName.Referee, new RefereeFilterProvider());
        filterProviders.set(FilterName.ResultTendency, new ResultTendencyFilterProvider());
        filterProviders.set(FilterName.Season, new SeasonFilterProvider());
        filterProviders.set(FilterName.SoldOut, new SoldOutFilterProvider());
        filterProviders.set(FilterName.PlayerSentOffGameEventFilter, new PlayerSentOffGameEventFilterProvider());
        filterProviders.set(FilterName.TablePositionAfter, new TablePositionAfterFilterProvider());
        filterProviders.set(FilterName.TeamPenaltyConceded, new TeamPenaltyConcededFilterProvider());
        filterProviders.set(FilterName.Turnaround, new TurnaroundFilterProvider());

        const advancedQueryService = new AdvancedQueryService(advancedQueryConfig, idResolvers, filterProviders, uuidSource);

        const dependencies: Map<Dependencies, any> = new Map();
        
        dependencies.set(Dependencies.AdvancedQueryService, advancedQueryService);
        dependencies.set(Dependencies.ClubService, clubService);
        dependencies.set(Dependencies.CompetitionService, competitionService);
        dependencies.set(Dependencies.PersonService, personService);
        dependencies.set(Dependencies.VenueService, venueService);

        return dependencies;
    }

}