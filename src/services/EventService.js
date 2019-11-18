require('../db');

class EventService {
    async getCommunityEvents(communityId) {
        const {rows} = await db.query('SELECT * FROM events where community_id = $1', [communityId]);
        return rows;
    }

    async getTeams(eventId) {
        const {rows} = await db.query(`SELECT p.*, t.id as team_id FROM teams t
            JOIN projects p ON p.id = t.project_id
            WHERE event_id = $1`, [eventId]);
         return rows.map(r => {
             const team_Id = r.team_id;
             delete r.team_id;
             return {
                 team_Id,
                 project: r
             }
         })
    }

    async getMembers(eventId) {
        const {rows} = await db.query(`SELECT u.id as user_id, u.full_name, u.title, u.image_url, t.id as team_id,
               p.id as project_id, p.name as project_name, p.image_url as project_image_url, p.owner as project_owner,
               p.description as project_description
               FROM users u 
               join teams_members tm on u.id = tm.user_id
               join teams t on tm.team_id = t.id
               join events e on t.event_id = e.id
               join projects p on t.project_id = p.id
               where e.id = $1`, [eventId]);

        return rows;
    }
}

module.exports = EventService;