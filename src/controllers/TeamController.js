const TeamService = require('../services/TeamService');

const teamService = new TeamService();

exports.addMember = async (req, res, next) => {
    try {
        await teamService.addMember(req.params.teamId, req.body.user_id);
        res.send(201);
    } catch (e) {
        console.log(e);
        next(new Error('Failed to execute request'));
    }
};

exports.getMembers = async (req, res, next) => {
    try {
        const teamMembers = await teamService.getMembers(req.params.teamId);
        res.send(teamMembers);
    } catch (e) {
        console.log(e);
        next(new Error('Failed to execute request'));
    }
};

exports.getTeam = async (req, res, next) => {
    try {
        const team = await teamService.getTeamById(req.params.teamId);
        res.send(team);
    } catch (e) {
        console.log(e);
        next(new Error('Failed to execute request'));
    }
};