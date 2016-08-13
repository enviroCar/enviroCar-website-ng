angular.module('app')
  .constant('myactivity', {
    page_size: 5,
    url_base: "https://envirocar.org/api/stable/users/",
    yourself: "/activities?",
    avatar: "/avatar",
  })

.controller('MyActivityController', ['$scope', '$http', '$rootScope', '$state',
  '$stateParams',
  'myactivity',
  function($scope, $http, $rootScope, $state, $stateParams, myactivity) {
    $scope.fetchingResults = false;
    $scope.totalLoading = true;
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
      $scope.username;
      var username;
      if ($stateParams.user == "") {
        username = $rootScope.globals.currentUser.username;
        $scope.username = "Your";

      } else {
        username = $stateParams.user;
        $scope.username = username;
      }
      var fetchFloat = 0;
      //$scope.username = username;
      $scope.nextpage = function() {
        if(fetchFloat == 1)
        {
          $scope.fetchingResults = true;
        }
        $scope.page++;
        var url = myactivity.url_base + username +
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
              helper['color'] = "#8CBF3F"
              if (data.activities[i].type == "FRIENDED_USER") {
                helper['type'] = 0;
                helper['topic'] = "New Friend Activity";
                helper['name'] = username + " is now friends with " +
                  data.activities[
                    i].other.name;
                helper['trackidlink'] = "";
                helper['color'] = "#0065A0"
                helper['icon'] = 'people';

              } else if (data.activities[i].type == "CREATED_TRACK") {
                helper['type'] = 1;
                helper['color'] = "#0065A0"
                helper['topic'] = "New Track Upload";
                helper['trackidlink'] = data.activities[i].track.id
                helper['icon'] = 'add_circle';

              } else if (data.activities[i].type == "CHANGED_PROFILE") {
                helper['type'] = 0;
                helper['topic'] = "Profile Update";
                helper['icon'] = 'update';

              } else if (data.activities[i].type == "UNFRIENDED_USER") {
                continue;
              } else if (data.activities[i].type == "CREATED_GROUP") {
                helper['type'] = 0;
                helper['topic'] = "You created a Group";
                helper['icon'] = 'speaker_groups';


              } else if (data.activities[i].type == "CHANGED_GROUP") {
                helper['type'] = 0;
                helper['topic'] = "You changed the group";
                helper['icon'] = 'speaker_groups';

              } else if (data.activities[i].type == "JOINED_GROUP") {
                helper['type'] = 0;
                helper['topic'] = "You joined the Group";
                helper['icon'] = 'group_add';

              } else if (data.activities[i].type == "LEFT_GROUP") {
                helper['type'] = 0;
                helper['topic'] = "You left the Group";
              } else if (data.activities[i].type == "DELETED_GROUP") {
                helper['type'] = 0;
                helper['topic'] = "You deleted the group";
              }
              eventshelper.push(helper);
              //  console.log(helper);
            }
            //console.log($scope.events);
            $scope.events = eventshelper
            fetchFloat = 1;
            $scope.fetchingResults = false;
            $scope.totalLoading = false;
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
