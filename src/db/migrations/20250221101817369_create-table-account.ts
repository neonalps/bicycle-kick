import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("account", {
        id: 'id',
        hashed_email: {
            type: 'text',
            notNull: false,
        },
        hashed_phone_no: {
            type: 'text',
            notNull: false,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
