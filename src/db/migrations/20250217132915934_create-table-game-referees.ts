import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("game_referees", {
        id: 'id',
        game_id: {
            type: 'integer',
            notNull: true,
            references: `"game"`,
        },
        person_id: {
            type: 'integer',
            notNull: true,
            references: `"person"`,
        },
        officiating_type: {
            type: 'text',
            notNull: true,
        },
    });

    pgm.addConstraint("game_referees", "uq_game_referees_game_person", {
        unique: ['game_id', 'person_id']
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
