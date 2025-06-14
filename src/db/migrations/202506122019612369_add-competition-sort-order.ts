import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns("competition", {
        sort_order: {
            type: 'smallint',
            notNull: true,
            default: 0,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
