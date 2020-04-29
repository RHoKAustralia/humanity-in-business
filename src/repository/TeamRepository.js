require('../db');

class TeamRepository {
    async getTeamById(teamId) {
        const {rows} = await db.query(`SELECT t.* FROM teams t where t.id = $1`, [teamId]);
        return rows[0];
    }
}

module.exports = TeamRepository;