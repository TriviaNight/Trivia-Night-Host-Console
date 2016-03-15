console.log('hello from controllers');
app.controller('LandingController', ['$scope', function($scope){
  console.log('in LandingController');
}]);

app.controller('DashboardController', ['$scope', function($scope){
  console.log('in dashboard');
}]);

app.controller('AuthController', ['$stateParams', '$localStorage', '$location', function($stateParams, $localStorage, $location){
  //Get token out of header and set in local storage
  console.log($stateParams);
  $localStorage.token = $stateParams.token;
  $location.path('/dashboard');
}]);
