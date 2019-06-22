var restify = require('restify');

const PORT = process.env.PORT || 8080

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

function login(req, res, next) {
  console.log(req);
  res.send('hello ' + req.params.name);
  next();
 }
 
 function register(req, res, next) {
   console.log(req);
   res.send('hello ' + req.params.name);
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