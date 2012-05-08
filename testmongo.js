var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  created: {type: Date, default: Date.now}
});

mongoose.connect('mongodb://localhost/lexcube');
var User = mongoose.model('User', UserSchema);

var test = new User();
test.username = 'mpercossi';
test.password = 'foobar';
test.save(function (err) {
  console.log("Oh fuck: " + err);
});

