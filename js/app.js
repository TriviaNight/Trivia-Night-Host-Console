console.log('hello from app');
var app = angular.module('HostConsole', ['ui.router','ngStorage']);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider
      .state('login', {
          url: '/',
          templateUrl: 'partials/landing.html',
          controller: 'LandingController'
      })
      .state('authenticate', {
          url: '/authenticate/:token',
          templateUrl: 'partials/authenticate.html',
          controller: 'AuthController'
      })
      .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'partials/dashboard.html',
          controller: 'DashboardController'
      });



    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
       return {
           'request': function (config) {
               config.headers = config.headers || {};
               if ($localStorage.token) {
                   config.headers.token = $localStorage.token;
               }
               return config;
           },
           'responseError': function (response) {
               if (response.status === 401 || response.status === 403) {
                   $location.path('/');
               }
               return $q.reject(response);
           }
       };
    }]);
}]);
