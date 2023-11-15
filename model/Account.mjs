import mongoose from 'mongoose';

const { Schema } = mongoose;

const accountSchema = new Schema({
  useremail: String,
  password: String,
  Name: String,
  lastAuthentication: Date,
  isOauthAccount: Boolean,
  friend_waiting_list: [{ type: String}],
  friend_list: [{ type: String}],
  });

export default mongoose.model('accounts', accountSchema);
