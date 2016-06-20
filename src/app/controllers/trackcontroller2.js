angular.module('app')
  .controller('TrackListCtrl', ['$scope', 'trackService', '$http', '$rootScope',
    'visibilityService',
    function(
      $scope, trackService, $http, $rootScope, visibilityService) {
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
    }
  ])

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
  ])
  .factory('visibilityService', ['$rootScope', function($rootScope) {
    return {
      result: $rootScope.popoverIsVisible
    };
  }])
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
  }])
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
