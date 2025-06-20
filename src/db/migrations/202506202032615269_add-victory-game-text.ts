import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns("competition", {
        victory_game_text: {
            type: 'text',
            notNull: false,
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
