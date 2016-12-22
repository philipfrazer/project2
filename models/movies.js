var mongoose = require('mongoose');


var MovieSchema = new mongoose.Schema({
  username: String,
  password: String

Title: String,
Year: Number,
imdbID: String,
Poster: String
});


module.exports = mongoose.model('Movie', MovieSchema);
