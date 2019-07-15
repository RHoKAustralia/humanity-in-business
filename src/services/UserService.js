var md5 = require('md5');
require('../../db');


class UserService {
    respond(message) {
        return new Promise((resolve, reject) => {
            db.query('SELECT 1 + 1 AS solution', [], (error, result) => {
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
            db.query('SELECT id FROM users WHERE email = $1 AND password = $2',
                [email, encryptedPassword]
                , function (error, result) {
                    if (error) {
                        console.log(error);
                        reject(new Error('Failed to login user'));
                        return;
                    }

                    if (result.rowCount > 0) {
                        return resolve({id: result.rows[0].id});
                    } else {
                        return resolve({})
                    }
                });
        });
    }

    async register(userData) {
        const newUserId = await this.addUser(userData)
            .catch(error => {
                console.log(error);
                throw new Error('Failed to register user')
            });

        if (userData.skills && userData.skills.length > 0) {
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
                    return resolve({id: results.rows[0].id});
                });
        });
    }

    async addUserSkills(userId, skills) {
        // TODO. Get skills IDs from skills table

        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO user_skills (user_id, skill_id) VALUES ?';

            const values = [];

            for (let i = 0; i < skills.length; i++) {
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

    async getProfile(profileId) {
        try {
            const {rows} = await db.query('select u.full_name, u.email, u.title, u.image_url, c.id as company_id, c.name as company_name,  ' +
                'c.url, c.image_url from users u join companies c on u.company_id = c.id where u.id =  $1',
                [profileId]);
            const profile = rows[0]

            try {
                const {rows} = await db.query('select SUM(ch.points) as total_points from users u left join user_challenges uc on u.id = uc.user_id left join challenges ch on ch.id = uc.challenge_id where u.id = $1 and uc.completed = 1 group by u.id;',
                    [profileId]);
                if (rows.length > 0) {
                    profile.total_points = rows[0].total_points
                } else {
                    profile.total_points = 0
                }
            } catch (error) {
                console.log(error)
                profile.total_points = 0
            }
            return profile
        } catch (error) {
            console.log(error)
            throw  Error('Failed to get profile')
        }
    }

    getUpcomingChallenges(userId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT distinct (c.id), c.title, c.description, c.challenge_date, c.points, c.image_url
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
            const sql = `SELECT distinct (c.id), c.title, c.description, c.challenge_date, c.points, c.image_url
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

    async addSDGs(user_id, sdg_ids) {
        const values = [user_id].concat(sdg_ids);
        const sdgClause = sdg_ids.map((sdg_id, index) => `($1, $${index + 2})`)
            .reduce((acc, current) => `${acc}, ${current}`);

        let query = `INSERT INTO user_sdgs (user_id, sdg_id) VALUES ${sdgClause};`;
        console.log(query);
        console.log(values)

        await db.query(query, values)
    }
}

module.exports = UserService;
