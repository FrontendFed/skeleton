'use strict';

var express = require('express');
var config  = require('./config.json');
var http    = require('http');

//determine env
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
//Server setup
var app     = express();

var server  = http.createServer(app);

if(env === 'development') {
  console.log('App running in development environment');
  var livereload = require('connect-livereload');
  app.use(livereload({port: 35729}));
}

//Serve Application
app.use(express.static(__dirname + '/../public/'));


// This route deals enables HTML5Mode by forwarding missing files to the index.html
 app.all('/*', function(req, res) {
   res.sendFile('index.html',{'root': __dirname + '/../public/'});
 });

//Start Server
exports.run = function () {
  server.listen(config.PORT);
};

//Stop Server
exports.close = function () {
  server.close();
};
