var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    'username': String,
    'password': String,
    'studentId': String,
    'phoneNumber': String,
    'email': String
});

mongoose.model('User', userSchema);