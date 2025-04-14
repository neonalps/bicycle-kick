import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("account", {
        id: 'id',
        public_id: {
            type: 'text',
            notNull: true,
            unique: true,
        },
        display_name: {
            type: 'text',
            notNull: true,
        },
        hashed_email: {
            type: 'text',
            notNull: true,
            unique: true,
        },
        enabled: {
            type: 'boolean',
            notNull: true,
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
