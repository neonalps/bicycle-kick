import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("squad", {
        id: 'id',
        season_id: {
            type: 'integer',
            notNull: true,
            references: `"season"`,
        },
        person_id: {
            type: 'integer',
            notNull: true,
            references: `"person"`,
        },
        shirt: {
            type: 'integer',
            notNull: false,
        },
        overall_position: {
            type: 'text',
            notNull: true,
        }
    });

    pgm.addConstraint("squad", "uq_squad_season_person", {
        unique: ['season_id', 'person_id']
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
