import { Competition } from "@src/model/internal/competition";
import { validateNotNull } from "@src/util/validation";
import { CompetitionMapper } from "./mapper";
import { CompetitionId } from "@src/util/domain-types";
import { isNotDefined } from "@src/util/common";
import { PaginationParams } from "@src/module/pagination/constants";

export interface GetAllCompetitionsPaginationParams extends PaginationParams<number> {}

export class CompetitionService {

    constructor(private readonly mapper: CompetitionMapper) {}

    async getById(id: CompetitionId): Promise<Competition | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async requireById(id: CompetitionId): Promise<Competition> {
        const competition = await this.getById(id);
        if (competition === null) {
            throw new Error(`No competition with ID ${id} exists`);
        }
        return competition;
    }

    async getAllPaginated(paginationParams: GetAllCompetitionsPaginationParams): Promise<Array<Competition>> {
        validateNotNull(paginationParams, "paginationParams");
        validateNotNull(paginationParams.lastSeen, "paginationParams.lastSeen");
        validateNotNull(paginationParams.limit, "paginationParams.limit");
        validateNotNull(paginationParams.order, "paginaationParams.order");

        return await this.mapper.getAllPaginated(paginationParams);
    }

    async getMapByIds(ids: CompetitionId[]): Promise<Map<CompetitionId, Competition>> {
        validateNotNull(ids, "ids");
        if (ids.length === 0) {
            return new Map();
        }

        return await this.mapper.getMapByIds(ids);
    }

    async search(parts: string[]): Promise<Competition[]> {
        validateNotNull(parts, "parts");

        return await this.mapper.search(parts);
    }

    async getAllInMap(): Promise<Map<CompetitionId, Competition>> {
        return await this.mapper.getAllInMap();
    }

    async getChildCompetitions(competitionId: CompetitionId, combineStatisticsWithParent?: boolean): Promise<Competition[]> {
        validateNotNull(competitionId, "competitionId");

        return await this.mapper.getChildCompetitions(competitionId, combineStatisticsWithParent);
    }

    /**
     * Returns all child competitions of an array of competition IDs that have the combineStatisticsWithParent flag.
     */
    async getEffectiveCompetitionIds(competitionIds?: CompetitionId[]): Promise<ReadonlyArray<CompetitionId>> {
        if (isNotDefined(competitionIds) || competitionIds.length === 0) {
            return [];
        }

        const result = new Set<CompetitionId>();
        for (const competitionId of competitionIds) {
            // add the competition id itself
            result.add(competitionId);

            const childCompetitions = await this.getChildCompetitions(competitionId);
            childCompetitions
                .filter(item => item.combineStatisticsWithParent === true)
                .map(item => item.id)
                .forEach(competitionId => result.add(competitionId));
        }

        return Array.from(result);
    }

    /**
     * Checks whether the passed competition has a parent and will return that and all of its children that have the combineStatisticsWithParent flag.
     * Example: For Bundesliga Meisterrunde it will also include Bundesliga and Europa League / Conference League Playoff.
     */
    async getRelevantCompetitionIds(competitionId: CompetitionId): Promise<ReadonlyArray<CompetitionId>> {
        validateNotNull(competitionId, "competitionId");

        const competition = await this.requireById(competitionId);

        const result = new Set<CompetitionId>();
        if (isNotDefined(competition.parentId)) {
            // if there is no parent competition we still have to include the relevant child competitions
            const relevantChildCompetitionIds = await this.getEffectiveCompetitionIds([competition.id]);
            relevantChildCompetitionIds.forEach(item => result.add(item));
        } else {
            return await this.getRelevantCompetitionIds(competition.parentId);
        }

        return Array.from(result);
    }

}