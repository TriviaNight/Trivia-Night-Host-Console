console.log('hello from controllers');
app.controller('LandingController', ['$scope', function($scope){
  console.log('in LandingController');
}]);

app.controller('DashboardController', ['$scope', function($scope){
  console.log('in dashboard');
  var socket = io('http://localhost:3000/')
  socket.on('message', function(message){
    console.log(message);
  })
  $scope.$on("$destroy", function(){
    socket.disconnect();
  });
  $scope.createGame = function(game){
    console.log('createing game')
    console.log(game)
    socket.emit('createGame', game)
  }
  $scope.askQuestion = function(question){
    console.log(question);
    socket.emit('ask question', question);
  }
  $scope.game = {};
  $scope.game.numberOfRounds = 5;
  $scope.game.questionTime = 8;
  $scope.game.name = 'my game';
  $scope.game.password = 'password';
  $scope.game.hostID = 1;
  var content = {
    question: 'what is you favorite color',
    choice: {}
  };
  content.choice.A = 'blue';
  content.choice.B = 'red';
  content.choice.C = 'green';
  content.choice.D = 'black';
  content.choice.E = 'im not sure';
  content.round = 1;

  $scope.question = {};
  $scope.question.content = content;

  $scope.question.hostID = 1;
  $scope.question.correctAnswer = 'A';
  $scope.question.id = 1;

}]);

app.controller('AuthController', ['$stateParams', '$localStorage', '$location', function($stateParams, $localStorage, $location){
  //Get token out of header and set in local storage
  console.log($stateParams);
  $localStorage.token = $stateParams.token;
  $location.path('/dashboard');
}]);

app.controller('GameController', ['$scope', function($scope){
  console.log('in dashboard');
  var socket = io('http://localhost:3000/')
  socket.on('message', function(message){
    console.log(message);
  })
  socket.on('question', function(question){
    console.log(question);
    $scope.players = {}
    $scope.question = question;
    $scope.$apply();
  })
  socket.on('round over', function(players){
    console.log(players);
    $scope.players = players
    $scope.question = {}
    $scope.$apply();
  })
  $scope.$on("$destroy", function(){
    socket.disconnect();
  });
  $scope.joinGame = function(){
    console.log('joining game')
    console.log($scope.game)
    socket.emit('joinGame', $scope.game)
  }

  $scope.submitResponse = function(key){
    $scope.game.response = key;
    $scope.game.round = $scope.question.round;
    console.log($scope.game);
    socket.emit('answer', $scope.game);
  }
  $scope.game = {};
  $scope.game.userID = 1;
  $scope.game.imgURL = 'https://lh5.googleusercontent.com/-z8Rv5svpDoU/AAAAAAAAAAI/AAAAAAAAAVM/hR5eR81ACX8/photo.jpg?sz=50'
}]);
