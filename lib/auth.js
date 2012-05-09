var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    db = require('./db'),
    Schema = mongoose.Schema;

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  db.User.findOne(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User.findOne({ username: username }, function (err, user) {
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

