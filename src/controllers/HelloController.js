const HelloService = require('../services/HelloService');
const helloService = new HelloService();

exports.hello = async (req, res, next) => {
    try {
        const response = await helloService.hello(req.params.name);
        res.send(response);
    } catch (error) {
        console.log(error)
        next(error)
    }
    next();
}