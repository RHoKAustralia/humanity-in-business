const md5 = require('md5');
require('../db');

const CompanyService = require('../../src/services/CompanyService.js');
const companyService = new CompanyService();

class UserService {
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
        const {rows} = await db.query(`INSERT INTO users
                                           (full_name, email, password, title, image_url)
                                       VALUES ($1, $2, $3, $4, $5)
                                       RETURNING id, full_name, email, title, image_url`,
            [userData.full_name,
                userData.email,
                md5(userData.password),
                userData.title,
                userData.image_url]);
        return rows[0]
    }

    async getUserProfile(userId) {
        const user = await this.getUser(userId);
        const communities = await this.getUserCommunities(userId);
        const hours = await this.getUserHours(userId);

        return {
            ...user,
            hours,
            communities
        };
    }

    /**
     * Changes user company using company name.
     * Creates a new company if none is found.
     */
    async changeCompany(userId, companyName) {
        let company = await companyService.findCompany({name: companyName});
        if (!company){
            company = companyService.saveCompany({name: companyName});
        }

        await this.updateCompany(userId, company.id);
        return company;
    }

    async getUserEvents(userId) {
        const {rows} = await db.query(`SELECT e.* FROM teams_members tm
                    JOIN teams t on tm.team_id = t.id
                    JOIN events e on t.event_id = e.id
                    WHERE user_id = $1`,
            [userId]);
        return rows;
    }

    async getUser(userId) {
        const {rows} = await db.query(`SELECT id, full_name, title, image_url FROM users WHERE id = $1`,
            [userId]);

        return rows[0];
    }

    async getUserCommunities(userId) {
        const {rows} = await db.query(`SELECT c.id, c.name FROM teams_members tm
                    JOIN teams t on tm.team_id = t.id
                    JOIN events e on t.event_id = e.id
                    JOIN communities c on e.community_id = c.id
                    WHERE user_id = $1
                    GROUP BY user_id, c.id`,
            [userId]);
        return rows;
    }

    async getUserHours(userId) {
        const {rows} = await db.query(`SELECT SUM(e.hours) as hours FROM teams_members tm
                    JOIN teams t on tm.team_id = t.id
                    JOIN events e on t.event_id = e.id
                    WHERE user_id = $1
                    GROUP BY user_id`,
            [userId]);
        return rows[0] ? rows[0].hours : 0;
    }

    async updateCompany(userId, companyId) {
        return db.query(`UPDATE users SET company_id = $1 WHERE id = $2`,
            [companyId, userId]);
    }

    async removeUser(userId) {
        return db.query(`DELETE FROM users where id = $1`, [userId]);
    }

    async removeCompany(userId) {
        return this.updateCompany(userId);
    }

    async updateUserImageUrl(imageUrl, userId) {
        const {rows} = await db.query(`UPDATE users u SET image_url = $1 WHERE id = $2
                    RETURNING u.id, u.full_name, u.email, u.title, u.image_url, u.company_id`,
            [imageUrl, userId]);
        return rows[0];
    }
}

module.exports = UserService;
