const restify = require('restify');

const PORT = process.env.PORT || 8080;

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
