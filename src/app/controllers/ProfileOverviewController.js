angular.module('app')
.controller('ProfileViewController',['$scope','$rootScope','$http','ProfileViewFactory',function($scope,$rootScope,$http,ProfileViewFactory){
  $http.defaults.headers.common = {'X-User': $rootScope.globals.currentUser.username, 'X-Token': $rootScope.globals.currentUser.authdata};
  $scope.track_number = 0;
  $scope.friends_number = 0;
  $scope.distance_driven = 0;
  $scope.groups_number = 0;
  var url_track = "https://envirocar.org/api/stable/users/"+$rootScope.globals.currentUser.username+"/tracks";
  ProfileViewFactory.get(url_track).then(function(data){
      console.log(data.data.tracks.length);
      $scope.track_number = data.data.tracks.length;
  })
  var url_friends_number = "https://envirocar.org/api/stable/users/" + $rootScope.globals.currentUser.username + "/friends";
  ProfileViewFactory.get(url_friends_number).then(function(data){
      console.log(data.data.users.length);
      $scope.friends_number = data.data.users.length;
  })
  /*ProfileViewFactory.get(url_track).then(function(data){
      console.log(data.data.tracks.length);
      $scope.distance_driven = data.data.tracks.length;
      //When this data is available in the API
  })
  */
  var url_groups = "https://envirocar.org/api/stable/users/" + $rootScope.globals.currentUser.username + "/groups"
  ProfileViewFactory.get(url_groups).then(function(data){
      console.log(data.data.groups.length);
      $scope.groups_number = data.data.groups.length;
  })
  

}])

angular.module('app')
.factory('ProfileViewFactory',function($http){
  var get = function(url)
  {
    return $http.get(url).success(function(data){
      console.log(data);
      return data;
    })
  }
  return {
    get: get
  }
});
