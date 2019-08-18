const errs = require('restify-errors');

const UserService = require('../services/UserService');
const CompanyService = require('../services/CompanyService');
const SDGService = require('../services/SDGService');
const ChallengeService = require('../services/ChallengeService');
const SkillService = require('../services/SkillService');

const UserController = require('../controllers/UserController');
const HelloController = require('../controllers/HelloController');
const CompanyController = require('../controllers/CompanyController');

const userService = new UserService();
const companyService = new CompanyService();
const sdgService = new SDGService();
const challengeService = new ChallengeService();
const skillService = new SkillService();

module.exports = function (server) {

    const register = async (req, res, next) => {
        if (req && req.body) {
            const userData = {
                full_name: req.body.full_name || 'Default full name',
                email: req.body.email || 'Default email',
                password: req.body.password || 'Default password',
                title: req.body.title || 'Default title',
                image_url: req.body.image_url || 'Default image URL',
                company_id: req.body.company_id || 1,
                skills: req.body.skills || []
            };

            try {
                const response = await userService.register(userData);
                res.send(response);
            } catch (error) {
                //TODO: Return Http 409 on user exists with same email
                next(error)
            }
        } else {
            next(new errs.BadRequestError('Invalid request'));
        }

        next();
    }

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

    const getCompanyLeaderBoard = async (req, res, next) => {
        try {
            const response = await companyService.getCompanyLeaderBoard(req.params.id);
            res.send(response);
        } catch (error) {
            console.log(error)
            next(error)
        }
        next();
    }

    const getCompanyBadges = async (req, res, next) => {
        try {
            const response = await companyService.getBadges(req.params.id);
            res.send(response);
        } catch (error) {
            console.log(error)
            next(error)
        }
        next();
    }

    const getSDG = async (req, res, next) => {
        try {
            const response = await sdgService.getSDG(req.params.sdgId);
            res.send(response);
        } catch (error) {
            console.log(error)
            next(error)
        }
        next();
    }

    const addChallengeToUser = async (req, res, next) => {
        if (req && req.body) {
            try {
                const challengeData = {
                    user_id: req.body.user_id || 1,
                    challenge_id: req.body.challenge_id || 1
                };

                const response = await challengeService.addChallengeToUser(challengeData);
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

    const getChallenge = async (req, res, next) => {
        try {
            const response = await challengeService.getChallenge(req.params.challengeId);
            res.send(response);
        } catch (error) {
            console.log(error)
            next(error)
        }
        next();
    }


    const getUpcomingChallenges = async (req, res, next) => {
        try {
            const response = await userService.getUpcomingChallenges(req.params.userId);
            res.send(response);
        } catch (error) {
            console.log(error)
            next(error)
        }
        next();
    };

    const getAllUpcomingChallenges = async (req, res, next) => {
        try {
            const response = await challengeService.getAllUpcomingChallenges();
            res.send(response);
        } catch (error) {
            console.log(error)
            next(error)
        }
        next();
    };


    const getAllSkills = async (req, res, next) => {
        try {
            const response = await skillService.getAllSkills();
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
    server.post('/register', register);
    server.post('/user/:userId/sdg', UserController.addSDGs);

    // User
    server.get('/user/:userId/challenges/completed', UserController.getCompletedChallenges);

    // Profile Page
    server.get('/profile/:profileId', UserController.getProfile);

    // Companies
    server.get('/company/:id', getCompany);
    server.get('/company', getAllCompanies);
    server.post('/company', postCompany);
    server.get('/leaderboard/company/:id', getCompanyLeaderBoard);
    //TODO: Change to /company/:id/badge
    server.get('/badges/company/:id', getCompanyBadges);

    server.get('/company/:id/sdg', CompanyController.getCompanySDGs);

    // SDG Endpoints
    server.get('/sdg/:sdgId', getSDG);

    // Challenge Endpoint
    server.post('/addChallengeToUser', addChallengeToUser);
    server.get('/challenge/:challengeId', getChallenge);
    server.get('/challenges/upcoming/:userId', getUpcomingChallenges);
    server.get('/challenges/upcoming', getAllUpcomingChallenges);

    // Skills Endpoint
    server.get('/skills', getAllSkills);

}
