angular.module('app')
.controller('MyActivityControllerFixed', ['$scope', '$http', '$rootScope', '$state',
  '$stateParams',
  'myactivity',
  function($scope, $http, $rootScope, $state, $stateParams, myactivity) {
    $scope.show_no_my_activity = false;
    console.log("fired my activity")
    $scope.events = [];
    var eventshelper = []
    $scope.busy = false;
    $scope.page = 0;
    $scope.page_size = myactivity.page_size;
    if (typeof $rootScope.globals.currentUser == "undefined") {
      console.log("came here to if");
    } else {
      console.log("fired else")
      $http.defaults.headers.common = {
        'X-User': $rootScope.globals.currentUser.username,
        'X-Token': $rootScope.globals.currentUser.authdata
      };

      $scope.nextpage = function() {
        $scope.page++;
        var url = myactivity.url_base + $rootScope.globals.currentUser +
          myactivity.yourself;
        $http.get(url + "limit=" + $scope.page_size + "&page=" + $scope.page)
          .success(function(data, status, headers, config) {
            if (data.activities.length == 0) {
              $scope.show_no_my_activity = true;
            }
            for (var i = 0; i < data.activities.length; i++) {
              var helper = {};
              helper['time'] = data.activities[i].time;
              helper['name'] = data.activities[i].user.name;
              //  helper['profileurl'] = "https://envirocar.org/api/stable/users/"+helper['name']+"/avatar";
              //console.log(helper['profileurl']);
              helper['date'] = new Date(data.activities[i].time).toLocaleString();
              //  console.log(i);
              //console.log(data.activities[i]);

              if (data.activities[i].type == "FRIENDED_USER") {
                helper['type'] = 0;
                helper['topic'] = "New Friend Activity";
                helper['name'] = username + " is now friends with " +
                  data.activities[
                    i].other.name;
                helper['trackidlink'] = "";
              } else {
                helper['type'] = 1;
                helper['topic'] = "New Track Upload";
                helper['trackidlink'] = data.activities[i].track.id
              }
              eventshelper.push(helper);
              //  console.log(helper);
            }
            //console.log($scope.events);
            $scope.events = eventshelper
          })
      }
      $scope.nextpage($scope.page);
      $scope.goToActivity = function(activity, trackid) {
        if (activity == 1) {
          //redirect to the track analytics page.
          $state.go('home.chart', {
            'trackid': trackid
          });
        }
        console.log("fired");
      }
    }
  }
])
