var restify = require('restify');

/**
 * Server config
 */
const PORT = process.env.PORT || 8080

var server = restify.createServer();

server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

// Routing
require('./routes')(server, restify);

server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});