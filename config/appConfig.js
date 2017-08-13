'use strict'

const express       = require('express'),
      bodyParser    = require('body-parser'),
      accesslog     = require('access-log'),
      compression   = require('compression'),
      helmet        = require('helmet'),
      morgan        = require('morgan'),
      path          = require('path'),
      fs            = require('fs'),
      rfs           = require('rotating-file-stream'),
      config        = require('config');

module.exports = (app, dirname) => {
  // gzip compression
  app.use(compression());

  // securing the app
  app.use(helmet());

  // Allow cross origin calls
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  var logDirectory = path.join(__dirname, '../log');
  // ensure log directory exists
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
  // create a rotating write stream
  var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
  });
  // setup the logger
  app.use(morgan('combined', {stream: accessLogStream}));

  app.use('/static', express.static('public/tools'));

  app.engine('.html', require('ejs').__express);
  app.set('view engine', 'html');
  app.set('views', dirname + '/public/templates');

  app.listen(config.get("port"));
}
