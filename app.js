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
var results = require('./routes/results');
var search  = require('./routes/search');
var Movie   = require('./models/movie');

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
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

// app.use('/user', user);
app.use('/results', results);
app.use('/search', search);

//ROUTE - Secret page
app.get('/secret', isLoggedIn, function(req, res){
  res.render('secret');
});

//Auth Routes
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
          res.redirect('/secret');
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
  successRedirect: '/secret',
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
