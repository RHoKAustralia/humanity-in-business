require('../db');

class ProjectService {
    async getProjectById(projectId) {
        const {rows} = await db.query(`SELECT p.*
                                       FROM projects p
                                       WHERE p.id = $1`, [projectId]);
        return rows[0];
    }
}

module.exports = ProjectService;