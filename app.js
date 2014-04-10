// dependencies
var fs = require('fs');
var http = require('http');
var express = require('express');
var routes = require('./routes');
var path = require('path');
var mongoose = require('mongoose');

var config = require('./oauth.js')
var mongoose = require('mongoose')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

// global config
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// env config
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// mongo config
var MONGOLAB_URI= "add_your_mongolab_uri_here"
var mongo = process.env.MONGOLAB_URI || 'mongodb://localhost/node-bootstrap3-template'
mongoose.connect(mongo);


// routes
app.get('/', routes.index);

// run server
app.listen(app.get('port'), function(){
  console.log('\nExpress server listening on port ' + app.get('port'));
});

// serialize and deserialize
passport.serializeUser(function(user, done) {
done(null, user);
});
passport.deserializeUser(function(obj, done) {
done(null, obj);
});

// config
passport.use(new FacebookStrategy({
 clientID: config.facebook.clientID,
 clientSecret: config.facebook.clientSecret,
 callbackURL: "https://play.google.com/store/apps/details?id=com.digitext&hl=en"
},
function(accessToken, refreshToken, profile, done) {
 process.nextTick(function () {
   return done(null, profile);
 });
}
));

passport.use(new TwitterStrategy({
 consumerKey: config.twitter.consumerKey,
 consumerSecret: config.twitter.consumerSecret,
 callbackURL: "https://play.google.com/store/apps/details?id=com.digitext&hl=en"
},
function(accessToken, refreshToken, profile, done) {
 process.nextTick(function () {
   return done(null, profile);
 });
}
));

var app = express();

app.configure(function() {
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: '714b67e18985319d4db8471c717dd97b' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
});

// routes
app.get('/', routes.index);

app.get('/', function(req, res){
res.render('login', { user: req.user });
});

app.get('/auth/facebook',
passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/logout', function(req, res){
req.logout();
res.redirect('/');
});

app.get('/auth/twitter',
passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/logout', function(req, res) {
req.logout();
});
// port
http.createServer(app).listen(3000);

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/')
}