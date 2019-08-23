require('../db');

class CommunityService {

    async getCommunities() {
        const {rows} = await db.query('SELECT * FROM communities');
        return rows;
    }
}

module.exports = CommunityService;