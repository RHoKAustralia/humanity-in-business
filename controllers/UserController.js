var md5 = require('md5');

const errs = require('restify-errors');
var UserService = require('../src/services/UserService');
const userService = new UserService();


exports.login = async function (req, res, next) {
    if (req && req.body) {
        const params = req.body;

        try {
            const result = await userService.login(params.email, md5(params.password));
            if (result.id) {
                res.send(result);
            } else {
                next(new errs.UnauthorizedError('Invalid credentials'))
            }

        } catch (error) {
            next(error)
        }

    } else {
        next(new errs.BadRequestError('Invalid request'));
    }

    next();
};
