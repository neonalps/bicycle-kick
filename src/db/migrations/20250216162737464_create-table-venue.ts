import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("venue", {
        id: 'id',
        name: {
            type: 'text',
            notNull: true,
        },
        short_name: {
            type: 'text',
            notNull: true,
        },
        city: {
            type: 'text',
            notNull: true
        },
        district: {
            type: 'text',
            notNull: false
        },
        country_code: {
            type: 'text',
            notNull: true
        },
        capacity: {
            type: 'integer',
            notNull: true
        },
        latitude: {
            type: 'numeric',
            notNull: false,
        },
        longitude: {
            type: 'numeric',
            notNull: false,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
