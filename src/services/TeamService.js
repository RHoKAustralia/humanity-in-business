require('../db');

class TeamService {
    async addMember(teamId, userId) {
        await db.query('INSERT INTO teams_members (team_id, user_id) VALUES ($1, $2)', [teamId, userId]);
    }

    async removeMember(teamId, userId) {
        await db.query('DELETE FROM teams_members WHERE team_id = $1 and user_id = $2', [teamId, userId]);
    }

    async getMembers(teamId) {
        const {rows} = await db.query('SELECT tm.user_id, u.full_name, u.title, u.image_url from teams_members tm ' +
            'JOIN users u on u.id = tm.user_id ' +
            'WHERE team_id = $1', [teamId]);
        return rows;
    }
}

module.exports = TeamService;