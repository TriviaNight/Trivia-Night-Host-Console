

/**
 * dashboard Controller
 */


app.controller('DashboardController', ['$scope', '$cookieStore', 'HostService', '$localStorage', '$location', function($scope, $cookieStore, HostService, $localStorage, $location) {

    $scope.host={}
    //API call to get all of the host information
    HostService.getHostProfile().then(function(host){
      console.log(host)
      $scope.host = host;
      $scope.host.decks = HostService.getDecks();
      $scope.host.questions = HostService.getQuestions();

      $scope.host.games = HostService.getGames();
      $scope.userImage = host.image_url || 'img/avatar.jpg';
      $scope.host.username = host.profile_name;

      //get user responses from questions
      $scope.host.userResponses = []
      $scope.host.questions.forEach(function(question){
        question.correctResponses = 0;
        question.userResponses.forEach(function(response){
          $scope.host.userResponses.push(response);
          if(response.correct_answer){
            question.correctResponses++;
          }

        });
      });
      $scope.host.questions.forEach(function(question){
        if(question.userResponses.length===0){
          question.percentCorrect = 'Unanswerd'
        }else{
          question.percentCorrect = '%'+((question.correctResponses/question.userResponses.length*100).toFixed(2));
        }
      });
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

    $scope.userImage = $scope.host.userImage || 'img/avatar.jpg';

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
    window.location='https://trivia-app-api.herokuapp.com/auth/google'
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
  $scope.returnToMenu = false;
  $scope.gameIsActive = false;
  $scope.timer = 0;
  $scope.game = {};
  $scope.host = {};
  $scope.players = {}
  HostService.getHostProfile().then(function(host){
    $scope.host = host;
    $scope.game.host_id = $scope.host.id;
    $scope.$apply();
    $scope.decks = HostService.getDecks();
  });

  $scope.countdown = function() {
    setTimeout(function() {
     $scope.timer--;
     $scope.$apply();
     if($scope.timer>0){
       $scope.countdown();
     }
    }, 1000);
  };

  var socket = io('https://trivia-app-api.herokuapp.com/')
  socket.on('message', function(message){
    console.log(message);
  })
  $scope.$on("$destroy", function(){
    socket.disconnect();
  });
  $scope.createGame = function(game){
    console.log(game.deck);
    $scope.gameIsActive = true;
    $scope.activeRound = 1;
    $scope.gameMessage = 'Waiting for the host to begin the game!'
    console.log('createing game');
    console.log(game);
    socket.emit('createGame', game)
  }
  $scope.askQuestion = function(){
    var question = $scope.game.deck.questions[Math.floor(Math.random()*$scope.game.deck.questions.length)]
    console.log(question);
    socket.emit('ask question', question);
  }

  socket.on('question', function(question){
    console.log(question);
    $scope.gameMessage=question.question
    $scope.players = {}
    $scope.incomingQuestion = question;
    $scope.timer = $scope.game.questionTime;
    $scope.countdown();
    $scope.$apply();
  })

  socket.on('round over', function(players){
    $scope.gameMessage="Current Standings after round: "+$scope.activeRound;
    $scope.activeRound++;
    $scope.incomingQuestion = {};
    $scope.players = players;
    $scope.$apply();
  });

  socket.on('game over', function(players){
    $scope.gameMessage="Final Standings";
    $scope.incomingQuestion = {};
    $scope.players = players;
    $scope.returnToMenu = true;
    $scope.$apply();

  });



  $scope.returnToDash = function(){
    $location.path('/dashboard')
  }

}]);
/**
 * questions Controller
 */

app.controller('QuestionsController', ['$scope', '$location', 'HostService', '$http', function($scope, $location, HostService, $http){
  $scope.question={}
  //Get token out of header and set in local storage
  HostService.getHostProfile().then(function(host){
    $scope.host = host;
    $scope.host.questions = HostService.getQuestions();
  });

  $http.get('https://trivia-app-api.herokuapp.com/catagories').then(function(catagories){
    $scope.catagories = catagories.data.data;
  });

  $scope.addQuestion = function(question){
    console.log(question)
    question.user_id = $scope.host.id;
    $http.post('https://trivia-app-api.herokuapp.com/questions', question).then(function(question){
      $scope.catagories.forEach(function(catagory){
        console.log(catagory);
        console.log(question.data.data.catagory_id)
        if(catagory.id == question.data.data.catagory_id){
          question.data.data.catagory = catagory;
        }
      })
      console.log(question.data.data);
      $scope.host.questions.push(question.data.data);
      $scope.$apply();
    });
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
  var socket = io('https://trivia-app-api.herokuapp.com/')
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
