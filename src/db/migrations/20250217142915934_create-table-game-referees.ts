import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("game_managers", {
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
        role: {
            type: 'text',
            notNull: true,
        },
    });

    pgm.addConstraint("game_managers", "uq_game_managers_game_person", {
        unique: ['game_id', 'person_id']
    });

    pgm.addIndex("game_managers", ['game_id', 'sort_order'], { name: 'idx_game_managers_sort_order' })
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
