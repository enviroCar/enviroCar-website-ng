angular.module('app')
  .controller("FriendListController", ['$scope', '$http', '$rootScope',
    'requesthomestats',
    function($scope, $http, $rootScope, requesthomestats) {
      $http.defaults.headers.common = {
        'X-User': $rootScope.globals.currentUser.username,
        'X-Token': $rootScope.globals.currentUser.authdata
      };
      $scope.show_no_friends = false;
      $scope.data_friends = [];
      var data2 = [];
      url = 'https://envirocar.org/api/stable/users/' + $rootScope.globals.currentUser
        .username + "/friends";
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

      //$scope.friends = {};
    }
  ])
