
exports.up = function(knex) {
    return knex.schema.table('users', function(usersTable) {
        usersTable.boolean("isAdmin").default(false)
    })
};

exports.down = function(knex) {
    return knex.schema.table('users').dropColumn("isAdmin");
};
