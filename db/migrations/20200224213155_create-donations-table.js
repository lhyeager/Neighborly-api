
exports.up = function(knex) {
    return knex.schema.createTable('donations', function(donationsTable) {
        donationsTable.increments('id').primary()
        donationsTable.string('title').notNullable()
        donationsTable.text('description').notNullable()
        donationsTable.integer('user_id').references('id').inTable('users')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("donations");
};
