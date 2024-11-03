// backend/models/Template.js
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  droppedItems: { type: Array, required: true },
});

module.exports = mongoose.model('Template', templateSchema);
