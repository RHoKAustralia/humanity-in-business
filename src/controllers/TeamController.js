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