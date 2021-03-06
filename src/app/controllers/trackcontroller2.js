/*
ARTIFACT LEFTOVER
angular.module('app')
  .controller('TrackListCtrl', ['$scope', '$mdDialog', '$mdMedia',
    'trackService', '$http', '$rootScope',
    'visibilityService', '$state', 'tracks_calendar',
    function(
      $scope, $mdDialog, $mdMedia, trackService, $http, $rootScope,
      visibilityService, $state, tracks_calendar) {
      //bind to service
      $scope.results = trackService.results;
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
    }
  ]);

  angular.module('app')
.controller('ImagePreviewController', ['$scope', '$http', '$rootScope',
    'visibilityService',
    function($scope, $http, $rootScope, visibilityService) {
      $scope.popoverIsVisible2 = false;
      $scope.value2 = $scope.popoverIsVisible2;
      $scope.url = "";
      $scope.$watch('$root.popoverIsVisible', function() {
        console.log("fired");
        $scope.popoverIsVisible2 = $rootScope.popoverIsVisible;
        if ($scope.popoverIsVisible2 == true) {
          $scope.url = 'https://envirocar.org/api/stable/tracks/' +
            $rootScope.previewurl + "/preview";
        } else {
          $scope.url = "/assets/images/715.gif";
        }
        $scope.value2 = $scope.popoverIsVisible2;
        console.log($scope.popoverIsVisible2);
      });
      console.log(visibilityService.result + "is service result");
      //$scope.popoverIsVisible = visibilityService.result;
      console.log($scope.popoverIsVisible + "is the value");
    }
  ]);

  angular.module('app')
  .factory('visibilityService', ['$rootScope', function($rootScope) {
    return {
      result: $rootScope.popoverIsVisible
    };
  }])

  angular.module('app')
  .factory('trackService', ['$http', '$rootScope', '$stateParams', function(
    $http, $rootScope, $stateParams) {
    var queryParams = {};
    var results = {};

    function setPagingAndStartRequest(pageSize, from) {
      queryParams.pageSize = pageSize;
      queryParams.from = from;
      _startRequest();
    }

    function _startRequest() {
      var username;
      if ($stateParams.user == "") {
        username = $rootScope.globals.currentUser.username;
      } else {
        username = $stateParams.user;
      }
      var req = {
        method: 'GET',
        url: 'https://envirocar.org/api/stable/users/' + username +
          '/tracks',
        headers: {
          'X-User': $rootScope.globals.currentUser.username,
          'X-Token': $rootScope.globals.currentUser.authdata,
          'Range': 'items=' + queryParams.from + '-' + (queryParams.from +
            queryParams.pageSize - 1)
        }
      }

      var rangeSettings = {
        size: queryParams.pageSize,
        from: queryParams.from
      };

      $http(req).then(function successCallback(response) {
        var range = response.headers('Content-Range');
        if (range) {
          results.total = parseInt(range.substring(range.indexOf('/') +
            1, range.length));
          results.hits = response.data.tracks.length;
          console.info(results);
        }

        results.tracks = response.data.tracks;
        console.log(results.tracks);
        for (var i = 0; i < results.tracks.length; i++) {
          results.tracks[i]['length'] = results.tracks[i]['length'].toFixed(
            2);

        }
        results.range = {
          start: rangeSettings.from,
          end: rangeSettings.from + rangeSettings.size
        };
      }, function errorCallback(response) {
        console.warn(response);
      });
    }

    return {
      setPagingAndStartRequest: setPagingAndStartRequest,
      results: results,
      queryParams: queryParams
    };
  }]);

  angular.module('app')
  .controller('PagingCtrl', ['$scope', 'trackService', function($scope,
    trackService) {
    //bind to the service
    $scope.results = trackService.results;

    //the pages array that is used to display the paging buttons
    $scope.pages = [];

    //show 5 tracks
    $scope.size = 5;

    //show 5 paging buttons
    $scope.shownPages = 5;

    //start with first page
    $scope.selectedPage = 1;

    //watch for changes and react
    $scope.$watch('results', function() {
      if ($scope.results.hits) {
        $scope.pages = [];

        var total = $scope.results.total;
        var fromIndex = $scope.results.range.start;

        $scope.selectedPage = (Math.ceil(fromIndex / $scope.size)) + 1;
        var firstShownPage = $scope.selectedPage - Math.floor($scope.shownPages /
          2);
        if (firstShownPage < 1) {
          firstShownPage = 1;
        }

        var lastShownPage = firstShownPage + $scope.shownPages - 1;
        if (lastShownPage >= $scope.selectedPage + Math.ceil((total -
            fromIndex) / $scope.size) - 1) {
          lastShownPage = $scope.selectedPage + Math.ceil((total -
            fromIndex) / $scope.size) - 1;
          firstShownPage = lastShownPage - $scope.shownPages + 1;

          if (firstShownPage < 1) {
            firstShownPage = 1;
          }
        }

        for (var i = firstShownPage; i <= lastShownPage; i++) {
          $scope.pages.push(i);
        }
      }
    }, true);

    $scope.showPaging = function() {
      if ($scope.results.total) {
        return $scope.results.total > $scope.size;
      }
      return false;
    };

    $scope.jumpToPage = function(idx) {
      $scope.selectedPage = idx;
      trackService.setPagingAndStartRequest($scope.size, (idx - 1) *
        $scope.size);
    };

    $scope.hasNoNextPage = function() {
      if ($scope.results.total) {
        var from = $scope.results.range.start;
        return (from + $scope.size) > $scope.results.total;
      }
      return false;
    };

    $scope.hasNoPreviousPage = function() {
      if ($scope.results.total) {
        var from = $scope.results.range.start;
        return from <= 0;
      }
      return false;
    };

    $scope.nextPage = function() {
      var from = $scope.results.range.start + $scope.size;
      trackService.setPagingAndStartRequest($scope.size, from);
    };

    $scope.previousPage = function() {
      var from = $scope.results.range.start - $scope.size;
      if (from < 0) {
        from = 0;
      }

      trackService.setPagingAndStartRequest($scope.size, from);
    };

    //initiate the first request with 5 entries starting from 0
    trackService.setPagingAndStartRequest($scope.size, 0);
  }])
*/
