var proxy = require('http-proxy-middleware');
var options = {
    target: process.env.PROXY_HOST, // target host
    changeOrigin: false, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
    },
    router: {
      // when request.headers.host == 'dev.localhost:3000',
      // override target 'http://www.example.org' to 'http://localhost:8000'
      // 'dev.localhost:3000': 'http://localhost:8000'
    }
};
var kibanaProxy = proxy(options);

var proxy = require('express-http-proxy');

module.exports = function(app, passport) {

    // normal routes ===============================================================
        app.get('/favicon.ico', function(req, res){
            res.status(404).send('Not found');
        });
        // show the home page (will also have our login links)
        app.get('/login', function(req, res) {
            var resData = {message: req.flash('flash')};
            if (req.query._next != undefined){
                resData._next = encodeURIComponent(req.query._next);
                req.session._next = encodeURIComponent(req.query._next);
            }
            res.render('index.njk', resData);
        });

    
        // PROFILE SECTION =========================
        app.get('/profile', isLoggedIn, function(req, res) {
            res.render('profile.njk', {
                user : req.user,
                message: req.flash('flash')
            });
        });
    
        // LOGOUT ==============================
        app.get('/logout', function(req, res) {
            req.logout();
            delete req.session._next ;
            req.flash('flash', 'You have been logged out.');
            res.redirect('/login');
        });
    
    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================
    
        // locally --------------------------------
            // LOGIN ===============================
            // show the login form
            // app.get('/login', function(req, res) {
            //     res.render('login.ejs', { message: req.flash('loginMessage') });
            // });
    
            // process the login form
            // app.post('/login', passport.authenticate('local-login', {
            //     successRedirect : '/profile', // redirect to the secure profile section
            //     failureRedirect : '/login', // redirect back to the signup page if there is an error
            //     failureFlash : true // allow flash messages
            // }));
    
            // SIGNUP =================================
            // show the signup form
            // app.get('/signup', function(req, res) {
            //     res.render('signup.ejs', { message: req.flash('signupMessage') });
            // });
    
            // process the signup form
            // app.post('/signup', passport.authenticate('local-signup', {
            //     successRedirect : '/profile', // redirect to the secure profile section
            //     failureRedirect : '/signup', // redirect back to the signup page if there is an error
            //     failureFlash : true // allow flash messages
            // }));
    
        // facebook -------------------------------
    
            // send to facebook to do the authentication
            // app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));
    
            // handle the callback after facebook has authenticated the user
            // app.get('/auth/facebook/callback',
            //     passport.authenticate('facebook', {
            //         successRedirect : '/profile',
            //         failureRedirect : '/'
            //     }));
    
        // twitter --------------------------------
    
            // send to twitter to do the authentication
            // app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
    
            // handle the callback after twitter has authenticated the user
            // app.get('/auth/twitter/callback',
            //     passport.authenticate('twitter', {
            //         successRedirect : '/profile',
            //         failureRedirect : '/'
            //     }));
    
    
        // google ---------------------------------
    
            // send to google to do the authentication
            app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    
            // the callback after google has authenticated the user
            app.get('/auth/google/callback', passport.authenticate('google', {
                    // successRedirect : '/',
                    failureRedirect : '/login'
            }), function(req, res){
                res.redirect(decodeURIComponent(req.session._next || '/'));
                delete req.session._next;
            });

    
    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================
    
        // locally --------------------------------
            // app.get('/connect/local', function(req, res) {
            //     res.render('connect-local.ejs', { message: req.flash('loginMessage') });
            // });
            // app.post('/connect/local', passport.authenticate('local-signup', {
            //     successRedirect : '/profile', // redirect to the secure profile section
            //     failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            //     failureFlash : true // allow flash messages
            // }));
    
        // facebook -------------------------------
    
            // send to facebook to do the authentication
            // app.get('/connect/facebook', passport.authorize('facebook', { scope : ['public_profile', 'email'] }));
    
            // // handle the callback after facebook has authorized the user
            // app.get('/connect/facebook/callback',
            //     passport.authorize('facebook', {
            //         successRedirect : '/profile',
            //         failureRedirect : '/'
            //     }));
    
        // twitter --------------------------------
    
            // send to twitter to do the authentication
            // app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));
    
            // handle the callback after twitter has authorized the user
            // app.get('/connect/twitter/callback',
            //     passport.authorize('twitter', {
            //         successRedirect : '/profile',
            //         failureRedirect : '/'
            //     }));
    
    
        // google ---------------------------------
    
            // send to google to do the authentication
            app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));
    
            // the callback after google has authorized the user
            app.get('/connect/google/callback',
                passport.authorize('google', {
                    successRedirect : '/',
                    failureRedirect : '/login'
                }));
    
    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future
    
        // local -----------------------------------
        // app.get('/unlink/local', isLoggedIn, function(req, res) {
        //     var user            = req.user;
        //     user.local.email    = undefined;
        //     user.local.password = undefined;
        //     user.save(function(err) {
        //         res.redirect('/profile');
        //     });
        // });
    
        // facebook -------------------------------
        // app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        //     var user            = req.user;
        //     user.facebook.token = undefined;
        //     user.save(function(err) {
        //         res.redirect('/profile');
        //     });
        // });
    
        // twitter --------------------------------
        // app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        //     var user           = req.user;
        //     user.twitter.token = undefined;
        //     user.save(function(err) {
        //         res.redirect('/profile');
        //     });
        // });
    
        // google ---------------------------------
        app.get('/unlink/google', isLoggedIn, function(req, res) {
            var user          = req.user;
            user.google.token = undefined;
            user.save(function(err) {
                res.redirect('/');
            });
        });

        // Proxy settings ==============================================================
        app.use('/', 
            [isLoggedIn, proxy(process.env.PROXY_HOST || 'http://localhost:5601')]
        );
    };
    
    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        let _next = '';
        if (req.path.search('/login') == -1 || req.path.search('/') == -1 ) {
            res.redirect( '/login?_next='+ encodeURIComponent(req.path) );
            return;
        }
        res.redirect('/login');
    }