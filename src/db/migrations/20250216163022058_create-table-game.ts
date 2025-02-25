import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("game", {
        id: 'id',
        kickoff: {
            type: 'timestamptz',
            notNull: true,
        },
        opponent_id: {
            type: 'integer',
            notNull: true,
            references: `"club"`,
        },
        result_tendency: {
            type: 'text',
            notNull: false,
        },
        competition_id: {
            type: 'integer',
            notNull: true,
            references: `"competition"`,
        },
        competition_round: {
            type: 'text',
            notNull: true,
        },
        season_id: {
            type: 'integer',
            notNull: true,
            references: `"season"`,
        },
        status: {
            type: 'text',
            notNull: true,
        },
        is_home_team: {
            type: 'boolean',
            notNull: true,
        },
        attendance: {
            type: 'integer',
            notNull: false,
        },
        ft_goals_main: {
            type: 'smallint',
            notNull: false,
        },
        ft_goals_opponent: {
            type: 'smallint',
            notNull: false,
        },
        ht_goals_main: {
            type: 'smallint',
            notNull: false,
        },
        ht_goals_opponent: {
            type: 'smallint',
            notNull: false,
        },
        tactical_formation_main: {
            type: 'text',
            notNull: false,
        },
        tactical_formation_opponent: {
            type: 'text',
            notNull: false,
        },
        yellow_cards_main: {
            type: 'smallint',
            notNull: false,
        },
        yellow_cards_opponent: {
            type: 'smallint',
            notNull: false,
        },
        yellow_red_cards_main: {
            type: 'smallint',
            notNull: false,
        },
        yellow_red_cards_opponent: {
            type: 'smallint',
            notNull: false,
        },
        red_cards_main: {
            type: 'smallint',
            notNull: false,
        },
        red_cards_opponent: {
            type: 'smallint',
            notNull: false,
        },
        penalties_scored_main: {
            type: 'smallint',
            notNull: false,
        },
        penalties_scored_opponent: {
            type: 'smallint',
            notNull: false,
        },
        penalties_saved_main: {
            type: 'smallint',
            notNull: false,
        },
        turn_arounds_main: {
            type: 'smallint',
            notNull: false,
        },
        turn_arounds_opponent: {
            type: 'smallint',
            notNull: false,
        },
        bicycle_kick_goals_main: {
            type: 'smallint',
            notNull: false,
        },
        bicycle_kick_goals_opponent: {
            type: 'smallint',
            notNull: false,
        },
        penalties_saved_opponent: {
            type: 'smallint',
            notNull: false,
        },
        table_position_before: {
            type: 'integer',
            notNull: false,
        },
        table_position_after: {
            type: 'integer',
            notNull: false,
        },
        table_position_offset: {
            type: 'integer',
            notNull: false,
        },
        is_sold_out: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
        leg: {
            type: 'smallint',
            notNull: false,
        },
        previous_leg: {
            type: 'integer',
            notNull: false,
            references: `"game"`,
        },
        aet_goals_main: {
            type: 'smallint',
            notNull: false,
        },
        aet_goals_opponent: {
            type: 'smallint',
            notNull: false,
        },
        pso_goals_main: {
            type: 'smallint',
            notNull: false,
        },
        pso_goals_opponent: {
            type: 'smallint',
            notNull: false,
        },
        is_practice: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
        scheduled: {
            type: 'timestamptz',
            notNull: false,
        },
        is_neutral_ground: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
        was_abandoned: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
    });

    pgm.addIndex("game", ['kickoff'], { name: 'idx_game_kickoff' })
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
