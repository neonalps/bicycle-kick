import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("competition", {
        id: 'id',
        name: {
            type: 'text',
            notNull: true,
        },
        short_name: {
            type: 'text',
            notNull: true,
        },
        is_domestic: {
            type: 'boolean',
            notNull: true,
        },
        parent_id: {
            type: 'integer',
            notNull: false,
            references: `"competition"`,
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
