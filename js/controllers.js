console.log('hello from controllers');
app.controller('LandingController', ['$scope', function($scope){
  console.log('in LandingController');
}])

app.controller('DashboardController', ['$scope', function($scope){
  console.log('in dashboard');
}])
