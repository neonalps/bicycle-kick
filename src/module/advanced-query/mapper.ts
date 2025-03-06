import { Sql } from "@src/db";
import { requireNonNull } from "@src/util/common";

export class AdvancedQueryMapper {

    private readonly sql: Sql;

    constructor(sql: Sql) {
        this.sql = requireNonNull(sql);
    }

    
}