

/**
 * dashboard Controller
 */


app.controller('DashboardController', ['$scope', '$cookieStore', 'HostService', '$localStorage', '$location', function($scope, $cookieStore, HostService, $localStorage, $location) {
    host = {};
    HostService.getHostProfile().then(function(host){
      console.log(host);
      $scope.host = host;
      $scope.userImage = host.image_url || 'img/avatar.jpg';
      $scope.username = host.profile_name;
      $scope.$apply();
    });

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

    $scope.userImage = host.image_url || 'img/avatar.jpg';

    $scope.logOut = function(){
      HostService.clearHost();
      $localStorage.$reset();
      $location.path('/');
    };


}]);


/**
 * Landing Controller
 */


app.controller('LandingController', ['$scope', function($scope){
  $scope.login = function(){
    console.log('login')
    window.location='http://localhost:3000/auth/google'
  }
  var opts = {
    containerId: "sub",
    namespace: "sub",
    interval: 2000,
    speed: 200,
    verbose: false,
    random: false,
    best: false
  };
  var sub = new Sub([
      "B. Nothing lets do it.",
      "C. New things scare me!",
      "D. I hate trivia.",
      "Corect answer is B!",
      "A. Christmas.",
  ], opts).run();
  console.log('in LandingController');
}]);

/**
 * HostGame Controller
 */

app.controller('HostGameController', ['$scope', '$location', 'HostService', function($scope, $location, HostService){
  console.log('in host game');
  $scope.gameIsActive = false;
  $scope.game = {};
  $scope.host = {};
  $scope.players = {}
  $scope.game.hostID = 1;
  HostService.getHostProfile().then(function(host){
    $scope.host = host;
    $scope.game.hostID = host.id;
    $scope.$apply();
  });

  var socket = io('http://localhost:3000/')
  socket.on('message', function(message){
    console.log(message);
  })
  $scope.$on("$destroy", function(){
    socket.disconnect();
  });
  $scope.createGame = function(game){
    $scope.gameIsActive = true;
    $scope.activeRound = 1;
    $scope.gameMessage = 'Waiting for the host to begin the game!'
    console.log('createing game');
    console.log(game);
    socket.emit('createGame', game)
  }
  $scope.askQuestion = function(question){
    console.log(question);
    socket.emit('ask question', question);
  }

  socket.on('question', function(question){
    console.log(question);
    $scope.gameMessage=question.question
    $scope.players = {}
    $scope.incomingQuestion = question;
    $scope.$apply();
  })

  socket.on('round over', function(players){
    $scope.gameMessage="Current Standings after round: "+$scope.activeRound;
    $scope.activeRound++;
    $scope.incomingQuestion = {};
    $scope.players = players;
    $scope.$apply();
  });


  var content = {
    question: 'what is you favorite color?',
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

  $scope.returnToDash = function(){
    $location.path('/dashboard')
  }

}]);

/**
 * Auth Controller
 */

app.controller('AuthController', ['$stateParams', '$localStorage', '$location', function($stateParams, $localStorage, $location){
  //Get token out of header and set in local storage
  console.log($stateParams);
  $localStorage.token = $stateParams.token;
  $location.path('/dashboard');
}]);

/**
 * Play Game Controller
 */

app.controller('PlayGameController', ['$scope', function($scope){
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

/**
 * Alerts Controller
 */


app.controller('AlertsCtrl', ['$scope', AlertsCtrl]);

function AlertsCtrl($scope) {
    $scope.alerts = [{
        type: 'success',
        msg: 'Thanks for visiting! Feel free to create pull requests to improve the dashboard!'
    }, {
        type: 'danger',
        msg: 'Found a bug? Create an issue with as many details as you can.'
    }];

    $scope.addAlert = function() {
        $scope.alerts.push({
            msg: 'Another alert!'
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
}
