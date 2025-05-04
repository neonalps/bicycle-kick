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
        sort_order: {
            type: 'smallint',
            notNull: true,
        },
        type: {
            type: 'text',
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
        affected_player: {
            type: 'integer',
            notNull: false,
            references: `"game_players"`,
        },
        scored_by: {
            type: 'integer',
            notNull: false,
            references: `"game_players"`,
        },
        assist_by: {
            type: 'integer',
            notNull: false,
            references: `"game_players"`,
        },
        player_on: {
            type: 'integer',
            notNull: false,
            references: `"game_players"`,
        },
        player_off: {
            type: 'integer',
            notNull: false,
            references: `"game_players"`,
        },
        goal_type: {
            type: 'text',
            notNull: false,
        },
        penalty: {
            type: 'boolean',
            notNull: false,
        },
        own_goal: {
            type: 'boolean',
            notNull: false,
        },
        taken_by: {
            type: 'integer',
            notNull: false,
            references: `"game_players"`,
        },
        goalkeeper: {
            type: 'integer',
            notNull: false,
            references: `"game_players"`,
        },
        direct_free_kick: {
            type: 'boolean',
            notNull: false,
        },
        bicycle_kick: {
            type: 'boolean',
            notNull: false,
        },
        reason: {
            type: 'text',
            notNull: false,
        },
        decision: {
            type: 'text',
            notNull: false,
        },
        injured: {
            type: 'boolean',
            notNull: false,
        },
        not_on_pitch: {
            type: 'boolean',
            notNull: false,
        },
        additional_minutes: {
            type: 'integer',
            notNull: false,
        },
        affected_manager: {
            type: 'integer',
            notNull: false,
            references: `"game_managers"`,
        },
    });

    pgm.addIndex("game_events", ['game_id', 'sort_order'], { name: 'idx_game_events_sort_order' })
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
