'use strict';
/**
 * @ngdoc function
 * @name enviroCarApp.controller:chartController
 * @description
 * # ChartCtrl
 * chartController of the enviroCarApp
 */
angular.module('enviroCarApp')
  .controller('ChartCtrl', ['$state','$scope','$http','$rootScope','$timeout','$stateParams','factorysingletrack', function ($state, $scope,$http,$rootScope, $timeout,$stateParams,factorysingletrack) {
    console.log("came to controller of charts");
    //console.log("IMPORTANT VALUE"+$stateParams.trackid)
    $scope.options_pie = {
           chart: {
               type: 'pieChart',
               height: 420,
               x: function(d){return d.key;},
               y: function(d){return d.y;},
               showLabels: true,
               duration: 500,
               labelThreshold: 0.01,
               labelSunbeamLayout: true,
               legend: {
                   margin: {
                       top: 5,
                       right: 35,
                       bottom: 5,
                       left: 0
                   }
               }
           }
       };

       $scope.data_pie = [

       ];
    $scope.options = {
      chart: {
           type: 'lineWithFocusChart',
           height: 470,
           margin : {
               top: 20,
               right: 50,
               bottom: 40,
               left: 125
           },
           x: function(d){return d[0];},
           y: function(d){return d[1];},
           xAxis: {
              axisLabel: 'Time',
              showMaxMin: false,
              tickFormat: function(d) {
            var format = d3.time.format("%H:%M:%S");
                return format(new Date(d));
              }
          },
          x2Axis: {
             showMaxMin: false,
             tickFormat: function(d) {
           var format = d3.time.format("%H:%M:%S");
               return format(new Date(d));
             }
         },
          yAxis: {
             axisLabel: 'Values',
             tickFormat: function(d){
                 return d3.format(',.1f')(d);
             }
         },
         y2Axis: {
            tickFormat: function(d){
                return d3.format(',.1f')(d);
            }
        },

         }
     /* JSON data */
    };
    var latlongarray =[];
    var latinitial;
    var longinitial;
    angular.extend($scope, {
        center: {},
        paths: {},
        markers: {}
      });
    $scope.piechartselected = "Speed";

    var piechartsdata = {
      'Speed': [0,0,0,0,0,0],
      'Calculated MAF': [0,0,0,0,0,0],
      'Engine Load': [0,0,0,0,0,0],
      'Consumption': [0,0,0,0,0,0],
      'Intake Temperature': [0,0,0,0,0,0]
    };

    var rangeobjects = {
    'Speed': [[0,20,40,60,80,100],],
    'Calculated MAF': [[0,5,10,15,20,25],],
    'Engine Load': [[0,100,200,300,400,500],],
    'Consumption':[[0,4,8,12,16,20],],
    'Intake Temperature': [[0,10,20,30,40,50],]
    }


    $scope.selecteditemchanged = function()
    {
      var temp_obj = {};
      for(var i = 0; i<=5 ; i++)
      {
        temp_obj['y'] = piechartsdata[$scope.piechartselected][i];
        var content;
        if(i != 5)
        {
          content = rangeobjects[$scope.piechartselected][0][i] + "-" + rangeobjects[$scope.piechartselected][0][i+1]+" "+rangeobjects[$scope.piechartselected][1];
        }
        else
        {
          content = "> " + rangeobjects[$scope.piechartselected][0][i] + " " + rangeobjects[$scope.piechartselected][1];
        }
        temp_obj['key'] = content;
        $scope.data_pie[i] = temp_obj;
        temp_obj = {}
      }
    };
    //the initialy selected value of piechart params.
    var url = "https://envirocar.org/api/stable/users/";
    url = url + $rootScope.globals.currentUser.username + "/tracks/";
    $http.defaults.headers.common = {'X-User': $rootScope.globals.currentUser.username, 'X-Token': $rootScope.globals.currentUser.authdata};
    url = url + $stateParams.trackid;
        //var url = "https://envirocar.org/api/stable/tracks/57356a0ee4b09078f9629290";
    factorysingletrack.get(url).then(function(data){
          console.log(data.data);
          if(data.status > 300)
          {
            console.log(data.status)
            $scope.error = data.data;
            $state.go("dashboard.error",{path: data.data,status: data.status});
          }
          else
          {
            var dist = data.data.properties.length;
            var datafinal = [];
            var len_data = data.data.features.length;
            var phenoms = ["Speed","Calculated MAF","Engine Load","Consumption","Intake Temperature"];
            $scope.piechartoptions = phenoms;
            var colors = ["#ff9933", "#ffff00", "#00cc00", "#440044", "#ff3300"]
            for( var j= 0 ; j< phenoms.length; j++)
            {
              var dat=[];

              for(var i=0;i<len_data;i++)
              {
                if(i == 0)
                      rangeobjects[phenoms[j]][1] = data.data.features[i].properties.phenomenons[phenoms[j]].unit;
                  var date = new Date(data.data.features[i].properties.time);
                  var date_as_ms = date.getTime();
                  if(data.data.features[i].properties.phenomenons[phenoms[j]])
                  {
                      var speed = data.data.features[i].properties.phenomenons[phenoms[j]].value;
                     for(var k = 5; k>=0 ; k--)
                      {

                        if(speed >= rangeobjects[phenoms[j]][0][k])
                        {
                          console.log(rangeobjects[phenoms[j]][1]+"READABLE");
                          piechartsdata[phenoms[j]][k]++;
                          console.log(piechartsdata[phenoms[j]][k]+"value")
                          break;
                        }
                      }

                  }
                  else
                  {
                      var speed =0;
                  }
                  dat.push([date_as_ms,speed]);
                  var data_to_push = {"key": phenoms[j],"values":dat,"color": colors[j]};
              }
              if(phenoms[j] == "Speed")
              {
                var temp_obj = {};
                for(var i = 0; i<=5 ; i++)
                {
                  temp_obj['y'] = piechartsdata[$scope.piechartselected][i];
                  var content;
                  if(i != 5)
                  {
                    content = rangeobjects[$scope.piechartselected][0][i] + "-" + rangeobjects[$scope.piechartselected][0][i+1]+" "+rangeobjects[$scope.piechartselected][1];
                  }
                  else
                  {
                    content = "> " + rangeobjects[$scope.piechartselected][0][i] + " " + rangeobjects[$scope.piechartselected][1];
                  }
                  temp_obj['key'] = content;
                  $scope.data_pie[i] = temp_obj;
                  temp_obj = {}
                }
              }
              datafinal.push(data_to_push);
            }
            $scope.data = datafinal;
            for( var k = 0 ; k < len_data; k++)
            {
              console.log(len_data + "LENGTH OF DATA");
              if( k == 0)
                {

                  var m1 = {};
                  m1['lat'] = data.data.features[0].geometry.coordinates[1];
                  m1['lng'] = data.data.features[0].geometry.coordinates[0];
                  m1['focus'] = true;
                  m1['draggable'] = false;
                  m1['message'] = "Start Point!";
                  console.log(m1);
                  $scope.markers['m1'] = m1;
                  latinitial = data.data.features[0].geometry.coordinates[1];
                  longinitial = data.data.features[0].geometry.coordinates[0];
                  console.log(latinitial);
                  console.log(longinitial);
                }
                if(k>=1)
                {
                  var p='p';
                 var path_number = String(p + (k+1));
                 //console.log(path_number);
                 var pathobj = {}
                 pathobj['color'] = '#008000'
                 pathobj['weight'] = 8;
                 pathobj['latlngs'] = [{'lat':data.data.features[k-1].geometry.coordinates[1] , 'lng':data.data.features[k-1].geometry.coordinates[0]},
                  {'lat':data.data.features[k].geometry.coordinates[1] , 'lng':data.data.features[k].geometry.coordinates[0]}]
                  $scope.paths['p'+(k)] = pathobj;
                }
                if(k == (len_data-1))
                {
                  var m2 = {};
                  m2['lat'] = data.data.features[k].geometry.coordinates[1];
                  m2['lng'] = data.data.features[k].geometry.coordinates[0];
                  m2['focus'] = false;
                  m2['draggable'] = false;
                  m2['message'] = "End Point!";
                  $scope.markers['m2'] = m2;
                }
                //console.log(pathobj);
                //    var latlongobject = {'lat':data.data.features[k].geometry.coordinates[1] , 'lng':data.data.features[k].geometry.coordinates[0]}
                //  latlongarray.push(latlongobject);
                //console.log(latlongarray);
                //  console.log(latlongobject);

            }
          }
          console.log($scope.paths)

          $scope.center['lat'] = latinitial;
          $scope.center['lng'] = longinitial;
          console.log(dist);
          console.log(Math.round(80/Math.pow(dist,(2))));
          $scope.center['zoom'] = Math.round((20/Math.pow(dist,1.5))+9)
          console.log($scope.center['lat'] + " SEARCH HERE");
          //$scope.paths.p1.latlngs = latlongarray;
          //console.log($scope.paths.p1.latlngs);
          console.log(latinitial);
          console.log(longinitial);
     });
     console.log(latlongarray+"IS WHAT WE ARE LOOKING FOR");

}]);

angular.module('enviroCarApp')
.factory('factorysingletrack',function($http){
      var get = function(url)
      {
          return $http.get(url).then(function(data) {
          console.log(data)
          //console.log(data.features)
          return data;
        },
        function(err)
        {
          console.log(err.data);
          return err;
        })
      }

      return {get: get}
});
