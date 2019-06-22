var md5 = require('md5');

var UserService = require('../src/services/UserService');
const userService = new UserService();

exports.login = async function(req, res, next) {

    // TODO validate parameters
    var params = req.body;

    const success = await userService.login(params.email, md5(params.password));
    
    res.send({'success':success});
    next();
};
