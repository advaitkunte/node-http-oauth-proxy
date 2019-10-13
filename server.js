// server.js

// set up ======================================================================
// get all the tools we need

require('dotenv').config()

const app  = require('express')();
const port     = process.env.PORT || 9000;
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
const nunjucks = require('nunjucks')

const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);


var configDB = require('./config/database.js');




// configuration ===============================================================
mongoose.connect(configDB.url, {useNewUrlParser: true}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

var store = new MongoDBStore({
    uri: configDB.url_sessions,
    collection: 'sessions'
});

store.on('error', function(error) {
    console.error(error);
});

// required for passport
app.use(session({
    secret: process.env.PASSPORT_SESSION_SECRET || '-----------', // session secret
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, /* 1 day */
    name: process.env.NODE_ENV != 'production' ? 'session-id-local' : 'session-id',
    proxy: true,
    store: store
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
