import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("game_events", {
        id: 'id',
        game_id: {
            type: 'integer',
            notNull: true,
            references: `"game"`,
        },
        player_id: {
            type: 'integer',
            notNull: true,
            references: `"person"`,
        },
        event_type: {
            type: 'text',
            notNull: true,
        },
        sort_order: {
            type: 'smallint',
            notNull: true,
        },
        score_main: {
            type: 'smallint',
            notNull: false,
        },
        score_opponent: {
            type: 'smallint',
            notNull: false,
        },
        minute: {
            type: 'text',
            notNull: true,
        },
        substituted_player: {
            type: 'integer',
            notNull: false,
            references: `"person"`,
        },
        assist_by: {
            type: 'integer',
            notNull: false,
            references: `"person"`,
        },
        penalty: {
            type: 'boolean',
            notNull: false,
        },
        own_goal: {
            type: 'boolean',
            notNull: false,
        },
        penalty_saved_by: {
            type: 'integer',
            notNull: false,
            references: `"person"`,
        },
        direct_free_kick: {
            type: 'boolean',
            notNull: false,
        },
        bicycle_kick: {
            type: 'boolean',
            notNull: false,
        },
        red_card_reason: {
            type: 'varchar(100)',
            notNull: false,
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
