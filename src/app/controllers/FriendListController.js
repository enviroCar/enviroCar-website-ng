/*
    FriendListController: Used in List of friends and list of 4 friends in the dashboard.html
*/
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
          // When the user does not have any friends.
          $scope.show_no_friends = true;
        }
        var data_friends = data.data.users;
        for (var i = 0; i < data_friends.length; i++) {
          var helper_object = {};
          helper_object['username'] = data_friends[i]['name'];
          helper_object['profile_url'] = "https://envirocar.org/api/stable/users/" + helper_object['username'] + "/avatar";
          data2.push(helper_object);
        }
        $scope.data_friends = data2;
        // Select information of 4 friends.
        $scope.data_friends_4 = JSON.parse(JSON.stringify(data2)).slice(0,3);
        $scope.remainingFriends = data2.length - 3;

        if ($scope.remainingFriends > 0) {
          $scope.showMoreFriends = true;
          $scope.remainingFriends = $scope.remainingFriends.toString() +
            "+";
        }
        // time being for profile pics. // CORS issues are being encountered when attempting to access profile pictures in gravatar. So for the time being, placeholder icons have been used.
        for (var i = 0; i < $scope.data_friends_4.length; i++) {
          $scope.data_friends_4[i]['profile_url'] =
            "assets/images/profiledummy" + (i + 1).toString() + ".png";
        }
        $scope.totalLoading = false;
      });
      $scope.goToFriend = function(username) {
        $state.go('home.dashboard', {
          'user': username
        });
      }
      $scope.tabChangeToFriends = function() {
        // When the + icon is clicked, shift the tab to the second tab.
          $rootScope.tabNumber = 2;
        }
    }
  ]);
