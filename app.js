
/**
 * Module dependencies.
 */

var express = require('express'), 
    routes = require('./routes'),
    stylus = require('stylus');

var app = module.exports = express.createServer();

// Configuration
//

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(stylus.middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/lookup', routes.lookup);
app.get('/login', routes.login);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
