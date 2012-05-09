
// Module dependencies.
// 
var express = require('express'), 
    routes = require('./routes'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    stylus = require('stylus'),
    Schema = mongoose.Schema,
    db = require('./lib/db'),
    passp = require('./lib/auth');

// Initialize the db and models
db.init();

var app = module.exports = express.createServer();

// Configuration
//
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'aguilarobbe' }));
  app.use(passport.initialize());
  app.use(passport.session());
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

app.get('/login', routes.login.get);
app.post('/login', routes.login.post);

// Routes
app.get('/', routes.index);
app.get('/lookup', routes.lookup);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
