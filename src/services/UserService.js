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

    login(email, encryptedPassword) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ? AND password = ?',
                [email, encryptedPassword]
            , function (error, result) {
                if (error) {
                    reject(new Error(error));
                    return;
                }

                if (typeof result !== 'undefined' && result.length > 0) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
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

    getProfile(profileId) {
        return new Promise((resolve, reject) => {
            db.query('select u.full_name, u.email, u.title, u.image_url, c.name as company_name, c.url, c.image_url ' +
                'from users u join companies c on u.company_id = c.id where u.id =  ?',
                [profileId]
                , function (error, result) {
                    if (error) {
                        reject(new Error(error));
                        return;
                    }

                    if (!result) {
                        return resolve(false);
                    }

                    return resolve(result[0]);
                });


        });
    }
}

module.exports = UserService;
