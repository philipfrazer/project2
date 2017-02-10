var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new mongoose.Schema({
  title:  String,
  poster: String
});

module.exports = mongoose.model('Movie', MovieSchema);
