const md5 = require('md5');
const errs = require('restify-errors');
const UserService = require('../services/UserService');
const userService = new UserService();

exports.register = async (req, res, next) => {
    if (req && req.body) {
        try {
            const response = await userService.register(req.body);
            res.send(response);
        } catch (error) {
            //TODO: Return Http 409 on user exists with same email
            console.log(error)
            next(new Error("Failed to register user"))
        }
    } else {
        next(new errs.BadRequestError('Invalid request'));
    }

    next();
}

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



exports.changeCompany = async (req, res, next) => {
    try {
        if (!req.params || !req.params.userId) {
            return next(errs.BadRequestError('Missing userId url parameter'));
        }

        if(!req.body || !req.body.name) {
            return next(errs.BadRequestError('Missing request name body property'));
        }

        const response = await userService.changeCompany(req.params.userId, req.body.name);
        res.send(response);
    } catch (error) {
        console.log(error);
        next(new Error('Request failed !'));
    }
    next();
};

exports.getUserProfile = async (req, res, next) => {
    try {
        const userDetails = await userService.getUserProfile(req.params.userId);
        res.send(userDetails);
    } catch (e) {
        console.log(e);
        next(new Error('Request failed !'));
    }
    next();
};

exports.getUserEvents = async (req, res, next) => {
    try {
        const events = await userService.getUserEvents(req.params.userId);
        res.send(events);
    } catch (e) {
        console.log(e);
        next(new Error('Request failed !'));
    }
    next();
};

exports.updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUserImageUrl(req.body.image_url, req.params.userId);
        res.send(updatedUser);
    } catch (e) {
        console.log(e);
        next(new Error('Request failed !'));
    }
    next();
};