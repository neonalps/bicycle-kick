import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("club", {
        id: 'id',
        name: {
            type: 'text',
            notNull: true,
        },
        short_name: {
            type: 'text',
            notNull: true,
        },
        country_code: {
            type: 'text',
            notNull: true
        },
        city: {
            type: 'text',
            notNull: true
        },
        district: {
            type: 'text',
            notNull: false
        },
        icon_large: {
            type: 'text',
            notNull: false
        },
        icon_small: {
            type: 'text',
            notNull: false
        },
        primary_colour: {
            type: 'text',
            notNull: false
        },
        secondary_colour: {
            type: 'text',
            notNull: false
        },
        home_venue_id: {
            type: 'integer',
            notNull: false,
            references: `"venue"`,
        },
        normalized_search: {
            type: 'text',
            notNull: true
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
