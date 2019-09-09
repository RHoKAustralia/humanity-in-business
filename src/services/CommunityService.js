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

    async getLeaderBoard(communityId) {
        const {rows} = await db.query('SELECT u.id as id, u.full_name as name, u.title, u.image_url, companies.name as company, ' +
            'sum(e.hours) as hours, ' +
            'count(distinct(t.project_id)) as projects, ' +
            'count(distinct(e.id)) as events ' +
            'FROM communities c ' +
            'JOIN events e on e.community_id = c.id ' +
            'JOIN teams t on t.event_id = e.id ' +
            'JOIN teams_members tm on tm.team_id = t.id ' +
            'JOIN users u on tm.user_id = u.id ' +
            'LEFT JOIN companies on u.company_id = companies.id ' +
            'GROUP BY c.id, u.id, companies.name ' +
            'HAVING c.id = $1 ' +
            'ORDER BY hours DESC ' +
            'LIMIT 15', [communityId]);
        return rows;
    }

}

module.exports = CommunityService;