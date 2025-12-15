const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  ratings: [{
    type: Number,
    min: 1,
    max: 5
  }]
});

module.exports = mongoose.model('Book', bookSchema);
