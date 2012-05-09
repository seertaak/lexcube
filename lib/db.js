var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, index: true},
  password: String,
  created: {type: Date, default: Date.now}
});

exports.init = function () {
  mongoose.connect('mongodb://localhost/lexcube');
};
exports.User = mongoose.model('User', UserSchema);



