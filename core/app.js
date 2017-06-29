var express = require('express');
var path = require('path');
var config = require('./config/config');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require(path.join(config.rootPath, 'core/routes/index'));
var users = require(path.join(config.rootPath, 'core/routes/users'));
var userRouter = require('./routes/userRouter.js');

var app = express();

// view engine setup
app.set('views', path.join(config.rootPath, 'core/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(config.rootPath, config.staticPath)));

var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

app.use(myLogger);

app.use('/pug', routes);
//app.use('/users', users);
app.use('/api/usuarios', userRouter);

//===============ERROR RENDERING BEGIN ==================
// catch 404 and forward to error handler

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log('modo PRODUCTION')
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//============= end error handling ========================


module.exports = app;
