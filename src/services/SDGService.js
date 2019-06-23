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
}

module.exports = SDGService;