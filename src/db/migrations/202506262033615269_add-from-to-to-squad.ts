import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns("squad", {
        start: {
            type: 'date',
            notNull: false,
        },
        end: {
            type: 'date',
            notNull: false,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
