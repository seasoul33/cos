var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//var users = require('./routes/users');

var definition = require('./definition');
var authen = require('./authen');
var cookieSession = require('cookie-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var LdapStrategy = require('passport-ldapauth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({ secret: 'keyboard cat',
                        cookie: { maxAge : definition.session_timeout }
                      }));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use(new localStrategy(authen.verify));
passport.use(new LdapStrategy({
    server: {
        url: 'ldap://192.168.1.100',
        bindDn: 'cn=admin,dc=my-domain,dc=com',
        bindCredentials: 'hit68758965',
        searchBase: 'ou=people,dc=my-domain,dc=com',
        searchFilter: '(uid={{username}})'
    }})
);

app.post('/login',
    passport.authenticate(['ldapauth','local'], { session: true,
                                    //successRedirect: '/index',
                                    // failureRedirect: '/',
                                    failWithError: true}),
    function(req, res, next) {
        req.session.passport.flag = 1;
        req.session.passport.starttime = Date.now();

        // sync user data from LDAP to local if necessary in the future

        res.redirect('/index');
    },
    function(err, req, res, next) {

        // handle error message

        res.render('login', { title: 'Login to Circle of Safety',
                              ErrMsg: 'Username/Password incorrect...'
                            });
    }
);

/* GET login page. */
app.get('/', function(req, res, next) {
    res.render('login', { title: 'Login to Circle of Safety'});
});

app.use(function(req, res, next) {
    
    if( (req.session.passport == undefined) ||
        (req.session.passport.flag != 1) ||
        (req.user == undefined) ) {
        res.render('login', { title: 'Login to Circle of Safety',
                              ErrMsg: 'Please login first...'
                            });
        return;
    }

    if( (Date.now() - req.session.passport.starttime) > definition.session_timeout) {
        //console.log('timeout');
        res.render('login', { title: 'Login to Circle of Safety',
                              ErrMsg: 'session timeout'
                            });
        return;
    }

    // console.log(req.user);
    req.session.passport.starttime = Date.now();
    next();
});

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
