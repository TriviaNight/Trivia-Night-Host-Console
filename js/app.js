var app = angular.module('trivapp', ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngStorage']);

app.run(function($rootScope, $location) {
    $rootScope.location = $location;
});
/**
 * Route configuration for the RDash module.
 */
angular.module('trivapp').config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboard.html',
                controller: 'DashboardController',
                abstract: true,
            })
            .state('authenticate', {
                url: '/authenticate/:token',
                templateUrl: 'templates/authenticate.html',
                controller: 'AuthController'
            })
            .state('dashboard.index', {
                url: '',
                templateUrl: 'templates/dashboardIndex.html'
            })
            .state('mockgame', {
                url: '/game',
                templateUrl: 'templates/mockgameroom.html',
                controller: 'PlayGameController'
            })
            .state('HostGame', {
                url: '/host',
                templateUrl: 'templates/HostGame.html',
                controller: 'HostGameController'
            })
            .state('dashboard.decks', {
                url: '/decks',
                templateUrl: 'templates/decks.html',
                controller: 'DecksController',
            })
            .state('dashboard.questions', {
                url: '/questions',
                templateUrl: 'templates/questions.html',
                controller: 'QuestionsController',
            })
            .state('dashboard.statistics', {
                url: '/statistics',
                templateUrl: 'templates/statistics.html',
                controller: 'StatisticsController',
            })
            .state('login', {
                url: '/',
                templateUrl: 'templates/landing.html',
                controller: 'LandingController'
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
