import { PersonService } from "@src/module/person/service";
import { SearchEntity } from "./entities";
import { SearchResultItemDto } from "@src/model/external/dto/search-result-item";
import { isDefined } from "@src/util/common";
import { Person } from "@src/model/internal/person";
import { ClubService } from "@src/module/club/service";
import { Club } from "@src/model/internal/club";
import { normalizeForSearch } from "@src/util/search";
import { VenueService } from "@src/module/venue/service";
import { Venue } from "@src/model/internal/venue";
import { SeasonService } from "@src/module/season/service";
import { Season } from "@src/model/internal/season";
import { CompetitionService } from "@src/module/competition/service";
import { Competition } from "@src/model/internal/competition";
import { ApiConfig } from "@src/api/v1/config";
import { GameService } from "@src/module/game/service";
import { Game } from "@src/model/internal/game";

export class SearchService {

    private static DEFAULT_SEARCH_ENTITIES: SearchEntity[] = [
        SearchEntity.Club,
        SearchEntity.Competition,
        SearchEntity.Game,
        SearchEntity.Person,
        SearchEntity.Season,
        SearchEntity.Venue,
    ];

    constructor(
        private readonly apiConfig: ApiConfig,
        private readonly clubService: ClubService,
        private readonly competitionService: CompetitionService,
        private readonly gameService: GameService,
        private readonly personService: PersonService,
        private readonly seasonService: SeasonService,
        private readonly venueService: VenueService,
    ) {}

    async search(query: string, filters?: SearchEntity[]): Promise<SearchResultItemDto[]> {
        const normalizedQuery = normalizeForSearch(query);
        const normalizedParts = normalizedQuery.split(" ");

        const entities = filters !== undefined && filters.length > 0 ? filters : SearchService.DEFAULT_SEARCH_ENTITIES;

        const searchProviders = [];

        if (entities.includes(SearchEntity.Club)) {
            searchProviders.push(this.searchForClub(normalizedParts));
        }

        if (entities.includes(SearchEntity.Competition)) {
            searchProviders.push(this.searchForCompetition(normalizedParts));
        }

        if (entities.includes(SearchEntity.Game)) {
            searchProviders.push(this.searchForGame(normalizedParts));
        }

        if (entities.includes(SearchEntity.Person)) {
            searchProviders.push(this.searchForPerson(normalizedParts));
        }

        if (entities.includes(SearchEntity.Season)) {
            searchProviders.push(this.searchForSeason(normalizedParts));
        }

        if (entities.includes(SearchEntity.Venue)) {
            searchProviders.push(this.searchForVenue(normalizedParts));
        }

        const results = await Promise.all(searchProviders);
        return results.flat();
    }

    private async searchForClub(parts: string[]): Promise<SearchResultItemDto[]> {
        const clubResults = await this.clubService.search(parts);
        return clubResults.map(item => this.convertClub(item));
    }

    private async searchForCompetition(parts: string[]): Promise<SearchResultItemDto[]> {
        const competitionResults = await this.competitionService.search(parts);
        return competitionResults.map(item => this.convertCompetition(item));
    }

    private async searchForGame(parts: string[]): Promise<SearchResultItemDto[]> {
        const gameResults = await this.gameService.search(parts);
        return gameResults.map(item => this.convertGame(item));
    }

    private async searchForPerson(parts: string[]): Promise<SearchResultItemDto[]> {
        const personResults = await this.personService.search(parts);
        return personResults.map(item => this.convertPerson(item));
    }

    private async searchForSeason(parts: string[]): Promise<SearchResultItemDto[]> {
        const seasonResults = await this.seasonService.search(parts);
        return seasonResults.map(item => this.convertSeason(item));
    }

    private async searchForVenue(parts: string[]): Promise<SearchResultItemDto[]> {
        const venueResults = await this.venueService.search(parts);
        return venueResults.map(item => this.convertVenue(item));
    }

    private convertClub(item: Club): SearchResultItemDto {
        const result: SearchResultItemDto = {
            type: SearchEntity.Club,
            entityId: item.id,
            title: item.name,
        }

        if (isDefined(item.iconSmall)) {
            result.icon = this.getMediaUrl(item.iconSmall);
        }

        return result;
    }

    private convertCompetition(item: Competition): SearchResultItemDto {
        const result: SearchResultItemDto = {
            type: SearchEntity.Competition,
            entityId: item.id,
            title: item.name,
        }

        if (isDefined(item.iconSmall)) {
            result.icon = this.getMediaUrl(item.iconSmall);
        }

        return result;
    }

    private convertGame(item: Game): SearchResultItemDto {
        const result: SearchResultItemDto = {
            type: SearchEntity.Game,
            entityId: item.id,
            title: `Game`,
        }

        return result;
    }

    private convertPerson(item: Person): SearchResultItemDto {
        const result: SearchResultItemDto = {
            type: SearchEntity.Person,
            entityId: item.id,
            title: [item.firstName, item.lastName].filter(name => isDefined(name) && name.trim().length > 0).join(" "),
        }

        if (isDefined(item.avatar)) {
            result.icon = this.getMediaUrl(item.avatar);
        }

        return result;
    }

    private convertSeason(item: Season): SearchResultItemDto {
        const result: SearchResultItemDto = {
            type: SearchEntity.Season,
            entityId: item.id,
            title: item.name,
        }

        return result;
    }

    private convertVenue(item: Venue): SearchResultItemDto {
        const result: SearchResultItemDto = {
            type: SearchEntity.Venue,
            entityId: item.id,
            title: `${item.name} (${item.city})`,
        }

        return result;
    }

    private getMediaUrl(path: string): string {
        return [this.apiConfig.cdnBaseUrl, path].join("/");
    }

}