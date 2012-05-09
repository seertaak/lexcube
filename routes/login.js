var passport = require('passport');

exports.get = function(req, res) {
  var msgs = req.flash('error');
  res.render('login', { title: 'wordcube', messages: msgs, user: req.user });
};


exports.post = function(req, res) {
  if ('createAcct' in req.body) {
    console.log("createAcct: " + req.body.username + ":" + req.body.password);
    db.User.find({username: req.body.username}, function (err, docs) {
      if (docs.length) {
        // we can't use this username, as it's already taken: send a flash
        // message to the user to this effect.
        //console.log("MPD: " + JSON.stringify(docs));
        req.flash('error', 'User already exists; please use a different username.');
        res.redirect('/login');
      } else {
        console.log("MPD: No such user");
        var user = new db.User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.save(function (err) {
          if (err) {
            console.log("Error while trying to save user: " + JSON.stringify(user) + ":" + err);
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
    console.log("MPD: attempting to log in.");
    passport.authenticate('local', { successRedirect: '/',
      failureRedirect: '/login', failureFlash: true })(req, res);
  }
};


