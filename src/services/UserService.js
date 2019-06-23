var md5 = require('md5');
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
            db.query('SELECT id FROM users WHERE email = ? AND password = ?',
                [email, encryptedPassword]
            , function (error, result) {
                if (error) {
                    reject(new Error(error));
                    return;
                }

                if (typeof result !== 'undefined' && result.length > 0) {
                    return resolve(result[0].id);
                } else {
                    return resolve(false);
                }
            });
        });
    }

    async register(userData) {
        const newUserId = await this.addUser(userData);

        const response = await this.addUserSkills(newUserId, userData.skills);

        return newUserId;
    }

    async addUser(userData) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users SET ?', {
                full_name: userData.full_name,
                email: userData.email,
                password: md5(userData.password),
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

    async addUserSkills(userId, skills) {
        // TODO. Get skills IDs from skills table

        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO user_skills (user_id, skill_id) VALUES ?';

            const values = [];

            for ( let i = 0; i < skills.length; i++ ) {
                values.push([userId, skills[i]]);
            }
            
            db.query(sql, [values], function (error, results, fields) {
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
