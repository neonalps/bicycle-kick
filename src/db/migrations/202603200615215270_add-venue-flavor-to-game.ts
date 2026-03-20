import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns("game", {
        venue_flavor_id: {
            type: 'integer',
            notNull: false,
            references: `"venue_flavor"`,
        }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
