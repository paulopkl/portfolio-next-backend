import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("users", (table) => {
        table.string("language", 20).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("users", (table) => {
        table.dropColumn("language");
    });
}