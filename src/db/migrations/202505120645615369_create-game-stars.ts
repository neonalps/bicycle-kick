import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("game_stars", {
        id: 'id',
        account_id: {
            type: 'integer',
            notNull: true,
            references: `"account"`,
        },
        game_id: {
            type: 'integer',
            notNull: true,
            references: `"game"`,
        }
    });

    pgm.addIndex("game_stars", ['account_id'], { name: 'idx_game_stars_account_id' });

    pgm.addConstraint("game_stars", "uq_game_stars_account_game", {
        unique: ['account_id', 'game_id']
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
