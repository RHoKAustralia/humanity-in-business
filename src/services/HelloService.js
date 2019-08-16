require('../db');

class HelloService {
    hello(message) {
        return new Promise((resolve, reject) => {
            db.query('SELECT 1 + 1 AS solution', [], (error) => {
                if (error) {
                    console.log('Something went wrong with db connection: ' + error);
                    reject(new Error(error));
                    return;
                }
                console.log('Success! Database connection established.');
                resolve(`Success !! message:${message}`);
            });
        });
    }
}

module.exports = HelloService;