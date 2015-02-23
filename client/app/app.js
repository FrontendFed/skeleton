var angular = require('angular');

var app = angular.module('basedelfuego', [
  require('angular-ui-router')
]);

require('./controllers')(app);
require('./routes')(app);
