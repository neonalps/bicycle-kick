import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("game_absences", {
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
        sort_order: {
            type: 'smallint',
            notNull: true,
        },
        absence_type: {
            type: 'text',
            notNull: true,
        },
        absence_reason: {
            type: 'text',
            notNull: true,
        },
    });

    pgm.addIndex("game_absences", ['game_id', 'sort_order'], { name: 'idx_game_absences_sort_order' })
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
