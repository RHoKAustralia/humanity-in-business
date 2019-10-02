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
            return await db.query('SELECT * from companies');
        } catch (error) {
            console.log(error)
            throw Error('Failed to get all companies')
        }
    }

    async insert(companyData) {
        const {rows} = await db.query('INSERT INTO companies (name, url) VALUES ($1, $2)'
            + ' RETURNING id',
            [companyData.name,
                companyData.url]);
        return { id : rows[0].id };
    }
}

module.exports = CompanyService;