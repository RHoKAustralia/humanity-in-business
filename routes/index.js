const UserService       = require('../src/services/UserService');
const CompanyService    = require('../src/services/CompanyService');
const SDGService        = require('../src/services/SDGService'); 
const ChallengeService  = require('../src/services/ChallengeService');
const SkillService      = require('../src/services/SkillService');

const userService       = new UserService();
const companyService    = new CompanyService();
const sdgService        = new SDGService();
const challengeService  = new ChallengeService();
const skillService      = new SkillService();

var UserController = require('../controllers/UserController');

module.exports = function (server, restify) {

    const respond = async (req, res, next) => {
        const response = await userService.respond(req.params.name);
        res.send(response);
        next();
    }

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

            const response = await userService.register(userData);

            res.send({ response: `Response: ${response}` });
        } else {
            res.send(400, { response: `Invalid request:  ${JSON.stringify(req.body)}` });
        }

        next();
    }

    // Companies
    const getCompany = async (req, res, next) => {
        const response = await companyService.getCompany(req.params.id);
        res.send({ response: response });
        next();
    }

    const postCompany = async (req, res, next) => {
        if (req && req.body) {
            const companyData = {
                name: req.body.name || 'Default name',
                url: req.body.url || 'Default URL',
            };

            const response = await companyService.insert(companyData);

            res.send({ response: `Response: ${response}` });
        } else {
            res.send(400, { response: `Invalid request:  ${JSON.stringify(req.body)}` });
        }

        next();
    }

    const getAllCompanies = async (req, res, next) => {
        const response = await companyService.getAllCompanies();
        res.send({ response: response });
        next();
    }

    const getCompanyLeaderBoard = async (req, res, next) => {
        const response = await companyService.getCompanyLeaderBoard(req.params.id);
        res.send({ response: response });
        next();
    }

    const getCompanyBadges = async (req, res, next) => {
        const response = await companyService.getBadges(req.params.id);
        res.send({ response: response });
        next();
    }

    const getCompanySDGs = async (req, res, next) => {
        const response = await companyService.getSDGs(req.params.id);
        res.send({ response: response });
        next();
    }

    const getProfile = async (req, res, next) => {
        const response = await userService.getProfile(req.params.profileId);
        res.send(response);
        next();
    }

    const getSDG = async (req, res, next) => {
        const response = await sdgService.getSDG(req.params.sdgId);
        res.send(response);
        next();
    }

    const addSDG = async (req, res, next) => {
        if (req && req.body) {
            const sdgData = {
                user_id: req.body.user_id || 1,
                sdg_ids: req.body.sdg_ids || []
            };

            const response = await sdgService.addSDG(sdgData);

            res.send({ response: response});
        } else {
            res.send(400, { response: `Invalid request:  ${JSON.stringify(req.body)}` });
        }

        next();

    }

    const addChallengeToUser = async (req, res, next) => {
        if (req && req.body) {
            const challengeData = {
                user_id: req.body.user_id || 1,
                challenge_id: req.body.challenge_id || 1
            };

            const response = await challengeService.addChallengeToUser(challengeData);

            res.send({ response: response});
        } else {
            res.send(400, { response: `Invalid request:  ${JSON.stringify(req.body)}` });
        }

        next();
    }

    const getChallenge = async (req, res, next) => {
        const response = await challengeService.getChallenge(req.params.challengeId);
        res.send(response);
        next();
    }

    const getUpcomingChallenges = async (req, res, next) => {
        const response = await userService.getUpcomingChallenges(req.params.userId);
        res.send(response);
        next();
    };

    const getAllSkills = async (req, res, next) => {
        const response = await skillService.getAllSkills();
        res.send({ response: response });
        next();
    }

    // Test
    server.get('/hello/:name', respond);

    // Login
    server.post('/login', UserController.login);

    // Register
    server.post('/register', register);

    // Companies
    server.get('/company/:id', getCompany);
    server.get('/company', getAllCompanies);
    server.post('/company', postCompany);
    server.get('/leaderboard/company/:id', getCompanyLeaderBoard);
    server.get('/badges/company/:id', getCompanyBadges);
    server.get('/sdgs/company/:id', getCompanySDGs);

    // Profile Page
    server.get('/profile/:profileId', getProfile);

    // SDG Endpoints
    server.get('/sdg/:sdgId', getSDG);
    server.post('/addSDG', addSDG);

    // Challenge Endpoint
    server.post('/addChallengeToUser', addChallengeToUser);
    server.get('/challenge/:challengeId', getChallenge);
    server.get('/challenges/upcoming/:userId', getUpcomingChallenges);

    // Skills Endpoint
    server.get('/skills', getAllSkills);

}
