
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const SessionSchema = Schema({
  id:         { type: ObjectId },
  session_id: { type: String },
  token:      { type: String },
  user:       { type: String },
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
