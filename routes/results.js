var express = require('express');
var router = express.Router();
var request = require('request');
var debug = require('debug')('movies');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

router.get('/', function(req, res, next){
  var query = req.query.search;
  var url = "http://omdbapi.com/?s=" + query;
  debug('about to search omdbapi with url =', url);

  request(url, function(error, response, body){
    debug('got response from omdbapi');
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.render("results", {data: data});
    }
    else if (error) {
      return next(error);
    }
    else {
      return next(makeError(res, 'Bad status from omdbapi = ' + response.statusCode, 500));
    }
  });
});

module.exports = router;
