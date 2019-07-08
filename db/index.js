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

const {Client} = require('pg');

const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const client = new Client({
    connectionString: process.env.DB_URL,
    ssl: true,
});

//client.connect()

global.db = {
    query: function(query, values, callback) {
        const client = new Client({
            connectionString: process.env.DB_URL,
            ssl: true,
        });
        client.connect()
            .then(() => {
                const statement = getStatement(query, values)
                console.log(statement)
                console.log(callback)
                client.query(statement.query, statement.values, function (err, res) {
                    try {
                        callback(err, res)
                    } finally {
                        client.end()
                    }
                })
            })
    }
}

function getStatement(query, values) {
    if (!Array.isArray(values)) {
        const colNames = Object.keys(values)
            .reduce((acc, value) => `${acc}, ${value}`)

        const valuesClause = Object.keys(values)
            .map(s => '?')
            .reduce((acc, value) => `${acc}, ${value}`)
        return {
            query: query
                .replace('()', `(${colNames})`)
                .replace('?', `(${valuesClause})`),
            values: Object.values(values)
        }
    } else
        return {
            query: query,
            values: values
        }
}