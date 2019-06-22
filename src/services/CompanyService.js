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

}

module.exports = CompanyService;