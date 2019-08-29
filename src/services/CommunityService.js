require('../db');

class CommunityService {

    async getCommunities() {
        const {rows} = await db.query('SELECT * FROM communities');
        return rows;
    }

    async getCommunity(communityId) {
        const {rows} = await db.query('SELECT * FROM communities WHERE id = $1', [communityId]);
        return rows[0];
    }

}

module.exports = CommunityService;