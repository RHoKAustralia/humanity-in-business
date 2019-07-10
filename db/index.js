const { Pool, Client } = require('pg');

const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

global.db = pool;

module.exports = pool;