'use strict';
/**
 * @ngdoc function
 * @name app.controller:chartController
 * @description
 * # ChartCtrl
 * chartController of the app
 */


angular.module('app')
  .constant('chart',{
    chart1type: 'pieChart',
    chart1height: 420,
    chart1duration: 300,
    chart1legend:
    {
      margin: {
          top: 5,
          right: 35,
          bottom: 5,
          left: 0
      }
    },

    chart2type: 'lineWithFocusChart',
    chart2height: 470,
    chart2margin: {
        top: 20,
        right: 50,
        bottom: 40,
        left: 125
    },
    chart2xlabel: 'Time',
    chart2ylabel: 'Values',

    piechartselected: 'Speed',
    piechartsdata: {
      'Speed': [0,0,0,0,0,0],
      'Calculated MAF': [0,0,0,0,0,0],
      'Engine Load': [0,0,0,0,0,0],
      'Consumption': [0,0,0,0,0,0],
      'Intake Temperature': [0,0,0,0,0,0]
    },
    rangeobjects: {
    'Speed': [[0,20,40,60,80,100],],
    'Calculated MAF': [[0,5,10,15,20,25],],
    'Engine Load': [[0,20,40,50,70,90],],
    'Consumption':[[0,4,8,12,16,20],],
    'Intake Temperature': [[0,10,20,30,40,50],]
    },
    numberofranges: 5,
    phenoms : ["Speed","Calculated MAF","Engine Load","Consumption","Intake Temperature"],
    urlusers: "https://envirocar.org/api/stable/users/",
    colors: ["#ff9933", "#ffff00", "#00cc00", "#440044", "#ff3300"],
    m1message: "Start Point",
    m2message: "End Point"
  })
angular.module('app')
  .controller('ChartController', ['$state','$scope','$http','$rootScope','$timeout','$stateParams','factorysingletrack','chart', function ($state, $scope,$http,$rootScope, $timeout,$stateParams,factorysingletrack,chart) {
    console.log("came to chart controller");
    $scope.options_pie = {
           chart: {
               type: chart.chart1type,
               height: chart.chart1height,
               x: function(d){return d.key;},
               y: function(d){return d.y;},
               showLabels: true,
               duration: chart.chart1duration,
               labelThreshold: 0.01,
               labelSunbeamLayout: true,
               legend: chart.chart1legend
           }
       };

       $scope.data_pie = [

       ];
    $scope.options = {
          chart: {
               type: chart.chart2type,
               height: chart.chart2height,
               margin : chart.chart2margin,
               x: function(d){return d[0];},
               y: function(d){return d[1];},
               xAxis: {
                  axisLabel: chart.chart2xlabel,
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
                 axisLabel: chart.chart2ylabel,
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
    };
    var latlongarray =[];
    var latinitial;
    var longinitial;
    angular.extend($scope, {
        center: {},
        paths: {},
        markers: {},
        controls: {
          custom: []
        }
      });

      var MyControl = L.control();
    MyControl.setPosition('bottomleft');
    MyControl.onAdd = function () {
      var div = L.DomUtil.create('div', 'phenomenons');
      div.innerHTML = "<select id =\"phenomselector\" ng-change=\"selecteditemchanged()\"><option>Speed</option><option>Calculated MAF</option><option>Engine Load</option><option>Consumption</option><option>Intake Temperature</option></select>"

      div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
      return div;
    }
    $scope.controls.custom.push(MyControl);
    //*****************************************************
    //*********VARIABLE REQUIRED FOR THE TABLE*************
    var Co2sum = 0;
    var fuelSum = 0;
    var distance = 0;
    var vehiclemodel;
    var vehicletype;
    var timeoftravel = 0;
    var units = {};
    var keys;
    var starttimeg;
    var endtimeg;
    //*****************************************************
    $scope.piechartselected = chart.piechartselected;
    var piechartsdata = chart.piechartsdata;
    var rangeobjects = chart.rangeobjects;
    $scope.selecteditemchanged = function()
    {
      var temp_obj = {};
      for(var i = 0; i<= chart.numberofranges ; i++)
      {
        temp_obj['y'] = piechartsdata[$scope.piechartselected][i];
        var content;
        if(i != chart.numberofranges )
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
    var url = chart.urlusers;
    url = url + $rootScope.globals.currentUser.username + "/tracks/";
    $http.defaults.headers.common = {'X-User': $rootScope.globals.currentUser.username, 'X-Token': $rootScope.globals.currentUser.authdata};
    url = url + $stateParams.trackid;
    factorysingletrack.get(url).then(function(data){
          if(data.status > 300)
          {
            console.log("came inside");
            $scope.error = data.data;
            $state.go("home.error",{path: data.data,status: data.status});
          }
          else
          {
            var dist = data.data.properties.length;
            var datafinal = [];
            var len_data = data.data.features.length;
            var phenoms = chart.phenoms;
            $scope.piechartoptions = phenoms;
            var colors = chart.colors;
            for( var j= 0 ; j< phenoms.length; j++)
            {
              if(j == 0)
              {
                keys=Object.keys(data.data.features[0].properties.phenomenons);
              }
              var dat=[];
              for(var i=0;i<len_data;i++)
              {

                var data_to_push;
                (function(iter){
                  if(j==0)
                  {
                    if(iter == 0)
                    {
                      var time1=data.data.features[0].properties.time;
                      var time2=data.data.features[len_data-1].properties.time;
                      var seconds_passed=new Date(time2).getTime() - new Date (time1).getTime();
                      //seconds is in milliseconds so convert to seconds
                      var seconds=seconds_passed/1000;
                      timeoftravel = seconds/60;
                      starttimeg = time1;
                      endtimeg = time2;
                    }
                    worker(iter,data.data);
                  }
                  if(iter == 0)
                      rangeobjects[phenoms[j]][1] = data.data.features[iter].properties.phenomenons[phenoms[j]].unit;
                  var date = new Date(data.data.features[iter].properties.time);
                  var date_as_ms = date.getTime();
                  if(data.data.features[iter].properties.phenomenons[phenoms[j]])
                  {
                      var speed = data.data.features[iter].properties.phenomenons[phenoms[j]].value;
                     for(var k = chart.numberofranges ; k >= 0 ; k--)
                      {

                        if(speed >= rangeobjects[phenoms[j]][0][k])
                        {
                          piechartsdata[phenoms[j]][k]++;
                          break;
                        }
                      }

                  }
                  else
                  {
                      var speed = 0;
                  }
                  dat.push([date_as_ms,speed]);
                  data_to_push = {"key": phenoms[j],"values":dat,"color": colors[j]};
                })(i);
              }
              if(phenoms[j] == chart.piechartselected)
              {
                var temp_obj = {};
                for(var i = 0; i<=chart.numberofranges  ; i++)
                {
                  temp_obj['y'] = piechartsdata[$scope.piechartselected][i];
                  var content;
                  if(i != chart.numberofranges )
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
              if( k == 0)
                {

                  var m1 = {};
                  m1['lat'] = data.data.features[0].geometry.coordinates[1];
                  m1['lng'] = data.data.features[0].geometry.coordinates[0];
                  m1['focus'] = true;
                  m1['draggable'] = false;
                  m1['message'] = chart.m1message;
                  $scope.markers['m1'] = m1;
                  latinitial = data.data.features[0].geometry.coordinates[1];
                  longinitial = data.data.features[0].geometry.coordinates[0];
                }
                if(k>=1)
                {
                  var p='p';
                  var path_number = String(p + (k+1));
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
                  m2['message'] = chart.m2message;
                  $scope.markers['m2'] = m2;
                }
            }
          }
          $scope.center['lat'] = latinitial;
          $scope.center['lng'] = longinitial;
          $scope.center['zoom'] = Math.round((20/Math.pow(dist,1.5))+9)

          function worker(i,data)
          {
            if(i<=(len_data-2))
            {
              function CO2Calc()
              {
                  var time1=data.features[i].properties.time;
                  var time2=data.features[i+1].properties.time;
                    //console.log(time2)
                  var seconds_passed=new Date(time2).getTime() - new Date (time1).getTime();
                  //seconds is in milliseconds so convert to seconds
                  var seconds=seconds_passed/1000;
                  //console.log(seconds)
                  if(seconds<=10)
                  {
                    var maf;
                    if(typeof data.features[i].properties.phenomenons["Calculated MAF"] != 'undefined')
                       maf=data.features[i].properties.phenomenons["Calculated MAF"].value;
                    else
                    {
                       console.log(data.features[i].properties);
                       console.log(i);
                       maf = data.features[i].properties.phenomenons["Calculated MAF"].value
                     }
                    var co2=(((maf / 14.7) / 730 )) * 2.35;
                    Co2sum = Co2sum + (seconds * co2);

                  }
              }
              CO2Calc();
              function ConsumptionCalc()
              {
                  var time1=data.features[i].properties.time;
                  var time2=data.features[i+1].properties.time;
                  var seconds_passed=new Date(time2).getTime() - new Date (time1).getTime();
                  //seconds is in milliseconds so convert to seconds
                  var seconds=seconds_passed/1000;
                  if(seconds<=10)
                  {
                      var maf;
                      if(typeof data.features[i].properties.phenomenons["Calculated MAF"] != 'undefined')
                        maf=data.features[i].properties.phenomenons["Calculated MAF"].value;
                      else
                        maf = data.features[i].properties.phenomenons["MAF"].value
                      var consumption = maf / 10731;
                      fuelSum += seconds * consumption;
                  }
              }
                ConsumptionCalc();
            }
            if(i == 0)
            {
              console.log(keys.length + "length of keys");
              for(var j=0;j<keys.length;j++)
              {
                units[keys[j]]=data.features[i].properties.phenomenons[keys[j]].unit;
              //  console.log(units[j]+"is the units")
              }
              distance = data.properties['length'];
              vehiclemodel = data.properties.sensor.properties.model;
              vehicletype = data.properties.sensor['type'];
              console.log(distance + " " + vehiclemodel + " " + vehicletype);
              console.log(units);
              return;
            }

          }
          console.log(Co2sum + " " + fuelSum)
          var fuelsplit = units['Consumption'].split("/");
          var co2split = units['CO2'].split("/");
          $scope.tracksummary = {
            distance: distance.toFixed(2),
            vehiclemodel: vehiclemodel,
            vehicletype: vehicletype,
            unitsspeed: units['Speed'],
            timeoftravel: timeoftravel.toFixed(2),
            unitsofdistance: "Km",
            unitsoftime: "Minutes",
            co2emission: Co2sum.toFixed(2),
            fuel: fuelSum.toFixed(2),
            unitsoffuel: fuelsplit[0],
            unitsofco2emission: co2split[0],
            co2emissionperhour: ((Co2sum*60)/timeoftravel).toFixed(2),
            fuelperhour: ((fuelSum*60)/timeoftravel).toFixed(2),
            starttime: starttimeg,
            endtime: endtimeg
          }
          console.log($scope.tracksummary)
     });
}]);

angular.module('app')
.factory('factorysingletrack',function($http){
  console.log("called so many times");
      var get = function(url)
      {
          return $http.get(url).then(function(data) {
          return data;
        },
        function(err)
        {
          return err;
        })
      }

      return {get: get}
});
