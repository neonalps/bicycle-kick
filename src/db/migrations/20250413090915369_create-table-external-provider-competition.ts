import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("external_provider_competition", {
        id: 'id',
        external_provider: {
            type: 'text',
            notNull: true,
        },
        external_id: {
            type: 'text',
            notNull: true,
        },
        competition_id: {
            type: 'integer',
            notNull: true,
            references: `"competition"`,
        },
    });

    pgm.addConstraint("external_provider_competition", "uq_external_provider_external_id_competition", {
        unique: ['external_provider', 'external_id']
    });

    pgm.addConstraint("external_provider_competition", "uq_external_provider_competition_id", {
        unique: ['external_provider', 'competition_id']
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
