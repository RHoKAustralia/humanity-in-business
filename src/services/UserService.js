require('../../db');

class UserService {
    respond(message) {
        return new Promise((resolve, reject) => {
            db.query('SELECT 1 + 1 AS solution', (error, result) => {
                if (error) {
                    console.log('Something went wrong with db connection: ' + error);
                    reject(new Error(error));
                    return;
                }
                console.log('Success! Database connection established.');
                console.log(result);
                resolve(`response: ${JSON.stringify(result)}`);
                //process.exit()
            });
        });
        // return `hello ${message}`;
    }

    login(username, password) {
        console.log(`${username} ${password}`);

        return new Promise((resolve, reject) => {
            db.query('SELECT 1 + 1 AS solution', (error, result) => {
                if (error) {
                    console.log('Something went wrong with db connection: ' + error);
                    reject(new Error(error));
                    return;
                }
                console.log('Success! Database connection established.');
                resolve(result);
                //process.exit()
            });
        });
    }

    register(userData) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users SET ?', {
                full_name: userData.full_name,
                email: userData.email,
                password: userData.password,
                title: userData.title,
                image_url: userData.image_url,
                company_id: userData.company_id,
            }, function (error, results, fields) {
                if (error) {
                    return reject(Error(error));
                }
                return resolve(results.insertId);
            });
        });
    }
}

module.exports = UserService;
