const CommunityService = require('../services/CommunityService');
const EventService = require('../services/EventService');

const communityService = new CommunityService();
const eventService = new EventService();

exports.getCommunities = async (req, res, next) => {
    try {
        const communities = await communityService.getCommunities();
        res.send(communities);
    } catch (e) {
        console.log(e);
        next('Failed to execute request');
    }
};

exports.getCommunity = async (req, res, next) => {
    try {
        const community = await communityService.getCommunity(req.params.communityId);
        res.send(community);

    } catch (e) {
        console.log(e);
        next(new Error('Failed to execute request'));
    }
};

exports.getEvents = async (req, res, next) => {
    try {
        const communities = await eventService.getCommunityEvents(req.params.communityId);
        res.send(communities);
    } catch (e) {
        console.log(e);
        next(new Error('Failed to execute request'));
    }
};