require('../db');

class EventService {
    async getCommunityEvents(communityId) {
        const {rows} = await db.query('SELECT * FROM events where community_id = $1', [communityId]);
        return rows;
    }

    async getTeams(eventId) {
        const {rows} = await db.query('SELECT p.*, t.id as team_id FROM teams t ' +
            'JOIN projects p ON p.id = t.project_id ' +
            'WHERE event_id = $1', [eventId]);
         return rows.map(r => {
             const team_Id = r.team_id;
             delete r.team_id;
             return {
                 team_Id,
                 project: r
             }
         })
    }
}

module.exports = EventService;