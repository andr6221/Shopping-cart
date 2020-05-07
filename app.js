var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var methodOverride = require('method-override')

//Vi henter vores index-router med NodeJS require funktion
var indexRouter = require('./routes/index');
var userRoutes = require('./routes/user');


var app = express();

mongoose.connect('mongodb://127.0.0.1:27017/shopping', { useNewUrlParser: true, useUnifiedTopology: true });
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Vi sætter al vores middleware op med konfigurationer


app.use(logger('dev'));
//Vi bruger express json, som er et indbygget middleware, der
app.use(express.json());
//Express urlencoded er et middleware som

app.use(express.urlencoded({ extended: false }));
//Validator bruges som middleware til at validere når folk signer op. F.eks. holder den styr at deres email er rigtig og hvor langt passworded skal være.
app.use(validator());
//Node.js kommer med et low-level HTTP setup, her vil node.js sørge for håndteringen af cookies.
app.use(cookieParser());
//Vi "aktiverer" pakken sessions og laver nogle konfigurationer. Sessions gør at der bliver gemt en cookie (med krypteret signartur) på klient siden, vores server kan afhente de rigtige informationer
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180 * 160 * 1000}
}));
//Vi aktiverer flash pakken. Flash er et officielt express middleware der bliver brugt til at flashe beskeder.
app.use(flash());
//Vi sætter vores passport middleware op. Passport hjælper os med at holde styr på om brugeren er logged in, logge ud og se om brugeren er authenticated. Vi initialiserer passport her. Se http://www.passportjs.org/docs/configure/
app.use(passport.initialize());
//Vi aktiverer passport-session modul. Passport kan med session funktionen sørge at, hvis autoriseringen er godkendt, vil en session blive oprretet ved hjælp af cookie.
app.use(passport.session());
//Vi aktiverer vores express static middleware til at gøre vores public filer i public tilgængelige
app.use(express.static(path.join(__dirname, 'public')));

//Middleware der bliver eksekveret ved alle requests, der tjekker om brugeren er autoriseret, der kan bruges i alle views. Gøres ved hjælp af .locals variablen. Herefter bruger vi next for at lade requesten fortsætte.

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

//Vi binder vores express middleware til vores user-API
app.use('/user', userRoutes);

//Vi binder vores app til vores index API
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
