import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("person_contracts", {
        id: 'id',
        person_id: {
            type: 'integer',
            notNull: true,
            references: `"person"`,
        },
        contract_until: {
            type: 'date',
            notNull: false
        },
        on_loan_until: {
            type: 'date',
            notNull: false
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
