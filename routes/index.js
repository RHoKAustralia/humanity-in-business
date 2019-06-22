const UserService = require('../src/services/UserService');
const CompanyService = require('../src/services/CompanyService');

const userService = new UserService();
const companyService = new CompanyService();

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

    const getProfile = async (req, res, next) => {
        const response = await userService.getProfile(req.params.profileId);
        res.send(response);
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

    // Profile Page
    server.get('/profile/:profileId', getProfile);
}
