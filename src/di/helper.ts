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
import sql from "@src/db";
import { GameService } from "@src/module/game/service";
import { GameMapper } from "@src/module/game/mapper";
import { GameEventMapper } from "@src/module/game-event/mapper";
import { GameEventService } from "@src/module/game-event/service";
import { GamePlayerMapper } from "@src/module/game-player/mapper";
import { GamePlayerService } from "@src/module/game-player/service";
import { ApiHelperService } from "@src/module/api-helper/service";
import { CompetitionMapper } from "@src/module/competition/mapper";
import { VenueMapper } from "@src/module/venue/mapper";
import { ClubMapper } from "@src/module/club/mapper";
import { PersonMapper } from "@src/module/person/mapper";
import { SeasonMapper } from "@src/module/season/mapper";
import { DateSource } from "@src/util/date";
import { ApiConfig } from "@src/api/v1/config";
import { getAuthTokenConfig, getCryptoKey, getFrontendBaseUrl, getGoogleOAuthConfig } from "@src/config";
import { CryptoService } from "@src/module/crypto/service";
import { AccountService } from "@src/module/account/service";
import { AccountMapper } from "@src/module/account/mapper";
import { TimeSource } from "@src/util/time";
import { AuthService } from "@src/module/auth/service";
import { HttpClient } from "@src/http/client";
import { OAuthService } from "@src/module/auth/oauth/service";
import { GoogleOAuthClient } from "@src/module/auth/oauth/google/client";
import { PaginationService } from "@src/module/pagination/service";
import { Base64Utils } from "@src/util/base64";
import { SquadMapper } from "@src/module/squad/mapper";
import { SquadService } from "@src/module/squad/service";
import { SofascoreGameProvider } from "@src/module/external-provider/sofascore/game-provider";

export class DependencyHelper {

    private constructor() {}

    public static initDependencies(): void {
        dependencyManager.registerAll(this.getDependencies());
    }

    private static getDependencies(): Map<Dependencies, any> {

        const sqlInstance = sql;

        const cryptoService = new CryptoService({
            encryptionAlgorithm: "aes256",
            hmacAlgorithm: "sha256",
            ivSize: 16,
            cryptoKey: getCryptoKey(),
        });

        const base64Utils = new Base64Utils();
        const dateSource = new DateSource();
        const timeSource = new TimeSource();
        const uuidSource = new UuidSource();

        const httpClient = new HttpClient();

        const authService = new AuthService(getAuthTokenConfig(), timeSource);

        const googleOAuthClient = new GoogleOAuthClient(getGoogleOAuthConfig(), httpClient);

        const accountMapper = new AccountMapper(sqlInstance);
        const accountService = new AccountService(accountMapper, cryptoService, uuidSource);
        const clubMapper = new ClubMapper(sqlInstance);
        const clubService = new ClubService(clubMapper);
        const competitionMapper = new CompetitionMapper(sqlInstance);
        const competitionService = new CompetitionService(competitionMapper);
        const gameEventMapper = new GameEventMapper(sqlInstance);
        const gameEventService = new GameEventService(gameEventMapper);
        const gamePlayerMapper = new GamePlayerMapper(sqlInstance);
        const gamePlayerService = new GamePlayerService(gamePlayerMapper);
        const oAuthService = new OAuthService(accountService, authService, googleOAuthClient);
        const personMapper = new PersonMapper(sqlInstance);
        const personService = new PersonService(personMapper);
        const seasonMapper = new SeasonMapper(sqlInstance);
        const seasonService = new SeasonService(dateSource, seasonMapper);
        const squadMapper = new SquadMapper(sqlInstance);
        const squadService = new SquadService(squadMapper, seasonService);
        const venueMapper = new VenueMapper(sqlInstance);
        const venueService = new VenueService(venueMapper);
        const gameMapper = new GameMapper(sqlInstance, clubMapper, competitionMapper, personMapper, venueMapper);
        const gameService = new GameService(gameMapper, seasonService);

        const apiConfig: ApiConfig = {
            baseUrl: getFrontendBaseUrl(),
        };

        const apiHelperService = new ApiHelperService(
            apiConfig, 
            clubService, 
            competitionService, 
            gameService, 
            gameEventService, 
            gamePlayerService, 
            personService, 
            seasonService, 
            venueService
        );

        const paginationService = new PaginationService(base64Utils);

        const sofascoreGameProvider = new SofascoreGameProvider({ mainTeamName: ["Sturm Graz"] }, timeSource);

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

        const advancedQueryService = new AdvancedQueryService(advancedQueryConfig, idResolvers, filterProviders, gameService, sqlInstance, uuidSource);

        const dependencies: Map<Dependencies, any> = new Map();
        
        dependencies.set(Dependencies.AccountService, accountService);
        dependencies.set(Dependencies.AdvancedQueryService, advancedQueryService);
        dependencies.set(Dependencies.ApiHelperService, apiHelperService);
        dependencies.set(Dependencies.AuthService, authService);
        dependencies.set(Dependencies.ClubService, clubService);
        dependencies.set(Dependencies.CompetitionService, competitionService);
        dependencies.set(Dependencies.CryptoService, cryptoService);
        dependencies.set(Dependencies.DateSource, dateSource);
        dependencies.set(Dependencies.GameService, gameService);
        dependencies.set(Dependencies.GameEventService, gameEventService);
        dependencies.set(Dependencies.GamePlayerService, gamePlayerService);
        dependencies.set(Dependencies.OAuthService, oAuthService);
        dependencies.set(Dependencies.PaginationService, paginationService);
        dependencies.set(Dependencies.PersonService, personService);
        dependencies.set(Dependencies.SeasonService, seasonService);
        dependencies.set(Dependencies.SofascoreGameProvider, sofascoreGameProvider);
        dependencies.set(Dependencies.SquadService, squadService);
        dependencies.set(Dependencies.TimeSource, timeSource);
        dependencies.set(Dependencies.UuidSource, uuidSource);
        dependencies.set(Dependencies.VenueService, venueService);

        return dependencies;
    }

}