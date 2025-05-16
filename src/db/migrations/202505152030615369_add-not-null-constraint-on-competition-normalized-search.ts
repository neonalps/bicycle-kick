import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.alterColumn("competition", "normalized_search", { notNull: true });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
