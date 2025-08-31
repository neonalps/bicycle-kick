import { AccountService } from "@src/module/account/service";
import { AdvancedQueryService } from "@src/module/advanced-query/service";
import { ApiHelperService } from "@src/module/api-helper/service";
import { OAuthService } from "@src/module/auth/oauth/service";
import { AuthService } from "@src/module/auth/service";
import { CacheService } from "@src/module/cache/service";
import { ClubService } from "@src/module/club/service";
import { CompetitionService } from "@src/module/competition/service";
import { CryptoService } from "@src/module/crypto/service";
import { DashboardService } from "@src/module/dashboard/service";
import { ExternalProviderService } from "@src/module/external-provider/service";
import { SofascoreGameImporter } from "@src/module/external-provider/sofascore/game-importer";
import { SofascoreGameProvider } from "@src/module/external-provider/sofascore/game-provider";
import { GameAttendedService } from "@src/module/game-attended/service";
import { GameEventService } from "@src/module/game-event/service";
import { GameManagerService } from "@src/module/game-manager/service";
import { GamePlayerService } from "@src/module/game-player/service";
import { GameRefereeService } from "@src/module/game-referee/service";
import { GameStarService } from "@src/module/game-star/service";
import { GameService } from "@src/module/game/service";
import { MatchdayDetailsService } from "@src/module/matchday-details/service";
import { PaginationService } from "@src/module/pagination/service";
import { PermissionService } from "@src/module/permission/service";
import { PersonService } from "@src/module/person/service";
import { SearchService } from "@src/module/search/service";
import { SeasonService } from "@src/module/season/service";
import { SquadService } from "@src/module/squad/service";
import { StatsService } from "@src/module/stats/service";
import { VenueService } from "@src/module/venue/service";
import { DateSource } from "@src/util/date";
import { TimeSource } from "@src/util/time";
import { UuidSource } from "@src/util/uuid";

export interface ApplicationServices {
    accountService: AccountService,
    advancedQueryService: AdvancedQueryService,
    apiHelperService: ApiHelperService,
    authService: AuthService,
    cacheService: CacheService,
    clubService: ClubService,
    competitionService: CompetitionService,
    cryptoService: CryptoService,
    dashboardService: DashboardService,
    dateSource: DateSource,
    externalProviderService: ExternalProviderService,
    gameService: GameService,
    gameAttendedService: GameAttendedService,
    gameEventService: GameEventService,
    gameManagerService: GameManagerService,
    gamePlayerService: GamePlayerService,
    gameRefereeService: GameRefereeService,
    gameStarService: GameStarService,
    matchdayDetailsService: MatchdayDetailsService,
    oAuthService: OAuthService,
    paginationService: PaginationService,
    permissionService: PermissionService,
    personService: PersonService,
    searchService: SearchService,
    seasonService: SeasonService,
    sofascoreGameImporter: SofascoreGameImporter,
    sofascoreGameProvider: SofascoreGameProvider,
    statsService: StatsService,
    squadService: SquadService,
    timeSource: TimeSource,
    uuidSource: UuidSource,
    venueService: VenueService,
}