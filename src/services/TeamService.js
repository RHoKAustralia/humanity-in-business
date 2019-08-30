require('../db');

class TeamService {
    async addMember(teamId, userId) {
        await db.query('INSERT INTO teams_members (team_id, user_id) VALUES ($1, $2)', [teamId, userId]);
    }

    async removeMember(teamId, userId) {
        await db.query('DELETE FROM teams_members WHERE team_id = $1 and user_id = $2', [teamId, userId]);
    }
}

module.exports = TeamService;