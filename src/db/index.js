const { Pool } = require('pg');

const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const sslModeRequired = (process.env.POSTGRES_SSL_MODE_REQUIRED || 'true') === 'true';
const databaseUrl = process.env.DATABASE_URL;

console.log(`Db: postgres url ${databaseUrl}`);
console.log(`Db: postgres ssl mode ${sslModeRequired}`);

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: sslModeRequired
});

global.db = pool;

module.exports = pool;