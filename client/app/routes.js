module.exports = function (app) {
  app.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    require('./main/main')($stateProvider);
  });
};
