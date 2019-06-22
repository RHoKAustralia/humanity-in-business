class UserService {
    respond(req, res, next) {
        res.send('hello ' + req.params.name);
        next();
    }

    login(req, res, next) {
        console.log(req);
        res.send('hello ' + req.params.name);
        next();
    }

    register(req, res, next) {
        console.log(req);
        res.send('hello ' + req.params.name);
        next();
    }
}

export default UserService;
