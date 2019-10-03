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
            throw Error('Failed to get all companies')
        }
    }

    async saveCompany(companyData) {
        const {rows} = await db.query(
            `INSERT INTO companies (name, url) VALUES ($1, $2)
                    RETURNING id, name`,
            [companyData.name.trim(),
                companyData.url]);
        return rows[0];
    }

    async findCompany(criteria) {
        if (criteria.name) {
            const companies = await this.getAllCompanies();
            return companies.find(c => this.isSameCompany(c.name, criteria.name));
        }
    }

    isSameCompany(name1, name2) {
        return name1.toLowerCase() === name2.toLowerCase();
    }

    async removeCompany(companyId) {
        return db.query(`DELETE FROM companies WHERE id = $1`, [companyId]);
    }
}

module.exports = CompanyService;