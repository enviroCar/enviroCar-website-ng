angular.module('app')
  .controller('SegmentIndependentController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    console.log('SegmentIndependentController fired')
    var markersArray = []
    angular.extend($scope, {
      london: {
        lat: 51.505,
        lng: -0.09,
        zoom: 8
      },
      events: {},
    })

    $rootScope.paths = {}
    $rootScope.markers = {}
    var countunique = 0
    $scope.$on('leafletDirectiveMap.segmentMap.click', function (event, args) {
      var leafEvent = args.leafletEvent
      markersArray.push({
        lat: leafEvent.latlng.lat,
        lng: leafEvent.latlng.lng
      })
      $rootScope.markers[countunique] = {
        lat: leafEvent.latlng.lat,
        lng: leafEvent.latlng.lng,
        focus: false,
        message: '<div ng-controller="SampleController"><md-button class="white-bg" ng-click=removeMarker(' + countunique + ')>Delete Marker</md-button>',
        draggable: true,
        id: countunique
      }
      redrawPaths()
      console.log($rootScope.paths)
      countunique++
      console.log(markersArray)
      console.log($rootScope.markers[0])
    })
    function redrawPaths () {
      var countKey = 0
      for (key in $rootScope.markers) {
        if ($rootScope.markers.hasOwnProperty(key)) {
          countKey++
        }
      }
      if (countKey >= 2) {
        // the path has to be added.
        $rootScope.paths = JSON.parse(JSON.stringify({}))
        var latlngsArray = []
        for (key in $rootScope.markers) {
          if ($rootScope.markers.hasOwnProperty(key))
            latlngsArray.push({lat: $rootScope.markers[key].lat, lng: $rootScope.markers[key].lng})
          console.log('came here')
        }
        $rootScope.paths = {
          p1: {
            color: 'green',
            weight: 3,
            latlngs: latlngsArray
          }
        }
      } else {
        $rootScope.paths = JSON.parse(JSON.stringify({}))
      }
    }
    $scope.$on('leafletDirectiveMarker.segmentMap.dragend', function (event, args) {
      var id = args.model.id
      for (key in $rootScope.markers) {
        if ($rootScope.markers.hasOwnProperty(key) && key == id) {
          $rootScope.markers[key] = JSON.parse(JSON.stringify(args.model))
        }
      }
      console.log(args)
      redrawPaths()
      console.log('fired drag')
      console.log($rootScope.markers)
    })
    $scope.resetPoints = function () {
      countunique = 0
      $rootScope.paths = {}
      $rootScope.markers = {}
    }
    $scope.searchForPoints = function () {}
  }])
