import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("person", {
        id: 'id',
        last_name: {
            type: 'text',
            notNull: true,
        },
        first_name: {
            type: 'text',
            notNull: true,
        },
        avatar: {
            type: 'text',
            notNull: false,
        },
        birthday: {
            type: 'date',
            notNull: false,
        },
        deathday: {
            type: 'date',
            notNull: false,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
