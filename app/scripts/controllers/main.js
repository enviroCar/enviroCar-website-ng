'use strict';
/**
 * @ngdoc function
 * @name enviroCarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the enviroCarApp
 */
angular.module('enviroCarApp')
 .controller('MainCtrl',['$scope','$http','$rootScope','requesthomestats','requestgraphstats',function($scope,$http,$rootScope,requesthomestats,requestgraphstats)
  {
    $scope.trial = "hello"
    console.log("controller");
      //$scope.number = 17;
      $scope.type = 'user';
      $scope.comments = 'Number of Tracks';
      $scope.colour = "primary";
      var url1 = "https://envirocar.org/api/stable/users/";
      url1 = url1 + $rootScope.globals.currentUser.username + "/tracks";
      $http.defaults.headers.common = {'X-User': $rootScope.globals.currentUser.username, 'X-Token': $rootScope.globals.currentUser.authdata};
      console.log("url is"+url1 )
      var timeline = {};

      requesthomestats.get(url1).then(function(data){
        $scope.number = data.data.tracks.length;
        var limit=0;
        if($scope.number>=5)
          limit=5;
        else
          limit = $scope.number;
        for(var i=0; i<limit; i++)
        {
          (function(cntr){
                requesthomestats.get(url1+"/"+data.data.tracks[cntr].id).then(function(data2){
                  console.log(data2.data);
                  data2.data['url']="https://envirocar.org/api/stable/tracks/"+data2.data.properties.id+"/preview";
                  data2.data['urlredirect'] = "#/dashboard/chart/"+data2.data.properties.id;
                  //data2.data['urlredirect'] = "chart?trackid="+data2.data.properties.id;

                  timeline[data.data.tracks[cntr].id] = data2.data;
                //  console.log(timeline[data.data.tracks[cntr].id]);
                })
          })(i);
          //console.log(timeline);
        }
          //now to get the data required for the repeater
      });
      console.log(timeline);
      $scope.timelinevalues = timeline;
      //*******************************************************
      //*******************************************************
      //******************GRAPHS PART**************************
      $scope.options = {
              chart: {
                  type: 'multiBarHorizontalChart',
                  height: 450,
                  x: function(d){return d.label;},
                  y: function(d){return d.value;},
                  //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
                  showControls: false,
                  showValues: true,
                  duration: 500,
                  xAxis: {
                      showMaxMin: false
                  },
                  yAxis: {
                      axisLabel: 'Values',
                      tickFormat: function(d){
                          return d3.format(',.2f')(d);
                      }
                  }
              }
          };
          var datausers = [];
          var dataotherusers =[];
            var url = "https://envirocar.org/api/stable/users/"+$rootScope.globals.currentUser.username +"/statistics/CO2";
            requestgraphstats.get(url).then(function(data){
            console.log(data.data);
            var data = {
                  "label": "CO2("+data.data.phenomenon.unit+")",
                  "value": data.data.avg
               };
               datausers.push(data);
             });
            url = "https://envirocar.org/api/stable/users/"+$rootScope.globals.currentUser.username +"/statistics/Speed";
            requestgraphstats.get(url).then(function(data){
              console.log(data.data);
              var data = {
                "label": "Speed("+data.data.phenomenon.unit+")",
                "value": data.data.avg
              };
              datausers.push(data);
            });
            url = "https://envirocar.org/api/stable/users/"+$rootScope.globals.currentUser.username + "/statistics/Consumption";
            requestgraphstats.get(url).then(function(data){
              console.log(data.data);
              var data = {
                "label": "Consumption("+data.data.phenomenon.unit+")",
                "value": data.data.avg
              };
              datausers.push(data);
            });
            console.log(datausers);
            var datacumulusers = {
              "key": "User Statistics",
              "color": "#d62728",
              "values": datausers
            };
            url = "https://envirocar.org/api/stable/statistics/CO2";
            requestgraphstats.get(url).then(function(data){
              console.log(data.data);
              var data = {
                "label": "CO2("+data.data.phenomenon.unit+")",
                "value": data.data.avg
              };
              dataotherusers.push(data);
            });
            url = "https://envirocar.org/api/stable/statistics/Speed";
            requestgraphstats.get(url).then(function(data){
              console.log(data.data);
              var data = {
                "label": "Speed("+data.data.phenomenon.unit+")",
                "value": data.data.avg
              };
              dataotherusers.push(data);
            });
            url = "https://envirocar.org/api/stable/statistics/Consumption";
            requestgraphstats.get(url).then(function(data){
              console.log(data.data);
              var data = {
                "label": "Consumption("+data.data.phenomenon.unit+")",
                "value": data.data.avg
              };
              dataotherusers.push(data);
            });
            var datacumulotherusers = {
                "key": "Other User's Statistics",
                "color": "#1f77b4",
                "values": dataotherusers
              };
            $scope.data = [datacumulotherusers,datacumulusers];

  //**********************************************************
  //***********************END OF GRAPHS**********************

  //********************* START OF INSIGHTS*******************
  //**********************************************************
  /*
  var ratingco2;
  if(datausers[0].value<(dataotherusers[0].value*0.60))
  {
    ratingco2 = "+4";
  }
  else if(datausers[0].value<(dataotherusers[0].value*0.70))
  {
    ratingco2 = "+3";
  }
  else if(datausers[0].value<(dataotherusers[0].value*0.80))
  {
    ratingco2 = "+2";
  }
  else if(datausers[0].value<(dataotherusers[0].value*0.90))
  {
    ratingco2 = "+1";
  }
  else if(datausers[0].value>(dataotherusers[0].value))
  {
    ratingco2 = "-1";
  }
  else if(datausers[0].value>(dataotherusers[0].value*1.1))
  {
    ratingco2 = "-2";
  }
  else if(datausers[0].value>(dataotherusers[0].value*1.2))
  {
    ratingco2 = "-3";
  }
  else if(datausers[0].value>(dataotherusers[0].value*1.30))
  {
    ratingco2 = "-4";
  }
  var ratiospeed = datausers[2].value/dataotherusers[2].value;
  var ratioco2 = datausers[0].value/dataotherusers[0].value;
  var ratioconsumption = datausers[1].value/dataotherusers[1].value;
  var co2comments;
  var consumptionscomments;
if(ratioco2 < ratiospeed)
{
  co2comments = "Your CO2 consumption is optimal in comparision to your average speed";
}
*/
  }]);

  angular.module('enviroCarApp')
  .factory('requesthomestats',function($http){
    var get = function(url)
    {
      return $http.get(url).success(function(data){
        return data;
      })
    }
    return {
      get: get
    }
  });

  angular.module('enviroCarApp')
  .factory('requestgraphstats',function($http){
      var get = function(url) {
          return $http.get(url).success(function(data) {
          console.log(data)
          return data;
        });
      }

      return {
        get: get
      }
    });
