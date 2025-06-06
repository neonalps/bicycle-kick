import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("external_provider_venue", {
        id: 'id',
        external_provider: {
            type: 'text',
            notNull: true,
        },
        external_id: {
            type: 'text',
            notNull: true,
        },
        venue_id: {
            type: 'integer',
            notNull: true,
            references: `"venue"`,
        },
    });

    pgm.addConstraint("external_provider_venue", "uq_external_provider_external_id_venue", {
        unique: ['external_provider', 'external_id']
    });

    pgm.addConstraint("external_provider_venue", "uq_external_provider_venue_id", {
        unique: ['external_provider', 'venue_id']
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
