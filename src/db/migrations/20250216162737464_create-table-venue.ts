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
        country_code: {
            type: 'text',
            notNull: true
        },
        capacity: {
            type: 'integer',
            notNull: true
        },
        location_lat: {
            type: 'numeric',
            notNull: false,
        },
        location_lng: {
            type: 'numeric',
            notNull: false,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
