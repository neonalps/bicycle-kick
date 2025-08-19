import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.renameColumn("account", "hashed_email", "email");
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
