
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const VerktygSchema = Schema({
  name:   { type: String/*,   required: true */},
  amount: { type: Number/*,   required: true */},
  id:     { type: ObjectId/*, required: true */}
});

const Verktyg = mongoose.model('Verktyg', VerktygSchema);

module.exports = Verktyg;