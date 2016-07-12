angular.module('app')
  .controller("CalendarController", ['$scope', '$mdDialog', '$mdMedia',
    '$filter', '$http', '$state',
    '$rootScope',
    'tracks_calendar', 'MaterialCalendarData',
    function($scope, $mdDialog, $mdMedia, $filter, $http, $state, $rootScope,
      tracks_calendar,
      MaterialCalendarData) {
      $scope.no_data = false;
      $scope.tracks = [];
      var tracks_builder = [];
      $scope.nostatistics = true;
      $scope.onload = true;
      $scope.total_tracks;
      $scope.total_time;
      $scope.total_distance;
      $scope.track;
      var month_number_mapping = {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Oct',
        11: 'Nov',
        12: 'Dec'
      }
      $scope.currenttrack = {};
      $scope.showAdvanced = function(ev, eventid) {
        $scope.currenttrack = {};
        $scope.currenttrack['id'] = eventid;
        $scope.track = eventid;
        console.log(eventid);

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'app/views/dialog1.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
              currenttrack: $scope.currenttrack
            },
            fullscreen: useFullScreen
          })
          .then(function(answer) {
            $scope.status = 'You said the information was "' + answer +
              '".';
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      };


      function DialogController($scope, $mdDialog, $state, currenttrack) {
        console.log(currenttrack);
        $scope.onload = false;
        $scope.currenttrack = currenttrack;
        var starttime;
        var endtime;
        var length;
        var url_requested = "https://envirocar.org/api/stable/users/" +
          $rootScope.globals.currentUser.username + "/tracks/" + currenttrack
          .id;
        tracks_calendar.get(url_requested).then(function(data) {
          console.log(data.data);
          length = data.data.properties['length'];
          $scope.currenttrack['manufacturer'] = data.data.properties.sensor
            .properties['manufacturer'];
          $scope.currenttrack['model'] = data.data.properties.sensor.properties[
            'model'];
          $scope.currenttrack['start'] = new Date(data.data.features[0].properties
            .time).toLocaleString();
          $scope.currenttrack['end'] = new Date(data.data.features[data.data
            .features.length - 1].properties.time).toLocaleString();
          starttime = data.data.features[0].properties.time;
          endtime = (data.data.features[data.data.features.length - 1].properties
            .time);
          console.log(starttime + 'is starttime');
          console.log(endtime + "is endtime");
          console.log(length + "is legnth");
          tracks_calendar.get(url_requested + "/statistics/Consumption").then(
            function(
              data) {
              console.log(data.data.avg);
              if (data.data.avg != undefined) {
                $scope.currenttrack['consumption_avg'] = (data.data.avg
                  .toFixed(
                    2));
                var seconds_passed = new Date(endtime).getTime() - new Date(
                  starttime).getTime();
                console.log(seconds_passed);
                $scope.currenttrack['consumption100Km'] = ((100 *
                    $scope
                    .currenttrack[
                      'consumption_avg'] * (seconds_passed / (1000 *
                      60 *
                      60))) /
                  length).toFixed(2);
                $scope.currenttrack['consumption100Km'] = $scope.currenttrack[
                  'consumption100Km'].toString() + " L/100 Km";
              } else
                $scope.currenttrack['consumption_avg'] = "NA";

              //  currenttrack['']
              $scope.onload = true;
            })

          tracks_calendar.get(url_requested + "/statistics/CO2").then(
            function(
              data) {
              console.log(data.data.avg);
              if (data.data.avg != undefined) {
                $scope.currenttrack['co2_avg'] = (data.data.avg
                  .toFixed(
                    2));
                var seconds_passed = new Date(endtime).getTime() - new Date(
                  starttime).getTime();
                console.log(seconds_passed);
                $scope.currenttrack['co2gKm'] = ((1000 *
                    $scope
                    .currenttrack[
                      'co2_avg'] * (seconds_passed / (1000 *
                      60 *
                      60))) /
                  length).toFixed(2);
                $scope.currenttrack['co2gKm'] = $scope.currenttrack[
                  'co2gKm'].toString() + "  g/Km";
              } else
                $scope.currenttrack['consumption_avg'] = "NA";

              //  currenttrack['']
              $scope.onload = true;

              console.log(data.data.avg);
              if (data.data.avg != undefined)
                $scope.currenttrack['co2_avg'] = (data.data.avg.toFixed(
                  2));
              else
                $scope.currenttrack['co2_avg'] = "NA";

              //  currenttrack['']
              $scope.onload = true;
            })
        })
        tracks_calendar.get(url_requested + "/statistics/Speed").then(
          function(data) {
            console.log(data.data);
            $scope.currenttrack['speed_avg'] = (data.data.avg.toFixed(2));
            //  currenttrack['']
          })



        $scope.currenttrack['url'] =
          "https://envirocar.org/api/stable/tracks/" + currenttrack.id +
          "/preview";
        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
        $scope.redirect = function(trackid) {
          $mdDialog.hide();

          $state.go('home.chart', {
            'trackid': trackid
          });
        }
      }
      // end of tab approach

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
        console.log(stripped_date[3] + "is year");
        //  console.log(global_tracks_array_begin_stripped_date);
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
      var global_tracks;

      $scope.prevMonth = function(data) {
        $scope.msg = "You clicked (prev) month " + data.month + ", " + data
          .year;

        var monthyear = month_number_mapping[data.month] + data.year.toString();
        console.log(monthyear);
        console.log(data);
        console.log("start of custom write");
        rewrite(global_tracks);
        console.log("this was easted");
        console.log(global_tracks);
        var total_tracks = 0;
        var total_distance = 0;
        var total_time = 0;
        console.log(global_tracks);
        for (var i = 0; i < global_tracks.tracks.length; i++) {
          var datestart = global_tracks.tracks[i].begin;
          var dateobject = new Date(datestart);
          var string_date = dateobject.toString();
          console.log(string_date);
          var array_string_date = string_date.split(" ");
          console.log(array_string_date);
          var stripped_date = (array_string_date[1] + array_string_date[3]);
          console.log(stripped_date + "is month year date");
          if (stripped_date == monthyear) {
            total_tracks++;
            total_distance += global_tracks.tracks[i]['length'];
            total_time += (new Date(global_tracks.tracks[i].begin).getTime() -
              new Date(global_tracks.tracks[i].end).getTime());
          }
        }
        var date_for_seconds = new Date(null);
        date_for_seconds.setSeconds(total_time / 1000);
        var date_hh_mm_ss = date_for_seconds.toISOString().substr(
          11, 8)
        $scope.total_tracks = total_tracks;
        $scope.total_time = date_hh_mm_ss;
        $scope.total_distance = total_distance.toFixed(2);
        if (total_tracks == 0) {
          $scope.nostatistics = true;
        } else {
          $scope.nostatistics = false;
        }
        console.log(total_tracks + "is total tracks");
        console.log(total_distance + "is dist");
        console.log(date_hh_mm_ss + "is time");
      };
      $scope.nextMonth = function(data) {
        $scope.msg = "You clicked (next) month " + data.month + ", " + data
          .year;
        rewrite(global_tracks);
        var monthyear = month_number_mapping[data.month] + data.year.toString();
        var total_tracks = 0;
        var total_distance = 0;
        var total_time = 0;
        console.log(global_tracks);
        for (var i = 0; i < global_tracks.tracks.length; i++) {
          var datestart = global_tracks.tracks[i].begin;
          var dateobject = new Date(datestart);
          var string_date = dateobject.toString();
          console.log(string_date);
          var array_string_date = string_date.split(" ");
          console.log(array_string_date);
          var stripped_date = (array_string_date[1] + array_string_date[3]);
          console.log(stripped_date + "is month year date");
          if (stripped_date == monthyear) {
            total_tracks++;
            total_distance += global_tracks.tracks[i]['length'];
            total_time += (new Date(global_tracks.tracks[i].begin).getTime() -
              new Date(global_tracks.tracks[i].end).getTime());
          }
        }
        var date_for_seconds = new Date(null);
        date_for_seconds.setSeconds(total_time / 1000);
        var date_hh_mm_ss = date_for_seconds.toISOString().substr(
          11, 8)
        $scope.total_tracks = total_tracks;
        $scope.total_time = date_hh_mm_ss;
        $scope.total_distance = total_distance.toFixed(2);
        if (total_tracks == 0) {
          $scope.nostatistics = true;
        } else {
          $scope.nostatistics = false;
        }

        console.log(total_tracks + "is total tracks");
        console.log(total_distance + "is dist");
        console.log(date_hh_mm_ss + "is time");

      };
      var datetrial;
      url = "https://envirocar.org/api/stable/users/" + $rootScope.globals.currentUser
        .username + "/tracks";
      var global_tracks_array_begin = [];
      var global_tracks_array_begin_stripped_date = [];
      var date_count = {};

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
          var string_date = dateobject.toString();
          var array_string_date = string_date.split(" ");
          var stripped_date = (array_string_date[0] + array_string_date[1] +
            array_string_date[2]);
          console.log(date_count[stripped_date] + "no of occurences");
          console.log(dateobject);
          MaterialCalendarData.setDayContent(dateobject, (
            '<i class="material-icons">directions_car</i><span>' +
            date_count[stripped_date] + '</span>'))
        }
      }

      tracks_calendar.get(url).then(function(data) {
        var currentmonth = new Date();
        console.log(currentmonth);
        var monthyear = currentmonth.toString().split(" ")[1] +
          currentmonth.toString().split(" ")[3];

        console.log(data.data);
        global_tracks = data.data;
        for (var i = 0; i < global_tracks['tracks'].length; i++) {
          var datestart = global_tracks.tracks[i]['begin'];
          var dateobject = new Date(datestart);
          var string_date = dateobject.toString();
          var array_string_date = string_date.split(" ");
          var stripped_date = (array_string_date[0] + array_string_date[1] +
            array_string_date[2]);
          if (date_count[stripped_date] != undefined) {
            date_count[stripped_date]++;
          } else {
            date_count[stripped_date] = 1;
          }
          global_tracks_array_begin_stripped_date.push(stripped_date);
          global_tracks_array_begin.push(dateobject.toString());
        }
        console.log(date_count);
        console.log(global_tracks_array_begin_stripped_date);
        rewrite(global_tracks);
        var total_time = 0;
        var total_tracks = 0;
        var total_distance = 0;
        for (var i = 0; i < global_tracks.tracks.length; i++) {
          var datestart = global_tracks.tracks[i].begin;
          var dateobject = new Date(datestart);
          var string_date = dateobject.toString();
          console.log(string_date);
          var array_string_date = string_date.split(" ");
          console.log(array_string_date);
          var stripped_date = (array_string_date[1] + array_string_date[3]);
          console.log(stripped_date + "is month year date");
          if (stripped_date == monthyear) {
            total_tracks++;
            total_distance += global_tracks.tracks[i]['length'];
            total_time += (new Date(global_tracks.tracks[i].begin).getTime() -
              new Date(global_tracks.tracks[i].end).getTime());
          }
        }
        var date_for_seconds = new Date(null);
        console.log(total_time);
        date_for_seconds.setSeconds(total_time / 1000);
        var date_hh_mm_ss = date_for_seconds.toISOString().substr(
          11, 8)
        $scope.total_tracks = total_tracks;
        $scope.total_time = date_hh_mm_ss;
        $scope.total_distance = total_distance.toFixed(2);
        if (total_tracks == 0) {
          $scope.nostatistics = true;
        } else {
          $scope.nostatistics = false;
        }
        $scope.onload = false;
        console.log(total_tracks + "is total tracks");
        console.log(total_distance + "is dist");
        console.log(date_hh_mm_ss + "is time");
      });
      $scope.tooltips = true;

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
