angular.module('app')
  .controller("filterTracksController", ['$scope', '$rootScope', '$http',
    '$stateParams', '$state', '$mdDialog', '$mdMedia', 'tracks_calendar',
    function($scope, $rootScope, $http, $stateParams, $state, $mdDialog,
      $mdMedia, tracks_calendar) {
      $scope.dateCustomShow = false;
      $scope.distanceCustomShow = false;
      $scope.submitButtonShow = false;

      $scope.dateCustom = "All days";
      $scope.distanceCustom = "All lengths";
      $scope.dateStartCustom = new Date();
      $scope.dateEndCustom = new Date();
      $http.defaults.headers.common = {
        'X-User': $rootScope.globals.currentUser.username,
        'X-Token': $rootScope.globals.currentUser.authdata
      };

      function initializeDefaultValues() {
        console.log("came to date");
        $scope.dateEndCustom = new Date();
        var startdate = new Date($scope.dateEndCustom);
        startdate.setFullYear($scope.dateEndCustom.getFullYear() - 1);
        $scope.dateStartCustom = new Date(startdate);
      }
      $scope.$on('$viewContentLoaded', $scope.init);
      $scope.init = function() {
        $scope.filterSelected = "Duration";
      }

      $rootScope.showPopOver = function(trackid) {
        $rootScope.popoverIsVisible = true;
        $rootScope.previewurl = trackid;
        console.log(trackid);
        console.log("show pop");
      }

      $scope.hidePopOver = function() {
        $rootScope.previewurl = "";
        $rootScope.popoverIsVisible = false;
        console.log("hide pop");
      }

      $scope.goToActivity = function(trackid) {
        console.log("came here");
        //redirect to the track analytics page.
        $state.go('home.chart', {
          'trackid': trackid
        });

        console.log("fired");
      }

      $scope.defaultDatesAll = function() {
        $scope.dateCustom = "All days"
        $scope.dateCustomShow = false;
        if ($scope.distanceCustomShow == false)
          $scope.submitButtonShow = false;
      }

      $scope.startDateChange = function() {
        console.log("came here 1");
        console.log($scope.dateStartCustom)
        $scope.dateStartObject = new Date($scope.dateStartCustom);
        console.log($scope.dateStartObject);
      }

      $scope.endDateChange = function() {
        console.log("came here 2");
        console.log($scope.dateEndCustom);
        $scope.dateEndObject = new Date($scope.dateEndCustom);
        console.log($scope.dateEndObject);
      }

      $scope.defaultDatesCustom = function() {
        $scope.dateCustom = "Custom";
        //  initializeDefaultValues();
        $scope.dateCustomShow = true;
        $scope.submitButtonShow = true;
      }

      $scope.defaultDistanceAll = function() {
        $scope.distanceCustom = "All lengths"
        $scope.distanceCustomShow = false;
        if ($scope.dateCustomShow == false)
          $scope.submitButtonShow = false;
      }

      $scope.defaultDistanceCustom = function() {
        $scope.distanceCustom = "Custom"
        $scope.distanceCustomShow = true;
        $scope.submitButtonShow = true;
      }
      $scope.itemtest = 5;

      $scope.submitButtonAction = function() {
        $scope.submitbuttonclicked = true;
        if ($scope.distanceCustom == "Custom") {
          //only in this case will the filter be applied.
          $scope.modifiedMinDistance = $scope.minDistanceFilter;
          $scope.modifiedMaxDistance = $scope.maxDistanceFilter;
        }
        if ($scope.dateCustom == "Custom") {
          console.log("start and end value");
          console.log($scope.dateStartCustom);
          console.log($scope.dateEndCustom);
          console.log($scope.dateStartObject);
          console.log($scope.dateEndObject);
          // only in this case will the filter be applied to the date filtering capabilities.
          $scope.modifiedStartDate = $scope.dateStartObject.getTime();
          $scope.modifiedEndDate = $scope.dateEndObject.getTime();
        }
      }
      $scope.dateFilter = function(item) {
        console.log($scope.dateCustom);
        if ($scope.dateCustom == "All days") {
          console.log("never came here");
          return (item.Start);
        } else {

          if ($scope.modifiedStartDate == undefined) {
            $scope.modifiedStartDate = 0;
          }
          if ($scope.modifiedEndDate == undefined) {
            $scope.modifiedEndDate = new Date().getTime();
          }
          console.log(item.StartDateObject);
          console.log($scope.modifiedStartDate);
          console.log($scope.modifiedEndDate);
          return (item.StartDateObject > $scope.modifiedStartDate && item.StartDateObject <
            $scope.modifiedEndDate)
        }
      }

      $scope.distanceFilter = function(item) {
        console.log($scope.distanceCustom);

        if ($scope.distanceCustom == "All lengths") {
          return (item.Distance)
        } else {
          if ($scope.modifiedMinDistance == undefined) {
            $scope.modifiedMinDistance = 0;
          }
          if ($scope.modifiedMaxDistance == undefined) {
            $scope.modifiedMaxDistance = Infinity;
          }
          return (item.Distance > $scope.modifiedMinDistance && item.Distance <
            $scope.modifiedMaxDistance)
        }
      }

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
                $scope.currenttrack['consumption100Km'] = "NA";

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
                $scope.currenttrack['co2gKm'] = "NA";

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
      $scope.Modified = "Modified";
      $scope.filterOptions = ["Start", "Distance", "Duration", "Name",
        "Vehicle", "TrackId", "Modified"
      ];
      if ($stateParams.user == "") {
        username = $rootScope.globals.currentUser.username;
      } else {
        username = $stateParams.user;
      }
      $scope.tracks = [];
      var url = 'https://envirocar.org/api/stable/users/' + username +
        '/tracks?limit=1000';
      $http.get(url).then(function(data) {
        //$scope.totalTracks = data.data.tracks.length;
        console.log("filterhttp")
        console.log(data.data);
        var tracks = [];
        for (var i = 0; i < data.data.tracks.length; i++) {
          var track_helper = {};
          track_helper['TrackId'] = data.data.tracks[i].id;
          track_helper['Name'] = data.data.tracks[i].name;
          track_helper['Start'] = data.data.tracks[i].begin;
          track_helper['StartDateObject'] = new Date(data.data.tracks[i].begin)
            .getTime();
          track_helper['Vehicle'] = data.data.tracks[i].sensor.properties
            .model;
          track_helper['Distance'] = data.data.tracks[i]['length'].toFixed(
            2);
          track_helper['Modified'] = data.data.tracks[i].modified;
          var seconds_passed = new Date(data.data.tracks[i]
              .end).getTime() -
            new Date(data.data.tracks[i]
              .begin).getTime();
          track_helper['Duration'] = seconds_passed;

          var seconds = seconds_passed / 1000;
          var timeoftravel = seconds / 60;
          // time of travel is in minutes
          // convert to the right format. of hh:mm:ss;
          date_for_seconds = new Date(null);
          date_for_seconds.setSeconds(seconds);
          date_hh_mm_ss = date_for_seconds.toISOString().substr(
            11, 8)
          track_helper['DurationString'] = date_hh_mm_ss;
          tracks.push(track_helper);
        }
        $scope.tracks = tracks;
      })
      $scope.$watch('filterSelected', function() {
        //  $scope.filterOrig = $scope.filterSelected;
        console.log("chnages");
      })

      $scope.changeFilter = function(d) {
        $scope.filterSelected = d;
        if (d == "Start" || d == "Modified") {
          d == "Start" ? $scope.filterOrig = "-Start" : $scope.filterOrig =
            "-Modified";
        } else
          $scope.filterOrig = d;
        console.log($scope.filterOrig);
      }
    }
  ])
