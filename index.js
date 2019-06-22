var restify = require('restify');

const PORT = process.env.PORT || 8080

var server = restify.createServer();

server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Routing
require('./routes')(server, restify);

server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
