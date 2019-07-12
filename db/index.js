const { Pool } = require('pg');

const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

global.db = pool;

module.exports = pool;