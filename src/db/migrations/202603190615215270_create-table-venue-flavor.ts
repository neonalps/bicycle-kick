import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("venue_flavor", {
        id: 'id',
        venue_id: {
            type: 'integer',
            notNull: true,
            references: `"venue"`,
        },
        name: {
            type: 'text',
            notNull: true,
        }
    });

    pgm.addConstraint("venue_flavor", "uq_venue_flavor_venue_id_name", {
        unique: ['venue_id', 'name']
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
