
exports.up = function(knex) {
    return knex.schema.table('users', function(usersTable) {
        usersTable.string("username").notNullable()
    })
};

exports.down = function(knex) {
    return knex.schema.table('users').dropColumn("username");
};
