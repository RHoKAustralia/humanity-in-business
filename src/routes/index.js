const errs = require('restify-errors');

const UserService = require('../services/UserService');
const CompanyService = require('../services/CompanyService');

const UserController = require('../controllers/UserController');
const HelloController = require('../controllers/HelloController');
const CommunityController = require('../controllers/CommunityController');
const EventController = require('../controllers/EventController');
const TeamController = require('../controllers/TeamController');

const userService = new UserService();
const companyService = new CompanyService();

module.exports = function (server) {
    // Companies
    const getCompany = async (req, res, next) => {
        try {
            const response = await companyService.getCompany(req.params.id);
            res.send(response);
        } catch (error) {
            console.log(error)
            next(error)
        }

        next();
    }

    const postCompany = async (req, res, next) => {

        if (req && req.body) {
            try {
                const companyData = {
                    name: req.body.name || 'Default name',
                    url: req.body.url || 'Default URL',
                };

                const response = await companyService.insert(companyData);
                res.send(response);
            } catch (error) {
                console.log(error)
                next(error)
            }

        } else {
            next(new errs.BadRequestError('Invalid request'));
        }

        next();
    }

    const getAllCompanies = async (req, res, next) => {
        try {
            const response = await companyService.getAllCompanies();
            res.send(response);
        } catch (error) {
            console.log(error)
            next(error)
        }

        next();
    }

    //TODO: Protect all endpoints except login with an Authorization token

    // Test
    server.get('/hello/:name', HelloController.hello);

    // Login
    server.post('/login', UserController.login);

    // Register
    server.post('/register', UserController.register);

    // Profile Page
    server.get('/profile/:profileId', UserController.getProfile);

    // Communities
    server.get('/communities', CommunityController.getCommunities);
    server.get('/communities/:communityId', CommunityController.getCommunity);
    server.get('/communities/:communityId/events', CommunityController.getEvents);
    server.get('/communities/:communityId/leaderboard', CommunityController.getLeaderBoard);

    // Events
    server.get('/events/:eventId/teams', EventController.getTeams);

    // Teams
    server.post('/teams/:teamId/members', TeamController.addMember);
    server.get('/teams/:teamId/members', TeamController.getMembers);

    // Companies
    server.get('/company/:id', getCompany);
    server.get('/company', getAllCompanies);
    server.post('/company', postCompany);
}
