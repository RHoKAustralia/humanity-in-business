require('../../db');

class SDGService{
    /**
     * Get list of sdg's
     */
     async getSDG(id = null) {
        let query = 'SELECT * FROM `sdgs`';
        if(id !== null) {
            query = query + ' WHERE `id` = ' + id;
        }
        await db.query(query, (error, results) => {
            if(error) {
                console.log(error);
            }
            console.log(results);
        });
     }
}
