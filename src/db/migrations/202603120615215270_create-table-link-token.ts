import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("link_token", {
        id: 'id',
        account_id: {
            type: 'integer',
            notNull: true,
            references: `"account"`,
        },
        token_type: {
            type: 'text',
            notNull: true,
        },
        token_value: {
            type: 'text',
            notNull: true,
            unique: true,
        },
        valid_until: {
            type: 'timestamptz',
            notNull: true,
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.addIndex("link_token", ['valid_until'], { name: 'idx_link_token_valid_until' })
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
