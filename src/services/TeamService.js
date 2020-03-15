require('../db');

const ProjectService = require('../../src/services/ProjectService.js');
const projectService = new ProjectService();

const TeamRepository = require('../../src/repository/TeamRepository.js');
const teamRepository = new TeamRepository();

const ObjectUtils = require('../../src/utils/ObjectUtils.js');
const objectUtils = new ObjectUtils();

class TeamService {
    async addMember(teamId, userId) {
        await db.query('INSERT INTO teams_members (team_id, user_id) VALUES ($1, $2)', [teamId, userId]);
    }

    async removeMember(teamId, userId) {
        await db.query('DELETE FROM teams_members WHERE team_id = $1 and user_id = $2', [teamId, userId]);
    }

    async getMembers(teamId) {
        const {rows} = await db.query(`SELECT tm.user_id, u.full_name, u.title, u.image_url from teams_members tm
            JOIN users u on u.id = tm.user_id
            WHERE team_id = $1`, [teamId]);
        return rows;
    }

    async getTeamById(teamId) {
        const team = await teamRepository.getTeamById(teamId);
        const project = await projectService.getProjectById(team.project_id);
        const prefixed_project = objectUtils.prefixAllProperties(project, 'project_');

        return {
            team_id: team.id,
            event_id: team.event_id,
            ...prefixed_project
        }
    }
}

module.exports = TeamService;