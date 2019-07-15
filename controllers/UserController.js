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

exports.addSDGs = async (req, res, next) => {
    if (req && req.params && req.body) {
        if (req.body.sdg_ids && req.body.sdg_ids.length > 0) {
            try {
                const user_id = req.params.userId
                const sdg_ids = req.body.sdg_ids
                await userService.addSDGs(user_id, sdg_ids);
                res.send({});
            } catch (error) {
                console.log(error)
                next(error);
            }
        } else {
            res.next(new restify.errors.BadRequestError('No SDG Found: Please provide at least one SDG'));
        }
    } else {
        res.next(new restify.errors.BadRequestError('Invalid request'));
    }

    next();
}

