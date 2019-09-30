require('../db');

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

            return rows;

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
        return { id : rows[0].id };
    }


    async getSDGs(companyId) {
        try {
            const {rows} = await db.query(`SELECT DISTINCT(s.*)
                        FROM sdgs s
                        INNER JOIN user_sdgs us ON us.sdg_id = s.id
                        INNER JOIN users u ON u.id = us.user_id
                        WHERE u.company_id = $1`,
                [companyId]);

            return rows;
        } catch (error) {
            console.log(error)
            throw  Error('Failed to get sdgs')
        }
    }

}

module.exports = CompanyService;