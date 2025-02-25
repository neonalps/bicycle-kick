import { requireNonNull } from "@src/util/common";
import { AdvancedQueryMapper } from "./mapper";

export interface AdvancedQueryConfig {
    mainClubId: number;

}

export class AdvancedQueryService {

    private readonly mapper: AdvancedQueryMapper;

    constructor(mapper: AdvancedQueryMapper) {
        this.mapper = requireNonNull(mapper);
    }

}