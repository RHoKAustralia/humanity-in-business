require('../../db');

class SDGService{
    /**
     * Get list of sdg's
     */

    async getSDG(id = '') {
        try {
            let query = 'SELECT * FROM sdgs';

            if(id !== '') {
                query = query + ' WHERE id = ' + id;
            }

            const {rows} = await db.query(query);

            if (rows.length > 0) {
                return rows;
            } else {
                return false;
            }

        } catch (error) {
            console.log(error)
            throw  Error('Failed to get the sdg')
        }
    }
}

module.exports = SDGService;