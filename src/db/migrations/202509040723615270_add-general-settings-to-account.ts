import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns("account", {
        has_profile_picture: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
        language: {
            type: 'text',
            notNull: true,
            default: 'de-at',
        },
        date_format: {
            type: 'text',
            notNull: true,
            default: 'eu',
        },
        score_format: {
            type: 'text',
            notNull: true,
            default: 'colon',
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
