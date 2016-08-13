angular.module('app')
  .controller("FriendListController", ['$scope', '$http', '$rootScope',
    '$stateParams', '$state',
    'requesthomestats',
    function($scope, $http, $rootScope, $stateParams, $state,
      requesthomestats) {
      $scope.totalLoading = true;
      $scope.showMoreFriends = false;
      $scope.selectedIndex = 2;
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
      $scope.data_friends_4 = [];
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
        $scope.data_friends_4 = JSON.parse(JSON.stringify(data2)).slice(0,
          3);
        $scope.remainingFriends = data2.length - 3;
        if ($scope.remainingFriends > 0) {
          $scope.showMoreFriends = true;
          $scope.remainingFriends = $scope.remainingFriends.toString() +
            "+";
        }
        // time being for profile pics.
        for (var i = 0; i < $scope.data_friends_4.length; i++) {
          $scope.data_friends_4[i]['profile_url'] =
            "assets/images/profiledummy" + (i + 1).toString() + ".png";
        }
        console.log($scope.data_friends_4);
        $scope.totalLoading = false;
      });
      $scope.goToFriend = function(username) {
        console.log(username + "came to find friend");
        $state.go('home.dashboard', {
          'user': username
        });
      }
      $scope.tabChangeToFriends = function() {
          $rootScope.tabNumber = 2;
        }
        //$scope.friends = {};
    }
  ])
