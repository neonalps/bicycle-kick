import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns("account", {
        game_minute_format: {
            type: 'text',
            notNull: true,
            default: 'dot',
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
