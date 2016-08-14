angular.module('app')
  .controller('SegmentIndependentController', ['$scope','$mdDialog','$mdMedia','GeolocationService','$geolocation','$mdToast', '$rootScope', '$http', function ($scope, $mdDialog,$mdMedia, GeolocationService, $geolocation, $mdToast, $rootScope, $http) {
    console.log('SegmentIndependentController fired fwnfjenfef')
    var markersArray = []
    var countunique = 0
    $scope.showleaflet = false;
    $scope.notSearching = true;
    $scope.statisticsPresent = false;
    $rootScope.paths = {};
    var respGlobal = {};
    $scope.selectModel  = 'All Segments';
     var availablePhen = {};
     var unitsOfPhenoms = {'Speed':'Km/h','Consumption':'l/h','MAF':'g/h','Calculated MAF':'g/h','CO2':'Kg/h'}
     $scope.options = {
              chart: {
                type: 'discreteBarChart',
                height: 200,
                margin: {
                  top: 10,
                  right: 0,
                  bottom: 70,
                  left: 50
                },
                x: function(d) {
                  return d.label;
                },
                y: function(d) {
                  return d.value;
                },
                showValues: true,
                valueFormat: function(d) {
                  return d3.format(',.4f')(d);
                },
                duration: 500,
                xAxis: {
                  axisLabel: 'Max vs Avg'
                },
                yAxis: {
                  axisLabel: 'Speed(Km/Hr)',
                  axisLabelDistance: -15
                },
                tooltip: {
                  contentGenerator: function(d)
                  {
                    console.log(d);
                    var html = '<h3><b>' + d.data.label + '</b> = ' + d.data.value.toFixed(2) + '</h3>' ;
                    return html;
                  }
                }
              }
            };
           // $scope.data = {};
            $scope.data = [];
  $scope.items = [
    {
      id: 1,
      name: 'Test'
    },
    {
      id: 2,
      name: 'Asdf'
    }
  ];
  
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
console.log("workibg ")
 

    angular.extend($scope, {
      
      center: {
        lat:51.960,
        lng: 7.6261,
        zoom: 15
      },
      events: {},
    })
 GeolocationService().then(function (position) {
        $scope.position = position;
        console.log("position ");
        console.log(position);
        $scope.center = {
          lat:position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 12
        }
        $scope.showleaflet = true; 
       /*  $mdToast.show(
             $mdToast.simple()
                 .textContent('Please wait while we load your location')
                 .hideDelay(4000)
           );*/
    }, function (reason) {
      console.log(reason)
        $scope.message = "Could not be determined."
        console.log("could not be")
        $scope.showleaflet = true;
    });




      
    
    $scope.$on('leafletDirectiveMap.segmentMap.click', function (event, args) {
      // Function to add the markers to the map.
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
        // Validations for distance // only let it be added if distance between the 2 is lesser than 5 km
        // skip distance validation of this is the first point being added
        // 2 cases . 1 CountUnique is 0 or the length of number of markers is 0
       /* if(countunique != 0 && Object.keys($rootScope.markers).length != 0)
        {
           // there is 1 point already added in the map 
           for(var rev = countunique ; rev >= 0 ; rev--)
           {
             //if($rootScope.markers)
           }
           
        }
        */
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
    $scope.searchForPoints = function () {
      $scope.notSearching = false;
      // Search for points on the server side 
      var coordinates = [];
      console.log("came here");
      for (key in $rootScope.markers) {
          if ($rootScope.markers.hasOwnProperty(key))
          {
            coordinates.push([$rootScope.markers[key].lng, $rootScope.markers[key].lat]);
          }
      }
      console.log(coordinates);
         var dataput = {
          "type": "Feature",
          "geometry": {
            "type": "LineString",
            "coordinates": coordinates
          },
          "timeInterval": {
            "dateStart": "2010-06-08T11:29:10Z",
            "dateEnd": "2026-09-08T11:29:10Z",
            "daytimeStart": "1:30",
            "daytimeEnd": "15:30"
          },
          "tolerance": $scope.slider.value
        };

        var req = {
          method: 'POST',
          url: "https://envirocar.org/envirocar-rest-analyzer/dev/rest/route/statistics",
          data: dataput
        }
         delete $http.defaults.headers.common["X-User"];
       delete $http.defaults.headers.common["X-Token"];
        $http(req).then(function(resp) {
          respGlobal = resp;
          console.log(resp);
          responsehandler(resp);
          $scope.notSearching = true;
        })


    }
    $scope.selectedPhenom = 'Speed';
    $scope.pointsCount = 0;
    $scope.phenomChanged = function(s)
    {
      $scope.selectedPhenom = s;
      $scope.data = [{
        key: s,
        values: [{
          'label':'Max',
          'value': availablePhen[s]['max']
        },
        {
          'label':'Avg',
          'value': availablePhen[s]['avg']
        }]
      }]
      $scope.options.chart.yAxis.axisLabel = s + "(" + unitsOfPhenoms[s] + ")";
      $scope.pointsCount = availablePhen[s]['count'];
      console.log($scope.selectedPhenom);
    }
    $scope.segmentDefault = 0;
    $scope.segmentChanged = function(index)
    {
      console.log(index);
      var segmentIndex = index-1;
      if(index == 0)
      {
        responsehandler(respGlobal);
      }
      else{
      var impPhen = ['Speed','Consumption','CO2','MAF','Calculated MAF'];
            for(var i = 0 ; i < respGlobal.data.properties.length ; i++)
            {
              console.log("recorded here");
                if(impPhen.indexOf(respGlobal.data.features[segmentIndex].properties[i].name)>-1)
                {
                  availablePhen[respGlobal.data.features[segmentIndex].properties[i].name] = respGlobal.data.features[segmentIndex].properties[i];
                }
            }
            console.log(respGlobal);
            $scope.keys = Object.keys(availablePhen);
          //  $scope.selectedPhenom = 'Speed'
            console.log($scope.keys);
            $scope.data = [{
              key:$scope.selectedPhenom,
              values:[{
                'label':'Max',
                'value':availablePhen[$scope.selectedPhenom]['max']
              },
              {
                'label':'Avg',
                'value':availablePhen[$scope.selectedPhenom]['avg']
              }]
              
            }]
            $scope.pointsCount = availablePhen[$scope.selectedPhenom]['count'];
      }
    }
    function responsehandler(resp)
    {
      if(resp.data.properties.length > 0)
      {
        $scope.statisticsPresent = true;
            // There is some data returned by the server.
            $scope.segments = [{'ind':0,'value':'All Segments'}];
            if(resp.data.features.length > 1)
            {
              for(var i = 0 ; i < resp.data.features.length ; i++)
              {
                $scope.segments.push({'ind':(i+1),'value':('Segment ' + (i+1).toString())})
              }
            }
            var impPhen = ['Speed','Consumption','CO2','MAF','Calculated MAF'];
            for(var i = 0 ; i < resp.data.properties.length ; i++)
            {
              console.log("recorded here");
                if(impPhen.indexOf(resp.data.properties[i].name)>-1)
                {
                  availablePhen[resp.data.properties[i].name] = resp.data.properties[i];
                }
            }
            console.log(resp);
            $scope.keys = Object.keys(availablePhen);
           // $scope.selectedPhenom = 'Speed'
            console.log($scope.keys);
            $scope.data = [{
              key:$scope.selectedPhenom,
              values:[{
                'label':'Max',
                'value':availablePhen[$scope.selectedPhenom]['max']
              },
              {
                'label':'Avg',
                'value':availablePhen[$scope.selectedPhenom]['avg']
              }]
              
            }]
            $scope.pointsCount = availablePhen[$scope.selectedPhenom]['count'];
            console.log($scope.data);
            console.log(availablePhen);
            //console.log($scope.selectModel1);

      }
      else{
        showObject = {
            controller: TracksNotPresentController,
            templateUrl: 'app/views/TracksNotReturned.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: useFullScreen
          }
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show(showObject)
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

      }
       
    }


     function TracksNotPresentController($scope, $mdDialog, $state) 
     {
      $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
    }




  }])

  
.factory("GeolocationService", ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
    return function () {
        var deferred = $q.defer();

        if (!$window.navigator) {
            $rootScope.$apply(function() {
                deferred.reject(new Error("Geolocation is not supported"));
            });
        } else {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                $rootScope.$apply(function() {
                    deferred.resolve(position);
                });
            }, function (error) {
                $rootScope.$apply(function() {
                    deferred.reject(error);
                });
            });
        }

        return deferred.promise;
    }
}]);