import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("game_attended", {
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

    pgm.addIndex("game_attended", ['account_id'], { name: 'idx_game_attended_account_id' });

    pgm.addConstraint("game_attended", "uq_game_attended_account_game", {
        unique: ['account_id', 'game_id']
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
