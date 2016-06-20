angular.module('app')
  .controller("FriendListController", ['$scope', '$http', '$rootScope',
    '$stateParams', '$state',
    'requesthomestats',
    function($scope, $http, $rootScope, $stateParams, $state,
      requesthomestats) {
      $http.defaults.headers.common = {
        'X-User': $rootScope.globals.currentUser.username,
        'X-Token': $rootScope.globals.currentUser.authdata
      };
      var username;
      if ($stateParams.user == "") {
        username = $rootScope.globals.currentUser.username;
      } else {
        username = $stateParams.user
      }
      $scope.show_no_friends = false;
      $scope.data_friends = [];
      var data2 = [];
      url = 'https://envirocar.org/api/stable/users/' + username + "/friends";
      requesthomestats.get(url).then(function(data) {
        if (data.data.users.length == 0) {
          $scope.show_no_friends = true;
        }
        var data_friends = data.data.users;
        for (var i = 0; i < data_friends.length; i++) {
          var helper_object = {};
          helper_object['username'] = data_friends[i]['name'];
          helper_object['profile_url'] =
            "https://envirocar.org/api/stable/users/" + helper_object[
              'username'] + "/avatar";
          data2.push(helper_object);
        }
        $scope.data_friends = data2;
      });
      $scope.goToFriend = function(username) {
          console.log(username + "came to find friend");
          $state.go('home.dashboard', {
            'user': username
          });
        }
        //$scope.friends = {};
    }
  ])
