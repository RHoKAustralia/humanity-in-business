const EventService = require('../services/EventService');

const eventService = new EventService();

exports.getTeams = async (req, res, next) => {
    try {
        const eventProjects = await eventService.getTeams(req.params.eventId);
        res.send(eventProjects);
    } catch (e) {
        console.log(e);
        next(new Error('Failed to execute request'));
    }
};