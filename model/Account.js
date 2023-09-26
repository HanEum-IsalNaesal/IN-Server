const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    useremail: String,
    password: String,
    Name: String,
    lastAuthentication: Date,
    isOauthAccount : Boolean,
    friend_waiting_list : [{type: mongoose.Schema.ObjectId, ref:'User'}],
    friend_list : [{type: mongoose.Schema.ObjectId, ref:'User' }],
});

module.exports = mongoose.model('accounts', accountSchema);
