
/**
 * Module dependencies.
 */

var express = require('express'), 
    routes = require('./routes'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    stylus = require('stylus'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, index: true},
  hashed_password: String,
  created: {type: Date, default: Date.now}
});

mongoose.connect('mongodb://localhost/lexcube');

var User = mongoose.model('User', UserSchema);

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  User.findOne(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      } else if (!user) {
        return done(null, false, { message: 'Unknown user' });
      } else if (user.password !== password) {
        return done(null, false, { message: 'Invalid password' });
      } else {
        return done(null, user);
      }
    });
  }
));

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

// Routes
app.get('/', routes.index);
app.get('/lookup', routes.lookup);
app.get('/login', routes.login);
app.post('/login', function(req, res) {
    if ('createAcct' in req.body) {
      //console.log("createAcct: " + req.body.username + ":" + req.body.password);
      User.find({username: req.body.username}, function (err, docs) {
        if (docs.length) {
          // we can't use this username, as it's already taken: send a flash
          // message to the user to this effect.
          //console.log("MPD: " + JSON.stringify(docs));
          req.flash('error', 'User already exists; please use a different username.');
          res.redirect('/login');
        } else {
          //console.log("MPD: No such user");
          var user = new User();
          user.username = req.body.username;
          user.password = req.body.password;
          user.save(function (err) {
            if (err) {
              //console.log("Error while trying to save user: " + JSON.stringify(user) + ":" + err);
              req.flash('error', 'Oops, there was a problem: please try again!');
              res.redirect('/login');
            } else {
              passport.authenticate('local', { successRedirect: '/',
                failureRedirect: '/login', failureFlash: true })(req, res);
            }
          });
        }
      });
    } else {
      //console.log("MPD: attempting to log in.");
      passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login', failureFlash: true })(req, res);
    }
});


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
