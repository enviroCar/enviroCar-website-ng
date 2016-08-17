angular.module('app')
.controller('SegmentDrawController',['$scope','leafletDrawEvents','$mdMedia','Geo',function($scope, leafletDrawEvents){
    		
    var drawnItems = new L.FeatureGroup();

    angular.extend($scope, {
      map: {
        center: {
          lat: 51.92,
          lng: 7.626,
          zoom: 13
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
              console.log($scope.paths);


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
          console.log("being edited");
          //{leafletEvent, leafletObject, model, modelName} = payload
          var leafletEvent, leafletObject, model, modelName; //destructuring not supported by chrome yet :(
          leafletEvent = payload.leafletEvent, leafletObject = payload.leafletObject, model = payload.model,
          modelName = payload.modelName;
         // for(var i = 0 ; i < )
          //console.log(leafletEvent);
          console.log(drawnItems);
          console.log(drawnItems._layers);
          console.log(Object.keys(drawnItems._layers))
          console.log(eventName);
          if((Object.keys(drawnItems._layers)).length < 1 || eventName=='draw:edited' || eventName=='draw:deleted' )
          {
            console.log("did not come for edit");
              handle[eventName.replace('draw:','')](e,leafletEvent, leafletObject, model, modelName);
              $scope.paths = {};

              for(key in drawnItems._layers)
              {
                if(drawnItems._layers.hasOwnProperty(key))
                {
                  console.log(key);
                  console.log( drawnItems._layers[key])
                  var arrayPoints = drawnItems._layers[key]._latlngs;
                
                  for(var i = 0 ; i < arrayPoints.length ; i++)
                  {
                    console.log("number of points in the drawnItems");
                    $scope.paths['p'+i.toString()] = {
                      'type':'circle',
                      'radius': 50,
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
          console.log($scope.paths);
          console.log(drawnItems);
        });
    });
}])