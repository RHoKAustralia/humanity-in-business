var restify = require('restify');

const UserService = require('./src/services/UserService');

const userService = new UserService();

const PORT = process.env.PORT || 8080

const respond = async (req, res, next) => {
  const response = await userService.respond(req.params.name);
  res.send(response);
  next();
}

const login = async (req, res, next) => {
  const response = await userService.login('username', 'password');
  res.send('login ' + response);
  next();
}

const register = async (req, res, next) => {
  const response = await userService.register({username: 'test'});
  res.send('register ' + response);
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
