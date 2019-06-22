var restify = require('restify');
require('./db');

const UserService = require('./src/services/UserService');

const userService = new UserService();

const PORT = process.env.PORT || 8080

function respond(req, res, next) {
  const response = userService.respond(req.params.name);
  res.send(response);
  next();
}

function login(req, res, next) {
  res.send('login ' + userService.login('username', 'password'));
  next();
}

function register(req, res, next) {
  res.send('register ' + userService.register({username: 'test'}));
  next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

// Login
server.post('/login', login);
server.head('/login', login);

// Register
server.post('/register', register);
server.head('/register', register);

server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
