/* CalendarController:
      This controller handles the calendar functionality in the tracks page. The tracks.html file makes
      use of this calendar controller
      1) We have made use of the calendar directive to achieve this.
      2) There are 4 important functions of this controller(PrevMonth,NextMonth,DateClicked,Populating the calendar)
*/
angular.module('app')
.constant('calendar', {
  monthNumberMapping : {
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
      },
      urlUsers: "https://envirocar.org/api/stable/users/",
      urlTracks: "https://envirocar.org/api/stable/tracks/"


})
angular.module('app')
  .controller("CalendarController", ['$scope', '$mdDialog', '$mdMedia',
    '$stateParams',
    '$filter', '$http', '$state',
    '$rootScope',
    'tracks_calendar','calendar','MaterialCalendarData',
    function($scope, $mdDialog, $mdMedia, $stateParams, $filter, $http, $state, $rootScope, tracks_calendar,calendar,MaterialCalendarData) {

        $scope.buttonClickCurrentDate = function() {
            $scope.selectedDate = new Date();
            $scope.dayClick(new Date());
      }

      var username;
      // The username from the url of the page opened.
      if ($stateParams.user == "") {
        username = $rootScope.globals.currentUser.username;
      } else {
        username = $stateParams.user;
      }
      // Boolean flag to determine when there are any tracks present for the selected day.
      $scope.no_data = false;
      // A array of the tracks data.
      $scope.tracks = [];
      var tracks_builder = [];
      // A utility array used to push into the tracks array.

      // Boolean flag to determine if there are any tracks present for the entire month
      $scope.nostatistics = true;
      $scope.onload = true;

      // Total number of tracks for the monthly statistics.
      $scope.total_tracks;

      // Total time of travel for the monthly statistics.
      $scope.total_time;

      // Total distance travelled for the monthly statistics.
      $scope.total_distance;

      $scope.track;
      // A hashmap used to provide a mapping between the number and the corresponding month.
      var month_number_mapping = calendar.monthNumberMapping;
      // Object to hold the currentTrack
      $scope.currenttrack = {};

      // A artifact leftover from previous implementations where clicking on one of the tracks from the list of tracks would provide
      // the user with information and average statistics about the track in a dialog
      $scope.showAdvanced = function(ev, eventid) {
        $scope.tt_isOpen = false;
        $scope.currenttrack = {};
        $scope.currenttrack['id'] = eventid;
        $scope.track = eventid;

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

      // The corresponding DialogController for the statistics dialog. This is currently not being used
      function DialogController($scope, $mdDialog, $state, currenttrack) {
        $scope.onload = false;
        $scope.currenttrack = currenttrack;
        var starttime;
        var endtime;
        var length;
        var url_requested = calendar.urlUsers + username + "/tracks/" + currenttrack.id;
        tracks_calendar.get(url_requested).then(function(data) {
          length = data.data.properties['length'];
          $scope.currenttrack['manufacturer'] = data.data.properties.sensor.properties['manufacturer'];
          $scope.currenttrack['model'] = data.data.properties.sensor.properties['model'];
          $scope.currenttrack['start'] = new Date(data.data.features[0].properties.time).toLocaleString();
          $scope.currenttrack['end'] = new Date(data.data.features[data.data.features.length - 1].properties.time).toLocaleString();
          starttime = data.data.features[0].properties.time;
          endtime = (data.data.features[data.data.features.length - 1].properties.time);
          tracks_calendar.get(url_requested + "/statistics/Consumption").then(
            function(
              data) {
              if (data.data.avg != undefined) {
                $scope.currenttrack['consumption_avg'] = (data.data.avg
                  .toFixed(
                    2));
                var seconds_passed = new Date(endtime).getTime() - new Date(
                  starttime).getTime();
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
                $scope.currenttrack['consumption100Km'] = "NA";
              $scope.onload = true;
            })

          tracks_calendar.get(url_requested + "/statistics/CO2").then(
            function(
              data) {
              if (data.data.avg != undefined) {
                $scope.currenttrack['co2_avg'] = (data.data.avg
                  .toFixed(
                    2));
                var seconds_passed = new Date(endtime).getTime() - new Date(
                  starttime).getTime();
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
                $scope.currenttrack['co2gKm'] = "NA";

              $scope.onload = true;

              if (data.data.avg != undefined)
                $scope.currenttrack['co2_avg'] = (data.data.avg.toFixed(
                  2));
              else
                $scope.currenttrack['co2_avg'] = "NA";

              $scope.onload = true;
            })
        })
        tracks_calendar.get(url_requested + "/statistics/Speed").then(
          function(data) {
            $scope.currenttrack['speed_avg'] = (data.data.avg.toFixed(2));
          })



        $scope.currenttrack['url'] =calendar.urlTracks + currenttrack.id + "/preview";
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
      // Beginning of actual calendar implementation and other functionality.
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
        // Function to handle what happens when a date is clicked.
        $scope.no_data = false;
        // The set of tracks to display on the right side section is reinitialized.
        $scope.tracks = [];

        // A utility array to build the $scope.tracks array incrementally.
        var tracks_builder = [];
        $scope.msg = "You clicked " + $filter("date")(date,"MMM d, y h:mm:ss a Z");

        // The current date clicked is converted into a string and the date, month, year are stripped out of the date to form a unique string to
        // easily check for equality between the date clicked and the date's in the array of all tracks of the user

        var string_date = date.toString();
        var array_string_date = string_date.split(" ");
        var stripped_date = (array_string_date[0] + array_string_date[1] +
          array_string_date[2]);

        if (global_tracks_array_begin_stripped_date.indexOf(stripped_date) >= 0) {

          // A utility function to return all the indexes of the global list of all tracks that match the stripped date that was clicked
          function getAllIndexes(arr, val) {
            var indexes = [],
              i = -1;
            while ((i = arr.indexOf(val, i + 1)) != -1) {
              indexes.push(i);
            }
            return indexes;
          }

          $scope.no_data = true;
          var indexes = getAllIndexes(global_tracks_array_begin_stripped_date, stripped_date);

          for (var i = 0; i < indexes.length; i++) {
            // Now we have an array 'indexes' that has all the indexes that correspond to the cliked date.
            // Build the helper object for each of the tracks with all the details required
            var helper_object = {};
            helper_object['car'] = global_tracks['tracks'][indexes[i]]['sensor']['properties']['model'];
            helper_object['id'] = global_tracks['tracks'][indexes[i]]['id'];
            helper_object['name'] = global_tracks['tracks'][indexes[i]]['name'];
            helper_object['manufacturer'] = global_tracks['tracks'][indexes[i]]['sensor']['properties']['manufacturer'];
            helper_object['begin'] = (new Date(global_tracks['tracks'][indexes[i]]['begin']).toLocaleString());
            helper_object['url'] = calendar.urlTracks + global_tracks['tracks'][indexes[i]].id + "/preview";
            helper_object['length'] = global_tracks['tracks'][indexes[i]]['length'].toFixed(2);

            var seconds_passed = new Date(global_tracks['tracks'][indexes[i]]['end']).getTime() - new Date(global_tracks['tracks'][indexes[i]]['begin']).getTime()
            var seconds = seconds_passed / 1000;
            var timeoftravel = seconds / 60;
            // time of travel is in minutes
            // convert to the right format. of hh:mm:ss;
            date_for_seconds = new Date(null);
            date_for_seconds.setSeconds(seconds);
            // date_hh_mm_ss holds the date in the hh:mm:ss format
            date_hh_mm_ss = date_for_seconds.toISOString().substr(11, 8)

            helper_object['travelTime'] = date_hh_mm_ss;
            tracks_builder.push(helper_object);
          }
          $scope.tracks = tracks_builder;
        }
      };

      var global_tracks;

      $scope.prevMonth = function(data) {

        var monthyear = month_number_mapping[data.month] + data.year.toString();
        // rewrite is a function that is used to rewrite the dates of the tracks in the calendar.
        rewrite(global_tracks);

        var total_tracks = 0;
        var total_distance = 0;
        var total_time = 0;

        for (var i = 0; i < global_tracks.tracks.length; i++) {
          // global_tracks holds the list of all the tracks of the user.
          var datestart = global_tracks.tracks[i].begin;
          var dateobject = new Date(datestart);
          var string_date = dateobject.toString();
          var array_string_date = string_date.split(" ");
          var stripped_date = (array_string_date[1] + array_string_date[3]);
          if (stripped_date == monthyear) {
            // if the tracks belongs to the month that the current view is displaying, then we use this value to include it in the count for
            // the monthly statistics.
            total_tracks++;
            total_distance += global_tracks.tracks[i]['length'];
            total_time += (new Date(global_tracks.tracks[i].begin).getTime() - new Date(global_tracks.tracks[i].end).getTime());
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
        // Total distance is total_distance
        // Total number of tracks is total_tracks
        // Total time is date_hh_mm_ss in the same format.
      };

      $scope.nextMonth = function(data) {
        $scope.msg = "You clicked (next) month " + data.month + ", " + data
          .year;
        rewrite(global_tracks);
        var monthyear = month_number_mapping[data.month] + data.year.toString();
        var total_tracks = 0;
        var total_distance = 0;
        var total_time = 0;
        for (var i = 0; i < global_tracks.tracks.length; i++) {
          var datestart = global_tracks.tracks[i].begin;
          var dateobject = new Date(datestart);
          var string_date = dateobject.toString();
          var array_string_date = string_date.split(" ");
          var stripped_date = (array_string_date[1] + array_string_date[3]);
          if (stripped_date == monthyear) {
            total_tracks++;
            total_distance += global_tracks.tracks[i]['length'];
            total_time += (new Date(global_tracks.tracks[i].begin).getTime() -
              new Date(global_tracks.tracks[i].end).getTime());
          }
        }
        var date_for_seconds = new Date(null);
        date_for_seconds.setSeconds(total_time / 1000);
        var date_hh_mm_ss = date_for_seconds.toISOString().substr(11, 8)
        $scope.total_tracks = total_tracks;
        $scope.total_time = date_hh_mm_ss;
        $scope.total_distance = total_distance.toFixed(2);
        if (total_tracks == 0) {
          $scope.nostatistics = true;
        } else {
          $scope.nostatistics = false;
        }

        // Total distance is total_distance
        // Total number of tracks is total_tracks
        // Total time is date_hh_mm_ss in the same format.

      };
      var datetrial;
      url = calendar.urlUsers + username + "/tracks?limit=10000";
      var global_tracks_array_begin = [];
      var global_tracks_array_begin_stripped_date = [];

      //  Keeps track of the number of tracks for each day in the form of a hashmap, only days that have a track are present in the hashmap.
      var date_count = {};

      function rewrite(trackslist) {
        // The function used to render the html content corresponding to a day on the calendar. The car icon with the number of tracks on a date is the functionality of this function.
        for (var i = 0; i < trackslist['tracks'].length; i++) {

          var datestart = trackslist.tracks[i]['begin'];
          var dateobject = new Date(datestart);
          var string_date = dateobject.toString();
          var array_string_date = string_date.split(" ");
          var stripped_date = (array_string_date[0] + array_string_date[1] + array_string_date[2]);
          MaterialCalendarData.setDayContent(dateobject, (
            '<i class="material-icons">directions_car</i><span>' + date_count[stripped_date] + '</span>'))
        }
      }

      tracks_calendar.get(url).then(function(data) {
        // This get requst populates the global variable with the tracks required.

        // The current date is used to find the details of the current month.
        var currentmonth = new Date();
        var monthyear = currentmonth.toString().split(" ")[1] + currentmonth.toString().split(" ")[3];
        global_tracks = data.data;
        for (var i = 0; i < global_tracks['tracks'].length; i++) {
          var datestart = global_tracks.tracks[i]['begin'];
          var dateobject = new Date(datestart);
          var string_date = dateobject.toString();
          var array_string_date = string_date.split(" ");
          var stripped_date = (array_string_date[0] + array_string_date[1] + array_string_date[2]);
          // If the date of the track is already present, then its value has to be incremented. Else, this date has not been encountered earlier, so add a new entry for this date.
          if (date_count[stripped_date] != undefined) {
            date_count[stripped_date]++;
          } else {
            date_count[stripped_date] = 1;
          }
          global_tracks_array_begin_stripped_date.push(stripped_date);
          global_tracks_array_begin.push(dateobject.toString());
        }

        rewrite(global_tracks);
        var total_time = 0;
        var total_tracks = 0;
        var total_distance = 0;
        for (var i = 0; i < global_tracks.tracks.length; i++) {
          var datestart = global_tracks.tracks[i].begin;
          var dateobject = new Date(datestart);
          var string_date = dateobject.toString();
          var array_string_date = string_date.split(" ");
          var stripped_date = (array_string_date[1] + array_string_date[3]);
          // calculating the monthly statistics for the first month that is displayed in the page. This months would be a part of the current date and time

          if (stripped_date == monthyear) {
            total_tracks++;
            total_distance += global_tracks.tracks[i]['length'];
            total_time += (new Date(global_tracks.tracks[i].begin).getTime() - new Date(global_tracks.tracks[i].end).getTime());
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
        $scope.onload = false;
      });
      $scope.tooltips = true;

      // no flag.
      $scope.setDayContent = function(date) {
        // set the content of the day when there are no tracks to an empty element.
        return ("<p></p>")

      }
      $scope.goToActivity = function(trackid) {
        //redirect to the track analytics page.
        $state.go('home.chart', {
          'trackid': trackid
        });

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
