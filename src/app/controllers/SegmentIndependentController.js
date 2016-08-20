/*  SegmentIndependentController
    This Controller handles all interactions in the segment.html page
    1) Creating Segments using polyline of Leaflet-draw
    2) Creates circle paths around segment points to show geographical search region
    3) Search for points
    4) View bar chart corresponding to data returned by server
*/

angular.module('app')
  .controller('SegmentIndependentController', ['$scope','leafletDrawEvents','$mdDialog','$mdMedia','GeolocationService','$geolocation','$mdToast', '$rootScope', '$http', function ($scope, leafletDrawEvents, $mdDialog,$mdMedia, GeolocationService, $geolocation, $mdToast, $rootScope, $http) {
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
    // creating a new featureGroup to refer and access the drawnitems and all events associated with them.
    var drawnItems = new L.FeatureGroup();
    $scope.currentStep =  0;

    // The map configuration with the settings for leaflet draw modified according to our needs and use case.
    // We are only making use of the polyLine feature for drawing the segment track.
    angular.extend($scope, {
      map: {
        center: {
          lat:51.960,
        lng: 7.6261,
        zoom: 15
        },
        drawOptions: {
          position: "topleft",
          draw: {
            polyline: {
              metric: false,
               shapeOptions: {
                color: '#F80505',
                weight: 10
              }
            },
            polygon: false,
            rectangle: false,
            circle: false,
            marker: false
          },
          edit: {
            featureGroup: drawnItems,
            remove: true
          }
        }

      },
         paths: {

        }
    });

    // A object created to handle each of the operations that can be performed on leaflet draw.
    var handle = {
      created: function(e,leafletEvent, leafletObject, model, modelName) {
        drawnItems.addLayer(leafletEvent.layer);
      },
      edited: function(arg) {},
      deleted: function(arg) {
        var layers;
        layers = arg.layers;
        drawnItems.removeLayer(layer);
      },
      drawstart: function(arg) {},
      drawstop: function(arg) {},
      editstart: function(arg) {},
      editstop: function(arg) {},
      deletestart: function(arg) {},
      deletestop: function(arg) {}
    };

    var drawEvents = leafletDrawEvents.getAvailableEvents();
    drawEvents.forEach(function(eventName){
        $scope.$on('leafletDirectiveDraw.' + eventName, function(e, payload) {
          //{leafletEvent, leafletObject, model, modelName} = payload
          var leafletEvent, leafletObject, model, modelName; //destructuring not supported by chrome yet :(
          leafletEvent = payload.leafletEvent, leafletObject = payload.leafletObject, model = payload.model,
          modelName = payload.modelName;
          if((Object.keys(drawnItems._layers)).length < 1 || eventName=='draw:edited' || eventName=='draw:deleted' )
          {
            /* By setting this condition (Object.keys(drawnItems._layers)).length < 1 we ensure that we only register actions when
               we are handling only one drawnItem on the map at a time. Effectively this ensures that we have only one polyline in the map ata given point of time.
            */
              // handle the filtered events that pass through our requirements.
              handle[eventName.replace('draw:','')](e,leafletEvent, leafletObject, model, modelName);
              $scope.paths = {};

              for(key in drawnItems._layers)
              {
                if(drawnItems._layers.hasOwnProperty(key))
                {
                  /* Since the shape created gets alloted a random identifier in the _layers object that acts as the key for
                     that drawnItem, we make use of keys that are not a part of the prototype of the object.
                  */

                  // The latitude and longitude is stored in the _latlngs object.
                  var arrayPoints = drawnItems._layers[key]._latlngs;

                  // Around each of these points in the polyline layer created, we draw a circle marker around it.
                  // The circle marker is named as p0,p1,p2 and so on.
                  for(var i = 0 ; i < arrayPoints.length ; i++)
                  {
                    console.log("number of points in the drawnItems");
                    $scope.paths['p'+i.toString()] = {
                      'type':'circle',
                      'radius': $rootScope.slider.value,
                      'color': '#0065A0',
                      'latlngs': {
                        'lat': arrayPoints[i].lat,
                        'lng': arrayPoints[i].lng
                      }
                    }
                  }
                }
              }
          }
        });
    });
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
    $rootScope.markers = {}
    $rootScope.slider = {
    value: 200,
    options: {
      floor: 200,
      ceil: 5000,
      id: 'tolerance',
      translate: function(value) {
          return value + 'm';
      },
      showTicksValues: 1600,
      onChange: function(id) {
         // Changes the value of the radius of the circle paths when a change in the slider is fired.
         for (key in $scope.paths) {
              if ($scope.paths.hasOwnProperty(key)) {
                    $scope.paths[key].radius = $rootScope.slider.value;
                }
            }
        }
    }
};

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

    }, function (reason) {
      console.log(reason)
        $scope.message = "Could not be determined."
        console.log("could not be")
        $scope.showleaflet = true;
    });
    /*
    ARTIFACTS LEFT FROM THE CUSTOM IMPLEMENTATION OF LEAFLET WITH MARKERS
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
                    radius: $rootScope.slider.value,
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
      $scope.paths = {}
      $rootScope.markers = {}
      //drawnItems = new L.FeatureGroup();
      //drawnItems._layers = {};
      console.log(drawnItems);

    }*/
    $scope.searchForPoints = function () {
      $scope.notSearching = false;
      // Search for points on the server side
      var coordinates = [];
              for(key in drawnItems._layers)
              {
                if(drawnItems._layers.hasOwnProperty(key))
                {
                   var arrayPoints = drawnItems._layers[key]._latlngs;
                   for(var i = 0 ; i < arrayPoints.length ; i++)
                   {
                     coordinates.push([arrayPoints[i].lng,arrayPoints[i].lat]);
                   }
                }
              }
          // coordinates holds an array with the latitude and longitude of the points creating the segment in the map
         var dataput = {
          "type": "Feature",
          "geometry": {
            "type": "LineString",
            "coordinates": coordinates
          },
          "timeInterval": {
            "dateStart": "2010-06-08T11:29:10Z",
            "dateEnd": "2026-09-08T11:29:10Z",
            "daytimeStart": "00:00",
            "daytimeEnd": "23:59"
          },
          "tolerance": $scope.slider.value
        };

        /* Further revisions could enable the user to set time of the segment, to not only explore it
           geographically but also to explore the difference in peak hours/Non Peak hours.
        */

        var req = {
          method: 'POST',
          url: "https://envirocar.org/envirocar-rest-analyzer/dev/rest/route/statistics",
          data: dataput
        }
         delete $http.defaults.headers.common["X-User"];
         delete $http.defaults.headers.common["X-Token"];
         // Headers to specifically accept application/json content from the server.
         // Note: in places where the http module does not work as expected, ensure you set the right content accept headers
         $http.defaults.headers.common = {
           'Accept':'application/json'
         };
        $http(req).then(function(resp) {
          // Store a global copy of the response for rerendering charts.
          respGlobal = resp;
          responsehandler(resp);
          // hides the loader and displays the graphs
          $scope.notSearching = true;
        })
    }
    // The phenomenon selected by default is Speed
    $scope.selectedPhenom = 'Speed';

    // The number of points returned by the server.
    $scope.pointsCount = 0;

    // Utility function to replace $scope.data with the phenomenon requested for.
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
    }
    // The default segment value is for All segments.
    $scope.segmentDefault = 0;

    // Utility function to recalculate the available phenomenon for the selected segment from the repGlobal variable that was previously saved.
    $scope.segmentChanged = function(index)
    {
      var segmentIndex = index-1;
      if(index == 0)
      {
        responsehandler(respGlobal);
      }
      else{
            var impPhen = ['Speed','Consumption','CO2','MAF','Calculated MAF'];
            for(var i = 0 ; i < respGlobal.data.properties.length ; i++)
            {
                if(impPhen.indexOf(respGlobal.data.features[segmentIndex].properties[i].name)>-1)
                {
                  availablePhen[respGlobal.data.features[segmentIndex].properties[i].name] = respGlobal.data.features[segmentIndex].properties[i];
                }
            }
            $scope.keys = Object.keys(availablePhen);
            // Replace $scope.data with the new data filled in availablePhen.
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
            // Generate the array for the dropdown of the segments
            var impPhen = ['Speed','Consumption','CO2','MAF','Calculated MAF'];
            for(var i = 0 ; i < resp.data.properties.length ; i++)
            {
                if(impPhen.indexOf(resp.data.properties[i].name)>-1)
                {
                  availablePhen[resp.data.properties[i].name] = resp.data.properties[i];
                }
            }
            // availablePhen is a intersection of the impPhen and the phenomenon returned by the server. Initially the default values it calculates are for the global all segments data returned by the server
            $scope.keys = Object.keys(availablePhen);
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
      else{
        // No data returned by the server.
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
    // Geolcation service that returns location of user based on html5 geolocation.
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
