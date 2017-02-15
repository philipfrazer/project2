var express = require('express');
var router = express.Router();
var Movie =  require('../models/Movie');

// Get home page
router.get('/', function(req, res){
  Movie.find({})
    .then(function(movies) {
      console.log(movies);
      res.render('home', {
        movies: movies
      });
    });
});

router.get('/:id', function(req, res){
  res.send(req.params.id);
});

router.delete('/:id', function(req, res, next) {
    Movie.findById(req.params.id)
        .then(function(movie) {
            return movie.remove();
        })
        .then(function() {
            res.redirect('/home');
        })
        .catch(function(err) {
            return next(err);
        });
});

















module.exports = router;
