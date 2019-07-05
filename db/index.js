// const mysql = require('mysql');

// const dotenv = require('dotenv');
// dotenv.config({path: '.env'});

// const db = mysql.createConnection ({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
// });

// global.db = db;

const { Client } = require('pg');

const dotenv = require('dotenv');
dotenv.config({path: '.env'});

console.log('DB_URL'+ process.env.DB_URL)
const client = new Client({
  connectionString: process.env.DB_URL,
  ssl: true,
});

client.connect();

global.db = client;