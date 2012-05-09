var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSearchSchema = new Schema({
  word: {type: String, lowercase: true},
  created: {type: Date, default: Date.now}
});
exports.UserSearch = mongoose.model('UserSearch', UserSearchSchema);

var UserSchema = new Schema({
  username: {type: String, index: true},
  password: String,
  pastSearches: [UserSearchSchema],
  created: {type: Date, default: Date.now}
});

exports.init = function () {
  mongoose.connect('mongodb://localhost/lexcube');
};
exports.User = mongoose.model('User', UserSchema);



