/*  ProfileViewController
    This Controller retrieves data for the four profile overview details
    1) Total Number of Tracks
    2) Number of Friends
    3) Number of Groups the user is a part of
    4) The next information to come will be total distance driven( pending on API side)
*/
angular.module('app')
.constant('profileview',{
  url_base: "https://envirocar.org/api/stable/users/",
  tracks: "/tracks",
  friends: "/friends",
  groups: "/groups"

})
.controller('ProfileViewController',['$scope','$rootScope','$http','ProfileViewFactory','profileview',function($scope,$rootScope,$http,ProfileViewFactory,profileview){
  $http.defaults.headers.common = {'X-User': $rootScope.globals.currentUser.username, 'X-Token': $rootScope.globals.currentUser.authdata};
  $scope.track_number = 0;
  $scope.friends_number = 0;
  $scope.distance_driven = 0;
  $scope.groups_number = 0;
  var url_track = profileview.url_base +$rootScope.globals.currentUser.username+ profileview.tracks;
  ProfileViewFactory.get(url_track).then(function(data){
      console.log(data.data.tracks.length);
      $scope.track_number = data.data.tracks.length;
  })
  var url_friends_number = profileview.url_base + $rootScope.globals.currentUser.username + profileview.friends;
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
  var url_groups = profileview.url_base + $rootScope.globals.currentUser.username + profileview.groups;
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
