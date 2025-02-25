import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("person", {
        id: 'id',
        name: {
            type: 'text',
            notNull: true,
        },
        last_name: {
            type: 'text',
            notNull: true,
        },
        avatar: {
            type: 'text',
            notNull: false,
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
