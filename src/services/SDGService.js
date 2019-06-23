require('../../db');

class SDGService{
    /**
     * Get list of sdg's
     */
    getSDG(id = '') {
        let query = 'SELECT * FROM `sdgs`';
        if(id !== '') {
            query = query + ' WHERE `id` = ' + id;
        }

        return new Promise((resolve, reject) => {
            db.query(query, (error, result) => {
                if (error) {
                    console.log('Something went wrong with db connection: ' + error);
                    reject(new Error(error));
                    return;
                }
                console.log('Success! Results are as follows:');
                console.log(result);
                resolve(result);
            });
        });
     }

    async addSDG(sdgData) {

        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO user_sdgs (user_id, sdg_id) VALUES ?';

            const values = [];

            for ( let i = 0; i < sdgData.sdg_ids.length; i++ ) {
                values.push([sdgData.user_id, sdgData.sdg_ids[i]]);
            }

            db.query(sql, [values], function (error, results, fields) {
                if (error) {
                    return reject(Error(error));
                }
                return resolve(true);
            });
        });
    }
}

module.exports = SDGService;