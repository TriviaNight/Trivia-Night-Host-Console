app.factory('HostService', ['$http', function($http){
  var hostActions = {};
  var host=null;
  hostActions.getHostProfile = function(){
    return new Promise(function(resolve, reject){
      if(host){
        profile={
          id: host.id,
          email: host.email,
          profile_name: host.profile_name,
          image_url: host.image_url,
        };
        resolve(profile);
      }
      else{
        $http.get('http://localhost:3000/hosts/1').then(function(newHost){
          newHost = newHost.data.data;
          host = newHost;
          profile={
              id: host.id,
              email: host.email,
              profile_name: host.profile_name,
              image_url: host.image_url,
          };
          resolve(profile);
        }).catch(function(error){
          reject(error);
        });
      }
    });
  };
  hostActions.clearHost = function(){
    host=null;
  };
  return hostActions;
}]);
