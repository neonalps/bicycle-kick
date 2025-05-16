import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns("competition", {
        icon_large: {
            type: 'text',
            notNull: false
        },
        icon_small: {
            type: 'text',
            notNull: false
        },
        normalized_search: {
            type: 'text',
            notNull: false
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
