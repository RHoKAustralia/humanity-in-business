var md5 = require('md5');
require('../../db');


class UserService {
    respond(message) {
        return new Promise((resolve, reject) => {
            db.query('SELECT 1 + 1 AS solution',[], (error, result) => {
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
        const newUserId = await this.addUser(userData)
            .catch(error => {
                console.log(error)
                throw new Error('Failed to register user')
            });

        if ( userData.skills && userData.skills.length > 0 ) {
            await this.addUserSkills(newUserId, userData.skills)
                .catch(error => {
                    console.log(error)
                    throw new Error('Failed to add skills after user registration')
                });
        }

        return newUserId;
    }

    async addUser(userData) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users (full_name, email, password, title, image_url, company_id) VALUES ($1, $2, $3, $4, $5, $6)'
                + ' RETURNING id',
                [userData.full_name,
                userData.email,
                md5(userData.password),
                userData.title,
                userData.image_url,
                userData.company_id],
                function (error, results) {
                    if (error) {
                        return reject(Error(error));
                    }
                    return resolve(results.rows[0].id);
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
            
            db.query(sql, [values], function (error, results) {
                if (error) {
                    return reject(Error(error));
                }
                return resolve(results.insertId);
            });
        });
    }

    getProfile(profileId) {
        return new Promise((resolve, reject) => {
            db.query('select u.full_name, u.email, u.title, u.image_url, c.id as company_id, c.name as company_name,  ' +
                'c.url, c.image_url from users u join companies c on u.company_id = c.id where u.id =  ?',
                [profileId]
                , function (error, result) {
                    if (error) {
                        reject(new Error(error));
                        return;
                    }
                    let profile = result[0];
                    profile['total_points'] = 0;

                    db.query('select SUM(ch.points) as total_points from users u left join user_challenges uc on u.id = uc.user_id left join challenges ch on ch.id = uc.challenge_id where u.id = ? and uc.completed = 1 group by u.id;',
                        [profileId]
                        , function (error, result) {
                        console.log(result);
                            if (error || result[0].total_points == '') {
                                profile['total_points'] = 0;
                            }
                            else {
                                // Now that we have a user, let's get related challenges, but divide them into completed and not completed
                                profile['total_points'] = result[0].total_points;
                                console.log(profile);
                            }
                            return resolve(profile);

                        });

                });


        });
    }

    getUpcomingChallenges(userId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT distinct(c.id), c.title, c.description, c.challenge_date, c.points, c.image_url
                        FROM users u
                        INNER JOIN user_skills us ON us.user_id = u.id
                        INNER JOIN user_sdgs usdgs ON usdgs.user_id = u.id
                        INNER JOIN skill_challenges sc ON sc.skill_id = us.skill_id
                        INNER JOIN sdg_challenges sch ON sch.sdg_id = usdgs.sdg_id
                        INNER JOIN challenges c ON c.id = sc.challenge_id
                        WHERE c.challenge_date > NOW()`;

            db.query(sql, [userId]
                , function (error, result) {
                    if (error) {
                        return reject(new Error(error));
                    }

                    return resolve(result);
                });
        });
    }

    getCompletedChallenges(userId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT distinct(c.id), c.title, c.description, c.challenge_date, c.points, c.image_url
                        FROM users u
                        INNER JOIN user_challenges uc ON uc.user_id = u.id
                        INNER JOIN challenges c ON c.id = uc.challenge_id
                        WHERE uc.completed = 1
                        ORDER BY c.challenge_date DESC`;

            db.query(sql, [userId]
                , function (error, result) {
                    if (error) {
                        return reject(new Error(error));
                    }

                    return resolve(result);
                });
        });
    }
}

module.exports = UserService;
