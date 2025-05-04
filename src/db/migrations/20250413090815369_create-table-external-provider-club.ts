import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("external_provider_club", {
        id: 'id',
        external_provider: {
            type: 'text',
            notNull: true,
        },
        external_id: {
            type: 'text',
            notNull: true,
        },
        club_id: {
            type: 'integer',
            notNull: true,
            references: `"club"`,
        },
    });

    pgm.addConstraint("external_provider_club", "uq_external_provider_external_id_club", {
        unique: ['external_provider', 'external_id']
    });

    pgm.addConstraint("external_provider_club", "uq_external_provider_club_id", {
        unique: ['external_provider', 'club_id']
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
