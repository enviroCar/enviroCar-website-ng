angular.module('app')
  .controller('SampleController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.removeMarker = function (index) {
      console.log($rootScope.markers)
      delete $rootScope.markers[index]
      console.log(index + 'index is')
      $rootScope.paths = JSON.parse(JSON.stringify({}))
      var countKey = 0
      for (var key in $rootScope.markers) {
        if ($rootScope.markers.hasOwnProperty(key)) {
           $rootScope.paths['c'+countKey.toString()] = {
            type: "circle",
                    radius: $rootScope.slider.value*5,
                    latlngs: {
                      lat:$rootScope.markers[key].lat,
                      lng:$rootScope.markers[key].lng
                    },
                    color: "#0065A0",
                    opacity: 0.5,
                    smoothFactor: 1,
                    message: "**.**Km"

          } 
          countKey++
        }
      }
      if (countKey >= 2) {
        // the path has to be added.
        var latlngsArray = []
        for (key in $rootScope.markers) {
          if ($rootScope.markers.hasOwnProperty(key))
            latlngsArray.push({lat: $rootScope.markers[key].lat, lng: $rootScope.markers[key].lng})
          console.log('came here')
        }
        $rootScope.paths.p1 = {
         
            color: 'green',
            weight: 5,
            latlngs: latlngsArray
        }
      } else {
        console.log("came to else")
        delete $rootScope.paths.p1;
      }
    }
  }])
