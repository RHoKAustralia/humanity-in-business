const md5 = require('md5');
require('../db');


class UserService {
    respond(message) {
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
                //TODO: Handle error code 23505 detail: 'Key (email)=(newEmail) already exists.'
                throw new Error('Failed to register user')
            });

        if (userData.skills && userData.skills.length > 0) {
            await this.addUserSkills(newUserId, userData.skills)
                .catch(error => {
                    console.log(error)
                    throw new Error('Failed to add skills after user registration')
                });
        }

        return {id: newUserId};
    }

    async addUser(userData) {
        const {rows} = await db.query('INSERT INTO users (full_name, email, password, title, image_url, company_id) VALUES ($1, $2, $3, $4, $5, $6)'
            + ' RETURNING id',
            [userData.full_name,
                userData.email,
                md5(userData.password),
                userData.title,
                userData.image_url,
                userData.company_id]);
        return rows[0].id
    }

    async addUserSkills(userId, skills) {
        // TODO. Get skills IDs from skills table
        const values = [userId].concat(skills);
        const userSkillClause = skills.map((skill, index) => `($1, $${index + 2})`)
            .reduce((acc, current) => `${acc}, ${current}`);
        const sql = `INSERT INTO user_skills (user_id, skill_id) VALUES ${userSkillClause}`;
        console.log(sql)
        console.log(values)
        await db.query(sql, values)
    }

    async getProfile(profileId) {
        try {
            const {rows} = await db.query('select u.full_name, u.email, u.title, u.image_url, c.id as company_id, c.name as company_name,  ' +
                'c.url, c.image_url from users u join companies c on u.company_id = c.id where u.id =  $1',
                [profileId]);
            const profile = rows[0];
            profile.total_points = 0;

            return profile
        } catch (error) {
            console.log(error)
            throw  Error('Failed to get profile')
        }
    }


    async addSDGs(user_id, sdg_ids) {
        const values = [user_id].concat(sdg_ids);
        const sdgClause = sdg_ids.map((sdg_id, index) => `($1, $${index + 2})`)
            .reduce((acc, current) => `${acc}, ${current}`);

        let query = `INSERT INTO user_sdgs (user_id, sdg_id) VALUES ${sdgClause};`;

        await db.query(query, values)
    }
}

module.exports = UserService;
