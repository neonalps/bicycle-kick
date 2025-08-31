import { AdvancedQueryConfig, AdvancedQueryService } from "@src/module/advanced-query/service";
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
import { getAuthTokenConfig, getCdnBaseUrl, getCryptoKey, getFrontendBaseUrl, getGoogleOAuthConfig, getSofascoreMainClubId } from "@src/config";
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
import { PermissionService } from "@src/module/permission/service";
import { GameRefereeMapper } from "@src/module/game-referee/mapper";
import { GameRefereeService } from "@src/module/game-referee/service";
import { GameManagerMapper } from "@src/module/game-manager/mapper";
import { GameManagerService } from "@src/module/game-manager/service";
import { GameStarMapper } from "@src/module/game-star/mapper";
import { GameStarService } from "@src/module/game-star/service";
import { GameAttendedMapper } from "@src/module/game-attended/mapper";
import { GameAttendedService } from "@src/module/game-attended/service";
import { CacheService } from "@src/module/cache/service";
import { SearchService } from "@src/module/search/service";
import { StatsService } from "@src/module/stats/service";
import { StatsMapper } from "@src/module/stats/mapper";
import { DashboardService } from "@src/module/dashboard/service";
import { GermanAnswerComposer } from "@src/module/advanced-query/answer/composer-de";
import { WeltfussballClient } from "@src/module/external-provider/weltfussball/client";
import { ExternalProviderMapper } from "@src/module/external-provider/mapper";
import { ExternalProviderService } from "@src/module/external-provider/service";
import { MatchdayDetailsService } from "@src/module/matchday-details/service";
import { BundesligaClient } from "@src/module/external-provider/bundesliga/client";
import { ExternalProvider } from "@src/model/type/external-provider";
import { MatchdayDetailsProvider } from "@src/module/matchday-details/provider";
import { SofascoreGameImporter } from "@src/module/external-provider/sofascore/game-importer";
import { ApplicationServices } from "./services";

export class DependencyManager {

    private readonly applicationServices: ApplicationServices;

    constructor() {
        this.applicationServices = this.initializeApplicationServices();
    }

    getServices(): ApplicationServices {
        return this.applicationServices;
    }

    private initializeApplicationServices(): ApplicationServices {

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
        const accountService = new AccountService(accountMapper, uuidSource);
        const cacheService = new CacheService();
        const clubMapper = new ClubMapper(sqlInstance);
        const clubService = new ClubService(clubMapper);
        const competitionMapper = new CompetitionMapper(sqlInstance);
        const competitionService = new CompetitionService(competitionMapper);
        const gameAttendedMapper = new GameAttendedMapper(sqlInstance);
        const gameAttendedService = new GameAttendedService(gameAttendedMapper);
        const gameEventMapper = new GameEventMapper(sqlInstance);
        const gameEventService = new GameEventService(gameEventMapper);
        const gameManagerMapper = new GameManagerMapper(sqlInstance);
        const gameManagerService = new GameManagerService(gameManagerMapper);
        const gamePlayerMapper = new GamePlayerMapper(sqlInstance, competitionService);
        const gamePlayerService = new GamePlayerService(gamePlayerMapper);
        const gameRefereeMapper = new GameRefereeMapper(sqlInstance);
        const gameRefereeService = new GameRefereeService(gameRefereeMapper);
        const gameStarMapper = new GameStarMapper(sqlInstance);
        const gameStarService = new GameStarService(gameStarMapper);
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
            cdnBaseUrl: getCdnBaseUrl(),
            baseUrl: getFrontendBaseUrl(),
        };

        const apiHelperService = new ApiHelperService(
            apiConfig, 
            clubService, 
            competitionService, 
            gameService, 
            gameAttendedService,
            gameEventService, 
            gameManagerService,
            gamePlayerService, 
            gameRefereeService,
            gameStarService,
            personService, 
            seasonService, 
            venueService
        );

        const searchService = new SearchService(apiConfig, clubService, competitionService, gameService, personService, seasonService, venueService);

        const paginationService = new PaginationService(base64Utils);
        const permissionService = new PermissionService();

        const sofascoreGameProvider = new SofascoreGameProvider({ mainTeamName: ["Sturm Graz"] }, timeSource);
        const sofascoreGameImporter = new SofascoreGameImporter(getSofascoreMainClubId(), sofascoreGameProvider, timeSource);

        const statsMapper = new StatsMapper(sqlInstance);
        const statsService = new StatsService(statsMapper, clubService, competitionService, seasonService);

        const dashboardService = new DashboardService(competitionService, dateSource, gameService, personService, seasonService, statsService);

        const advancedQueryConfig: AdvancedQueryConfig = {
            mainClubId: 1,
            mainClubCity: "Graz",
            mainClubNames: ["Sturm", "Blackies"],
            enabledTokenizers: [],
            enabledComposers: [],
            batchSize: 50,
        };

        const externalProviderMapper = new ExternalProviderMapper(sqlInstance);
        const externalProviderService = new ExternalProviderService(externalProviderMapper, personService);

        const matchdayProviders = new Map<ExternalProvider, MatchdayDetailsProvider>([
            [ExternalProvider.Bundesliga, new BundesligaClient(httpClient)],
            [ExternalProvider.Weltfussball, new WeltfussballClient(httpClient)],
        ]);

        const matchdayDetailsService = new MatchdayDetailsService({ mainClubId: 1, clients: matchdayProviders }, clubService, competitionService, gameService, externalProviderService, seasonService);

        const globalResolveConfig: GlobalResolveServiceConfig = {

        };

        const globalResolveService = new GlobalResolveService(globalResolveConfig, clubService, competitionService, personService);

        const englishTokenizer = new EnglishTokenizer(advancedQueryConfig, globalResolveService, uuidSource);
        advancedQueryConfig.enabledTokenizers.push(englishTokenizer);

        const germanAnswerComposer = new GermanAnswerComposer();
        advancedQueryConfig.enabledComposers.push(germanAnswerComposer);

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

        return {
            accountService: accountService,
            advancedQueryService: advancedQueryService,
            apiHelperService: apiHelperService,
            authService: authService,
            cacheService: cacheService,
            clubService: clubService,
            competitionService: competitionService,
            cryptoService: cryptoService,
            dashboardService: dashboardService,
            dateSource: dateSource,
            externalProviderService: externalProviderService,
            gameService: gameService,
            gameAttendedService: gameAttendedService,
            gameEventService: gameEventService,
            gameManagerService: gameManagerService,
            gamePlayerService: gamePlayerService,
            gameRefereeService: gameRefereeService,
            gameStarService: gameStarService,
            matchdayDetailsService: matchdayDetailsService,
            oAuthService: oAuthService,
            paginationService: paginationService,
            permissionService: permissionService,
            personService: personService,
            searchService: searchService,
            seasonService: seasonService,
            sofascoreGameImporter: sofascoreGameImporter,
            sofascoreGameProvider: sofascoreGameProvider,
            statsService: statsService,
            squadService: squadService,
            timeSource: timeSource,
            uuidSource: uuidSource,
            venueService: venueService,
        }
    }

}