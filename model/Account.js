const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    useremail: String,
    password: String,
    Name: String,
    lastAuthentication: Date,
    isOauthAccount : Boolean,
});

module.exports = mongoose.model('accounts', accountSchema);
