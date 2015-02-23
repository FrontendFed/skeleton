module.exports = function ($stateProvider) {
  $stateProvider.state('main', {
    url: '/',
    templateUrl: './main/main.html',
    controller: 'MainController'
  });
};
