import { Sql } from "@src/db";
import { ManagerPeriod } from "@src/model/internal/manager-period";
import { GetManagerPeriodsPaginationParams } from "./service";
import { ManagerPeriodDaoInterface } from "@src/model/internal/interface/manager-period.interface";
import { SortOrder } from "@src/module/pagination/constants";

export class ManagerPeriodMapper {

    constructor(private readonly sql: Sql) {}

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

        return result.map(item => this.convertToEntity(item));
    }

    private determineSortOrder(order: SortOrder) {
        return order === SortOrder.Descending ? this.sql`desc` : this.sql`asc`;
    }

    private convertToEntity(item: ManagerPeriodDaoInterface): ManagerPeriod {
        return {
            id: item.id,
            personId: item.personId,
            start: new Date(item.start),
            end: item.end ? new Date(item.end) : null,
            interim: item.interim,
        };
    }

}