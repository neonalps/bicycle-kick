import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("manager_periods", {
        id: 'id',
        person_id: {
            type: 'integer',
            notNull: true,
            references: `"person"`,
        },
        start: {
            type: 'date',
            notNull: true,
        },
        end: {
            type: 'date',
            notNull: false,
        },
        interim: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
