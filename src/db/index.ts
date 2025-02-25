import postgres from 'postgres';
import { getDbConnectionUrl } from '@src/config';

const sql = postgres(getDbConnectionUrl(), {
    transform: {
        ...postgres.camel,
        undefined: null
    }
});

export async function initAndTestDatabaseConnection() {
    await sql`select 1`;
};

export default sql;

export type Sql = postgres.Sql<{}>;