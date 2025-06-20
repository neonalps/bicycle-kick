import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns("season_titles", {
        title_count: {
            type: 'smallint',
            notNull: false,
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
