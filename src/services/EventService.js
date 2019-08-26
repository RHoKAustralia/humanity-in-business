require('../db');

class EventService {
    async getCommunityEvents(communityId) {
        const {rows} = await db.query('SELECT * FROM events where community_id = $1', [communityId]);
        return rows;
    }
}

module.exports = EventService;