/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async(knex) => {
    await knex.schema.createTable("users", (table) => {
        table.increments("id");
        table.string("name").notNullable();
        table.string("password").notNullable();
        table.string("login").notNullable();
        table.string("email");
        table.boolean("email_is_confirmed").notNullable().defaultTo(false);
        table.string("email_confirmation_code", 6);
        table
            .enu("role", ["user", "editor", "admin"])
            .notNullable()
            .defaultTo("user");
    }); 

    await knex.schema.createTable("products", (table) => {
        table.increments("id");
        table.integer("price").notNullable();
        table.string("description");
        table.string("name").notNullable();
    });

    await knex.schema.createTable("orders", (table) => {
        table.increments("id");
        table.integer("price").notNullable();
        table.integer("user_id").notNullable();

        table
            .foreign("user_id")
            .references("users.id")
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");
    });

    await knex.schema.createTable("order_products", (table) => {
        table.integer("order_id").notNullable();
        table.integer("product_id").notNullable();

        table
            .foreign("order_id")
            .references("orders.id")
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");
        table
            .foreign("product_id")
            .references("products.id")
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");
    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async(knex) => {
    await knex.schema.dropTableIfExists("order_products");
    await knex.schema.dropTableIfExists("orders");
    await knex.schema.dropTableIfExists("products");
    await knex.schema.dropTableIfExists("users");

};
