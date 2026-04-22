import { Sql } from "@src/db";
import { ManagerPeriod } from "@src/model/internal/manager-period";
import { GetManagerPeriodsPaginationParams } from "./service";
import { ManagerPeriodDaoInterface } from "@src/model/internal/interface/manager-period.interface";
import { SortOrder } from "@src/module/pagination/constants";
import { GameService } from "@src/module/game/service";
import { isDefined } from "@src/util/common";
import { SeasonTitlesService } from "@src/module/season-titles/service";

export class ManagerPeriodMapper {

    constructor(
        private readonly sql: Sql,
        private readonly gameService: GameService,
        private readonly seasonTitlesService: SeasonTitlesService
    ) {}

    async getAllPaginated(params: GetManagerPeriodsPaginationParams): Promise<ManagerPeriod[]> {
        const result = await this.sql<ManagerPeriodDaoInterface[]>`
            select
                mp.*
            from
                manager_periods mp
            where
                mp.start ${params.order === SortOrder.Ascending ? this.sql`>` : this.sql`<`} ${ params.lastSeen }
            order by
                mp.start ${ this.determineSortOrder(params.order) }
            limit
                ${ params.limit }
        `;

        if (result.length === 0) {
            return [];
        }

        const converted: ManagerPeriod[] = [];
        for (const item of result) {
            converted.push(await this.convertToEntity(item));
        }
        return converted;
    }

    private determineSortOrder(order: SortOrder) {
        return order === SortOrder.Descending ? this.sql`desc` : this.sql`asc`;
    }

    private async convertToEntity(item: ManagerPeriodDaoInterface): Promise<ManagerPeriod> {
        const startDate = new Date(item.start);
        const endDate = isDefined(item.end) ? new Date(item.end) : null;

        const titles = await this.seasonTitlesService.getTitlesForPeriod(startDate, endDate);

        return {
            id: item.id,
            personId: item.personId,
            start: new Date(item.start),
            end: item.end ? new Date(item.end) : null,
            interim: item.interim,
            summary: await this.gameService.getRecordSummaryForPeriod(startDate, endDate),
            titles: titles,
        };
    }

}