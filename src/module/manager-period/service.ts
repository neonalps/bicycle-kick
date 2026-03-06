import { DateString } from "@src/util/domain-types";
import { PaginationParams } from "@src/module/pagination/constants";
import { ManagerPeriodMapper } from "./mapper";
import { ManagerPeriod } from "@src/model/internal/manager-period";

export interface GetManagerPeriodsPaginationParams extends PaginationParams<DateString> {}

export class ManagerPeriodService {

    constructor(private readonly mapper: ManagerPeriodMapper) {}

    async getAllPaginated(params: GetManagerPeriodsPaginationParams): Promise<ManagerPeriod[]> {
        return await this.mapper.getAllPaginated(params);
    }

}