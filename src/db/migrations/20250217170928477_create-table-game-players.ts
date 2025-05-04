import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("game_players", {
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
        person_id: {
            type: 'integer',
            notNull: true,
            references: `"person"`,
        },
        for_main: {
            type: 'boolean',
            notNull: true,
        },
        shirt: {
            type: 'smallint',
            notNull: false,
        },
        position_key: {
            type: 'text',
            notNull: false,
        },
        position_grid: {
            type: 'text',
            notNull: false,
        },
        is_starting: {
            type: 'boolean',
            notNull: true,
        },
        minutes_played: {
            type: 'smallint',
            notNull: false,
        },
        goals_scored: {
            type: 'smallint',
            notNull: true,
        },
        assists: {
            type: 'smallint',
            notNull: true,
        },
        goals_conceded: {
            type: 'smallint',
            notNull: false,
        },
        is_captain: {
            type: 'boolean',
            notNull: true,
        },
        own_goals: {
            type: 'smallint',
            notNull: true,
        },
        yellow_card: {
            type: 'boolean',
            notNull: true,
        },
        yellow_red_card: {
            type: 'boolean',
            notNull: true,
        },
        red_card: {
            type: 'boolean',
            notNull: true,
        },
        regulation_penalties_taken: {
            type: 'smallint',
            notNull: true,
        },
        regulation_penalties_scored: {
            type: 'smallint',
            notNull: true,
        },
        regulation_penalties_faced: {
            type: 'smallint',
            notNull: true,
        },
        regulation_penalties_saved: {
            type: 'smallint',
            notNull: true,
        },
        pso_penalties_taken: {
            type: 'smallint',
            notNull: true,
        },
        pso_penalties_scored: {
            type: 'smallint',
            notNull: true,
        },
        pso_penalties_faced: {
            type: 'smallint',
            notNull: true,
        },
        pso_penalties_saved: {
            type: 'smallint',
            notNull: true,
        },
    });

    pgm.addConstraint("game_players", "uq_games_players_game_person", {
        unique: ['game_id', 'person_id']
    });

    pgm.addIndex("game_players", ['game_id', 'sort_order'], { name: 'idx_game_players_sort_order' })
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
