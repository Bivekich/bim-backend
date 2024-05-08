const {Pool} = require('pg')

const pool = new Pool({
    user: 'ztrntpyy',
    host: 'snuffleupagus.db.elephantsql.com',
    database: 'ztrntpyy',
    password: 'lh7IPcjt0Mkjwb4dUr9pY09cYBfuq7ti',
    port: 5432,
})

module.exports = pool