angular.module('app')
  .controller('SegmentIndependentController', ['$scope','$geolocation','$mdToast', '$rootScope', '$http', function ($scope,$geolocation, $mdToast, $rootScope, $http) {
    console.log('SegmentIndependentController fired fwnfjenfef')
    var markersArray = []
    var countunique = 0

$rootScope.paths = {}
    $rootScope.markers = {}
    $rootScope.slider = {
    value: 50,
    options: {
      floor: 10,
      ceil: 90,
      minLimit: 10,
      maxLimit: 90,
      id: 'tolerance',
      onChange: function(id) {
          console.log($rootScope.paths)
        
          for (key in $rootScope.paths) {
            console.log(key + "is key")
              if ($rootScope.paths.hasOwnProperty(key) && key!='p1') {
          console.log("came here");
  console.log($rootScope.paths[key])
        $rootScope.paths[key].radius = $rootScope.slider.value*5;
        }
      }
      console.log($rootScope.paths)
          
      }

    }
};

  $geolocation.getCurrentPosition({
            timeout: 6
         }).then(function(position) {
           console.log(position);
           console.log("came here");
            $scope.myPosition = position;
         });
 

    angular.extend($scope, {
      
      center: {
        lat: 51.505,
        lng: 7.09,
        zoom: 14
      },
      events: {},
    })

      
    
    $scope.$on('leafletDirectiveMap.segmentMap.click', function (event, args) {
      // Add validations if number of markers > 10;
      console.log();
      if(Object.keys($rootScope.markers).length >= 10)
      {
        console.log("cannot add");
         $mdToast.show(
             $mdToast.simple()
                 .textContent('Cannot add more than 10 points!')
                 .hideDelay(4000)
           );
      }
      else{
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
      }
    })
    function redrawPaths () {
      var countKey = 0
      for (key in $rootScope.markers) {
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
      console.log($rootScope.paths);
      if (countKey >= 2) {
        // the path has to be added.
       // $rootScope.paths = JSON.parse(JSON.stringify({}))
        var latlngsArray = []
        for (key in $rootScope.markers) {
          if ($rootScope.markers.hasOwnProperty(key))
            latlngsArray.push({lat: $rootScope.markers[key].lat, lng: $rootScope.markers[key].lng})
          console.log('came here')
        }
        $rootScope.paths['p1'] = {
          
            color: 'green',
            weight: 5,
            latlngs: latlngsArray
         
        }
      } else {
        $rootScope.paths.p1 = JSON.parse(JSON.stringify({}))
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
