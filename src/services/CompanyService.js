require('../../db');

class CompanyService {
    getCompany(companyId) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * from companies WHERE id = ?', [companyId], (error, result) => {
                if (error) {
                    console.log('Something went wrong with db connection: ' + error);
                    reject(new Error(error));
                    return;
                }
                console.log('Success! Database connection established.');
                console.log(result);
                resolve(result);
            });
        });
    }

    getAllCompanies() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * from companies', (error, result) => {
                if (error) {
                    console.log('Something went wrong with db connection: ' + error);
                    reject(new Error(error));
                    return;
                }
                console.log('Success! Database connection established.');
                console.log(result);
                resolve(result);
            });
        });
    }

    insert(companyData) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO companies SET ?', {
                name: companyData.name,
                url: companyData.url,
            }, function (error, results, fields) {
                if (error) {
                    return reject(Error(error));
                }
                return resolve(results.insertId);
            });
        });
    }

    async getCompanyData(companyId) {
        const users = await this.getUsersByCompany(companyId);
    }

    async getCompanyLeaderBoard(companyId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT u.full_name AS name, SUM(c.points) AS points
                            FROM hib.users u
                            INNER JOIN user_challenges uc ON u.id = uc.user_id
                            INNER JOIN challenges c ON uc.challenge_id = c.id
                            WHERE company_id = ?
                            AND uc.completed = 1
                            GROUP BY u.id
                            ORDER BY points DESC`;

            db.query(sql, [companyId], (error, result) => {
                if (error) {
                    console.log('Something went wrong with db connection: ' + error);
                    reject(new Error(error));
                    return;
                }
                resolve(result);
            });
        });
    }

    getBadges(companyId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT DISTINCT(b.id), b.name
                            FROM challenges c
                            INNER JOIN challenge_badges cb ON cb.challenge_id = c.id
                            INNER JOIN badges b ON b.id = cb.badge_id
                            INNER JOIN user_challenges uc ON uc.challenge_id = c.id
                            INNER JOIN users u ON u.id = uc.user_id
                            WHERE u.company_id = ?
                                AND uc.completed = 1`;

            db.query(sql, [companyId], (error, result) => {
                if (error) {
                    console.log('Something went wrong with db connection: ' + error);
                    reject(new Error(error));
                    return;
                }
                resolve(result);
            });
        });    
    }

    getSDGs(companyId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT s.title
                        FROM hib.sdgs s
                        INNER JOIN user_sdgs us ON us.sdg_id = s.id
                        INNER JOIN users u ON u.id = us.user_id
                        WHERE u.company_id = ?`;

            db.query(sql, [companyId], (error, result) => {
                if (error) {
                    console.log('Something went wrong with db connection: ' + error);
                    reject(new Error(error));
                    return;
                }
                resolve(result);
            });
        });                
    }

}

module.exports = CompanyService;