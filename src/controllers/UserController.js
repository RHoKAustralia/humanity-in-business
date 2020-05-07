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
            console.log(error);
            next(new Error("Failed to register user"))
        }
    } else {
        next(new errs.BadRequestError('Invalid request'));
    }

    next();
};

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



exports.updateJobDetails = async (req, res, next) => {
    try {
        if (!req.params || !req.params.userId) {
            return next(new errs.BadRequestError('Missing userId url parameter'));
        }

        if(!req.body || !req.body.company_name) {
            return next(new errs.BadRequestError('Missing request company_name body property'));
        }

        if(!req.body || !req.body.title) {
            return next(new errs.BadRequestError('Missing request body title parameter'));
        }

        const response = await userService.updateJobDetails(req.params.userId, req.body.company_name, req.body.title);
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

exports.updateHibDetails = async (req, res, next) => {
    try {
        if(!req.body || !req.body.why_join_hib) {
            return next(new errs.BadRequestError('Missing why_join_hib property in request body'));
        }
        if(!req.body.yearly_days_pledged) {
            return next(new errs.BadRequestError('Missing yearly_days_pledged property in request body'));
        }
        if(!req.body.yearly_donations_pledge) {
            return next(new errs.BadRequestError('Missing yearly_donations_pledge property in request body'));
        }
        const hibDetails = {
            whyJoinHib: req.body.why_join_hib,
            yearlyDaysPledged: req.body.yearly_days_pledged,
            yearlyDonationsPledge: req.body.yearly_donations_pledge,
        }
        const updatedUser = await userService.udpdateHibDetails(req.params.userId, hibDetails);
        res.send(updatedUser);
    } catch (e) {
        console.log(e);
        next(new Error('Request failed !'));
    }
    next();
};

exports.getCommunities = async (req, res, next) => {
    try {
        const communities = await userService.getUserCommunities(req.params.userId);
        res.send(communities);
    } catch (e) {
        console.log(e);
        next(new Error('Request failed !'));
    }
    next();
};
