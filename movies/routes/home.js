var express = require('express');
var router = express.Router();

// Get home page
router.get('/', function(req, res, next){
  Movie.find(function(err, movies){
    if(err) res.json({message: 'Could not find any movies'});
    res.render('home', {movies: movies});
  })
});
















module.exports = router;
