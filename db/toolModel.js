
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ToolSchema = Schema({
  name:   { type: String, required: true, unique: true},
  amount: { type: Number/*,   required: true */},
  id:     { type: ObjectId/*, required: true */}
});

const Tool = mongoose.model('Tool', ToolSchema);

module.exports = Tool;