angular.module('app')
  .controller("CalendarController", ['$scope', '$filter', '$http', '$state',
    '$rootScope',
    'tracks_calendar', 'MaterialCalendarData',
    function($scope, $filter, $http, $state, $rootScope, tracks_calendar,
      MaterialCalendarData) {
      $scope.no_data = false;
      $scope.tracks = [];
      var tracks_builder = [];
      // the list of tracks for displaying.
      $http.defaults.headers.common = {
        'X-User': $rootScope.globals.currentUser.username,
        'X-Token': $rootScope.globals.currentUser.authdata
      };
      $scope.selectedDate = null;
      $scope.firstDayOfWeek = 0;
      $scope.setDirection = function(direction) {
        $scope.direction = direction;
      };
      $scope.dayClick = function(date) {
        $scope.no_data = false;
        $scope.tracks = [];
        var tracks_builder = [];
        $scope.msg = "You clicked " + $filter("date")(date,
          "MMM d, y h:mm:ss a Z");
        console.log($scope.msg);
        var string_date = date.toString();
        var array_string_date = string_date.split(" ");
        var stripped_date = (array_string_date[0] + array_string_date[1] +
          array_string_date[2]);
        console.log(global_tracks_array_begin_stripped_date);
        if (global_tracks_array_begin_stripped_date.indexOf(stripped_date) >=
          0) {
          console.log(stripped_date);
          console.log("track was clicked");

          function getAllIndexes(arr, val) {
            var indexes = [],
              i = -1;
            while ((i = arr.indexOf(val, i + 1)) != -1) {
              indexes.push(i);
            }
            return indexes;
          }
          $scope.no_data = true;
          var indexes = getAllIndexes(
            global_tracks_array_begin_stripped_date, stripped_date);
          console.log(indexes);
          console.log(global_tracks_array_begin_stripped_date);
          for (var i = 0; i < indexes.length; i++) {
            var helper_object = {};
            helper_object['id'] = global_tracks['tracks'][indexes[i]]['id'];
            helper_object['name'] = global_tracks['tracks'][indexes[i]][
              'name'
            ];
            helper_object['begin'] = (new Date(global_tracks['tracks'][
              indexes[i]
            ][
              'begin'
            ]).toLocaleString());
            helper_object['url'] =
              "https://envirocar.org/api/stable/tracks/" + global_tracks[
                'tracks'][
                indexes[i]
              ].id + "/preview";
            helper_object['length'] = global_tracks['tracks'][indexes[i]][
              'length'
            ].toFixed(2);
            tracks_builder.push(helper_object);
          }
          console.log(tracks_builder);
          $scope.tracks = tracks_builder;
          // Now we have the indexes of the tracks that have to be displayed.

        }
      };
      $scope.prevMonth = function(data) {
        $scope.msg = "You clicked (prev) month " + data.month + ", " + data
          .year;
        console.log("start of custom write");
        rewrite(global_tracks);
        console.log("this was easted");
      };
      $scope.nextMonth = function(data) {
        $scope.msg = "You clicked (next) month " + data.month + ", " + data
          .year;
        rewrite(global_tracks);
      };
      var datetrial;
      url = "https://envirocar.org/api/stable/users/" + $rootScope.globals.currentUser
        .username + "/tracks";
      var global_tracks;
      var global_tracks_array_begin = [];
      var global_tracks_array_begin_stripped_date = [];

      function rewrite(trackslist) {
        //delay(1000)
        for (var i = 0; i < trackslist['tracks'].length; i++) {
          //  console.log(data.data['tracks'][i])
          var datestart = trackslist.tracks[i]['begin'];
          var dateobject = new Date(datestart);
          /*  var string_date = dateobject.toString();
            var array_string_date = string_date.split(" ");
            var stripped_date = (array_string_date[0] + array_string_date[1] +
              array_string_date[2]);
            global_tracks_array_begin_stripped_date.push(stripped_date);
            global_tracks_array_begin.push(dateobject.toString());
            */
          MaterialCalendarData.setDayContent(dateobject,
            '<i class="material-icons">directions_car</i>')
        }
      }

      tracks_calendar.get(url).then(function(data) {
        console.log(data.data);
        global_tracks = data.data;
        for (var i = 0; i < global_tracks['tracks'].length; i++) {
          var datestart = global_tracks.tracks[i]['begin'];
          var dateobject = new Date(datestart);
          var string_date = dateobject.toString();
          var array_string_date = string_date.split(" ");
          var stripped_date = (array_string_date[0] + array_string_date[1] +
            array_string_date[2]);
          global_tracks_array_begin_stripped_date.push(stripped_date);
          global_tracks_array_begin.push(dateobject.toString());
        }
        console.log(global_tracks_array_begin_stripped_date);
        rewrite(global_tracks);
      });
      // no flag.
      $scope.setDayContent = function(date) {
        return ("<p></p>")

      }
      $scope.goToActivity = function(trackid) {
        console.log("came here");
        //redirect to the track analytics page.
        $state.go('home.chart', {
          'trackid': trackid
        });

        console.log("fired");
      }
    }
  ])


angular.module('app')
  .factory('tracks_calendar', function($http) {
    var get = function(url) {
      return $http.get(url).success(function(data) {
        return data;
      });
    }

    return {
      get: get
    }
  });
