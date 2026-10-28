import { ensureNotNullish } from '@src/util/common';
import postgres from 'postgres';

export type Sql = postgres.Sql<{}>;

export class DatabaseManager {

    private static initialized = false;

    private sql: Sql | null = null;

    constructor(private readonly dbConnectionUrl: string) {
        this.init();
    }

    private init() {
        if (DatabaseManager.initialized) {
            throw new Error(`Database manager can only be initialized once`);
        }

        DatabaseManager.initialized = true;
        this.sql = postgres(this.dbConnectionUrl, {
            transform: {
                ...postgres.camel,
                undefined: null
            }
        });
    }

    requireInstance(): Sql {
        return ensureNotNullish(this.sql);
    }

    async testConnection() {
        await this.requireInstance()`select 1`;
    }

}