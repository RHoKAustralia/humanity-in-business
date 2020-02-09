require('../db');

class UserRepository {
    async getUser(userId) {
        const {rows} = await db.query(`SELECT id, full_name, title, image_url, why_join_hib, yearly_days_pledged
                                       FROM users
                                       WHERE id = $1`,
            [userId]);

        return rows[0];
    }

    async getUserProjects(userId) {
        const {rows} = await db.query(`SELECT p.id, p.name, p.image_url 
                    FROM teams_members tm
                    JOIN teams t on tm.team_id = t.id
                    JOIN projects p on t.project_id = p.id
                    WHERE user_id = $1`,
            [userId]);
        return rows;
    }

    async getUserCommunities(userId) {
        const {rows} = await db.query(`SELECT c.* FROM teams_members tm
                    JOIN teams t on tm.team_id = t.id
                    JOIN events e on t.event_id = e.id
                    JOIN communities c on e.community_id = c.id
                    WHERE user_id = $1
                    GROUP BY user_id, c.id`,
            [userId]);
        return rows;
    }

    async getUserContributedHours(userId) {
        const {rows} = await db.query(`SELECT SUM(e.hours) as hours FROM teams_members tm
                    JOIN teams t on tm.team_id = t.id
                    JOIN events e on t.event_id = e.id
                    WHERE user_id = $1
                    GROUP BY user_id`,
            [userId]);
        return rows[0] ? rows[0].hours : 0;
    }
}

module.exports = UserRepository;
