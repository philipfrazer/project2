var express               = require('express');
var path                  = require('path');
var favicon               = require('serve-favicon');
var logger                = require('morgan');
var cookieParser          = require('cookie-parser');
var bodyParser            = require('body-parser');
var request               = require('request');
var mongoose              = require('mongoose');
var passport              = require('passport');
var LocalStrategy         = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

var index   = require('./routes/index');
var User    = require('./models/user');
var Movie   = require('./models/Movie');
var results = require('./routes/results');
var search  = require('./routes/search');
var home    = require('./routes/home');

mongoose.connect('mongodb://localhost/movies-app');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('express-session')({
  secret: "I have no idea what im doing",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

// app.use('/user', user);
app.use('/results', results);
app.use('/search', search);

//ROUTE - Home page
app.get('/home', isLoggedIn, function(req, res){
  res.render('home');
});

//Auth Routes & Auth function

function authenticate(req, res, next) {
    if(!req.isAuthenticated()) {
        req.flash('error', 'Please signup or login.');
        res.redirect('/');
    } else {
        next();
    }
}

//Show sign up form
app.get('/register', function(req, res){
  res.render('register');
});

//Handling user sign up
app.post('/register',function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
          console.log(err);
          return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
          res.redirect('/home');
        });
    });
});

//Login routes
//Render login form
app.get('/login', function(req, res){
  res.render('login');
});

//login logic
//middleware
app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login'
}) ,function(req, res){
});

//Logout function
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
}
// NOT WORKING
//Get list of movies on /home page
app.get('/', function(req, res, next) {
    Movie.find({})
        .then(function(movies) {
            res.render('home', {
                movies: movies
            });
        })
        .catch(function(err) {
            return next(err);
        });
});

// CREATE
app.post('/', function(req, res, next) {
  var movie = new Movie({
    user:               req.user,
    original_title:     req.body.original_title,
    poster_path:        req.body.poster_path

  });
  movie.save()
    .then(function() {
      res.redirect('/home');
  })
  .catch(function(err) {
    return next(err);
  });
});


// DESTROY
app.delete('/:id', function(req, res, next) {
    Movie.findById(req.params.id)
        .then(function(post) {
            if (!movie.user.equals(currentUser.id)) return next(makeError(res, 'This does not belong to you!', 401));
            return movie.remove();
        })
        .then(function() {
            res.redirect('/home');
        })
        .catch(function(err) {
            return next(err);
        });
});


// SHOW

app.get('/:id', function(req, res, next) {
    Movie.findById(req.params.id)
        .then(function(post) {
            if (!movie) {
                return next(makeError(res, 'Document not found', 404));
            }
            res.render('movies/show', {
                movie: movie
            });
        })
        .catch(function(err) {
            return next(err);
        });
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
