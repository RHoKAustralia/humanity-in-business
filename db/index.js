const {Client} = require('pg');

const dotenv = require('dotenv');
dotenv.config({path: '.env'});

global.db = {
    query: async (query, values, callback) => {
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });

        client.connect().then(() => {
            client.query(query, values, function (err, res) {
                try {
                    return callback(err, res)
                } finally {
                    client.end()
                }
            })
        })
    }
};