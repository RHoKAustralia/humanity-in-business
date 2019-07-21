require('../../db');

class CompanyService {

    async getCompany(companyId) {
        try {
            const {rows} = await db.query('SELECT * from companies WHERE id = $1',
                [companyId]);

            if (rows.length > 0) {
                return rows[0];
            }

            return false;
        } catch (error) {
            console.log(error)
            throw  Error('Failed to get company')
        }
    }

    async getAllCompanies() {
        try {
            const {rows} = await db.query('SELECT * from companies');

            if (rows.length > 0) {
                return rows;
            } else {
                return false;
            }

        } catch (error) {
            console.log(error)
            throw  Error('Failed to get all companies')
        }
    }

    async insert(companyData) {
        const {rows} = await db.query('INSERT INTO companies (name, url) VALUES ($1, $2)'
            + ' RETURNING id',
            [companyData.name,
                companyData.url]);
        return rows[0].id
    }

    async getCompanyData(companyId) {
        const users = await this.getUsersByCompany(companyId);
    }

    async getCompanyLeaderBoard(companyId) {
        try {
            const {rows} = await db.query(`SELECT u.full_name AS name, SUM(c.points) AS points, u.title
                FROM users u INNER JOIN user_challenges uc ON u.id = uc.user_id
                INNER JOIN challenges c ON uc.challenge_id = c.id WHERE company_id = $1 
                AND uc.completed = 1 GROUP BY u.id ORDER BY points DESC`,
                [companyId]);

            if (rows.length > 0) {
                return rows;
            }

            return false;
        } catch (error) {
            console.log(error)
            throw  Error('Failed to get company leader board')
        }
    }

    async getBadges(companyId) {
        try {
            const {rows} = await db.query(`SELECT DISTINCT(b.id), b.name
                            FROM challenges c
                            INNER JOIN challenge_badges cb ON cb.challenge_id = c.id
                            INNER JOIN badges b ON b.id = cb.badge_id
                            INNER JOIN user_challenges uc ON uc.challenge_id = c.id
                            INNER JOIN users u ON u.id = uc.user_id
                            WHERE u.company_id = $1
                                AND uc.completed = 1`,
                [companyId]);

            if (rows.length > 0) {
                return rows;
            }

            return false;
        } catch (error) {
            console.log(error)
            throw  Error('Failed to get company badges')
        }
    }


    async getSDGs(companyId) {
        try {
            const {rows} = await db.query(`SELECT s.title
                        FROM sdgs s
                        INNER JOIN user_sdgs us ON us.sdg_id = s.id
                        INNER JOIN users u ON u.id = us.user_id
                        WHERE u.company_id = $1`,
                [companyId]);

            if (rows.length > 0) {
                return rows;
            }

            return false;
        } catch (error) {
            console.log(error)
            throw  Error('Failed to get sdgs')
        }
    }

}

module.exports = CompanyService;