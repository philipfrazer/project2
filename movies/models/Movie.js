var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new mongoose.Schema({
  original_title:  String,
  poster_path:     String
});

module.exports = mongoose.model('Movie', MovieSchema);
