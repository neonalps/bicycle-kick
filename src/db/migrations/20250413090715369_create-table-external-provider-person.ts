import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("external_provider_person", {
        id: 'id',
        external_provider: {
            type: 'text',
            notNull: true,
        },
        external_id: {
            type: 'text',
            notNull: true,
        },
        person_id: {
            type: 'integer',
            notNull: true,
            references: `"person"`,
        },
    });

    pgm.addConstraint("external_provider_person", "uq_external_provider_external_id_person", {
        unique: ['external_provider', 'external_id']
    });

    pgm.addConstraint("external_provider_person", "uq_external_provider_person_id", {
        unique: ['external_provider', 'person_id']
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
