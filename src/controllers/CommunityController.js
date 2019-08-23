const CommunityService = require('../services/CommunityService');
const communityService = new CommunityService();

exports.getCommunities = async (req, res, next) => {
    try {
        const communities = await communityService.getCommunities();
        res.send(communities);
    } catch (e) {
        next(e)
    }
};