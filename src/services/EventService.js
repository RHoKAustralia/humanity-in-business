require('../db');

class EventService {
    async getCommunityEvents(communityId) {
        const {rows} = await db.query('SELECT * FROM events where community_id = $1', [communityId]);
        return rows;
    }

    async getProjects(eventId) {
        const {rows} = await db.query('SELECT p.* FROM events_projects ep ' +
            'JOIN projects p ON p.id = ep.project_id ' +
            'WHERE event_id = $1', [eventId]);
        return rows;
    }
}

module.exports = EventService;