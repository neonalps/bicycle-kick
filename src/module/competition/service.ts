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

    async getMapByIds(ids: number[]): Promise<Map<number, Competition>> {
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

    async getAllInMap(): Promise<Map<number, Competition>> {
        return await this.mapper.getAllInMap();
    }

    async getChildCompetitions(competitionId: CompetitionId, combineStatisticsWithParent?: boolean): Promise<Competition[]> {
        validateNotNull(competitionId, "competitionId");

        return await this.mapper.getChildCompetitions(competitionId, combineStatisticsWithParent);
    }

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

}