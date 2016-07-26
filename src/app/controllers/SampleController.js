angular.module('app')
  .controller('SampleController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.removeMarker = function (index) {
      console.log($rootScope.markers)
      delete $rootScope.markers[index]
      console.log(index + 'index is')
      var countKey = 0
      for (var key in $rootScope.markers) {
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
  }])
