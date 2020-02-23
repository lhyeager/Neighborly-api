const knex = require('knex')( {
    client: 'pg',
    connection: {
        host: 'localhost',
        database: 'neighborly_users_db'
    }
});

module.exports = knex;