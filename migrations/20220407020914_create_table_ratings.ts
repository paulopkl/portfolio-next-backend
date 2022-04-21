import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("ratings", (table) => {
        table.increments("id").primary();
        table.string("author", 255).notNullable();
        table.string("description", 1000).notNullable();
        table.integer("user_id").unsigned();
        table.foreign("user_id")
            .references("users.id")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("ratings");
}