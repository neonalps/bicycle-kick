import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("season", {
        id: 'id',
        name: {
            type: 'text',
            unique: true,
            notNull: false
        },
        short_name: {
            type: 'text',
            unique: true,
            notNull: true
        },
        start: {
            type: 'timestamptz',
            notNull: true
        },
        end: {
            type: 'timestamptz',
            notNull: true
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
