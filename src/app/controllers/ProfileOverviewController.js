/*  ProfileViewController
    This Controller retrieves data for the four profile overview details
    1) Total Number of Tracks
    2) Number of Friends
    3) Number of Groups the user is a part of
    4) The next information to come will be total distance driven( pending on API side)
*/
angular.module('app')
  .constant('profileview', {
    url_base: "https://envirocar.org/api/stable/users/",
    tracks: "/tracks",
    friends: "/friends",
    groups: "/groups"

  })

  angular.module('app')
  .controller('ProfileViewController', ['$scope', '$rootScope', '$http',
    '$stateParams',
    'ProfileViewFactory', 'profileview',
    function($scope, $rootScope, $http, $stateParams, ProfileViewFactory,
      profileview) {
      $scope.originalUser = false;
      $scope.trackurl;

      $http.defaults.headers.common = {
        'X-User': $rootScope.globals.currentUser.username,
        'X-Token': $rootScope.globals.currentUser.authdata
      };

      var username;
      if ($stateParams.user == "") {
        username = $rootScope.globals.currentUser.username;
      } else {
        username = $stateParams.user;
        $scope.originalUser = true;
        $scope.trackurl = "#/dashboard/tracks/" + username;
      }
      $scope.name_of_user = username;
      $scope.track_number = 0; // Number of Tracks
      $scope.friends_number = 0; // Number of Friends
      $scope.distance_driven = 0; // Distance Driven
      $scope.groups_number = 0; // Number of groups
      $scope.emailId; // EmailID

      var url_track = profileview.url_base + username + profileview.tracks + "?limit=1";
      $http.get(url_track).success(function(data, status, headers, config) {
        // An effecient way to find out the total number of tracks.
        // http://envirocar.github.io/enviroCar-server/api/ Contains an explanation on the pagination
        // By default the tracks endpoint returns a MAXIMUM of 100 tracks if limit is not specified
        var length = headers('Content-Range').split("/");
        $scope.track_number = Number(length[1]);
      })

      var url_friends_number = profileview.url_base + username + profileview.friends;
      ProfileViewFactory.get(url_friends_number).then(function(data) {
        // Array of friends is returned by the server.
        $scope.friends_number = data.data.users.length;
      })

      var url_groups = profileview.url_base + username + profileview.groups;
      ProfileViewFactory.get(url_groups).then(function(data) {
        // Array of Groups the user is a part of is returned
        $scope.groups_number = data.data.groups.length;
      })

      var url_user_details = profileview.url_base + username;
      ProfileViewFactory.get(url_user_details).then(function(data) {
        $scope.emailId = data.data.mail;
      })
    }
  ])

angular.module('app')
  .factory('ProfileViewFactory', function($http) {
    var get = function(url) {
      return $http.get(url).success(function(data) {
        console.log(data);
        return data;
      })
    }
    return {
      get: get
    }
  });
