var mongoose = require('mongoose');
var passportLocalMongoos = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoos);

var User = mongoose.model("User", userSchema);

module.exports = User;