
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = Schema({
  id:       { type: ObjectId },
  username: { type: String },
  hash:     { type: String },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
