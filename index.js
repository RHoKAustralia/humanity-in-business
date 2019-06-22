var restify = require('restify');
require('./../db');

const UserService = require('./src/services/UserService')

const PORT = process.env.PORT || 8080

var server = restify.createServer();
server.get('/hello/:name', UserService.respond);
server.head('/hello/:name', UserService.respond);

// Login
server.post('/login', UserService.login);
server.head('/login', UserService.login);

// Register
server.post('/register', UserService.register);
server.head('/register', UserService.register);

server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
