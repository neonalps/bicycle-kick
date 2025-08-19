import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn('account', 'display_name');

    pgm.addColumns("account", {
        first_name: {
            type: 'text',
            notNull: false,
        },
        last_name: {
            type: 'text',
            notNull: false,
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
