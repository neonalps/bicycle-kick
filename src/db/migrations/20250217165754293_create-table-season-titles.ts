import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("season_titles", {
        id: 'id',
        season_id: {
            type: 'integer',
            notNull: true,
            references: `"season"`,
        },
        competition_id: {
            type: 'integer',
            notNull: true,
            references: `"competition"`,
        },
        victory_date: {
            type: 'timestamptz',
            notNull: true,
        },
        victory_game: {
            type: 'integer',
            notNull: false,
            references: `"game"`,
        }
    });

    pgm.addConstraint("season_titles", "uq_season_titles_season_competition", {
        unique: ['season_id', 'competition_id']
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
