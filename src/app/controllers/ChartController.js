/* Chart controller
  The controller that handles all the components in the chart.html page.
*/

angular.module('app')
  .constant('chart', {
    chart1type: 'pieChart',
    chart1height: 400,
    chart1duration: 300,
    chart1legend: {
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
      'Speed': [0, 0, 0, 0, 0, 0],
      'Calculated MAF': [0, 0, 0, 0, 0, 0],
      'Engine Load': [0, 0, 0, 0, 0, 0],
      'Consumption': [0, 0, 0, 0, 0, 0],
      'Intake Temperature': [0, 0, 0, 0, 0, 0]
    },
    piechartsdatareplace: {
      'Speed': [0, 0, 0, 0, 0, 0],
      'MAF': [0, 0, 0, 0, 0, 0],
      'Engine Load': [0, 0, 0, 0, 0, 0],
      'Consumption': [0, 0, 0, 0, 0, 0],
      'Intake Temperature': [0, 0, 0, 0, 0, 0]
    },
    legendtable_all: {
      'Speed': ["0-20 Km/h", "20-40 Km/h", "40-60 Km/h", "60-80 Km/h",
        "80-100 Km/h", ">100 Km/h"
      ],
      'Calculated MAF': ["0-5 g/sec", "5-10 g/sec", "10-15 g/sec",
        "15-20 g/sec", "20-25 g/sec", ">25 g/sec"
      ],
      'Engine Load': ["0-20 %", "20-40 %", "40-60 %", "60-80 %", "80-100 %",
        ">100 %"
      ],
      'Consumption': ["0-4 l/h", "4-8 l/h", "8-12 l/h", "12-16 l/h",
        "16-20 l/h", ">20 l/h"
      ],
      'Intake Temperature': ["0-10 °C", "10-20 °C", "20-30 °C", "30-40 °C",
        "40-50 °C", "> 50 °C"
      ]
    },
    rangeobjects: {
      'Speed': [
        [0, 20, 40, 60, 80, 100],
      ],
      'Calculated MAF': [
        [0, 5, 10, 15, 20, 25],
      ],
      'Engine Load': [
        [0, 20, 40, 50, 70, 90],
      ],
      'Consumption': [
        [0, 4, 8, 12, 16, 20],
      ],
      'Intake Temperature': [
        [0, 10, 20, 30, 40, 50],
      ]
    },
    rangeobjectsreplace: {
      'Speed': [
        [0, 20, 40, 60, 80, 100],
      ],
      'MAF': [
        [0, 5, 10, 15, 20, 25],
      ],
      'Engine Load': [
        [0, 20, 40, 50, 70, 90],
      ],
      'Consumption': [
        [0, 4, 8, 12, 16, 20],
      ],
      'Intake Temperature': [
        [0, 10, 20, 30, 40, 50],
      ]
    },
    numberofranges: 5,
    phenoms: ["Speed", "Calculated MAF", "Engine Load", "Consumption",
      "Intake Temperature"
    ],
    phenomsreplace: ["Speed", "MAF", "Engine Load", "Consumption",
      "Intake Temperature"
    ],
    urlusers: "https://envirocar.org/api/stable/users/",
    urlbase: "https://envirocar.org/api/stable/tracks/",
    colors: ["#0065A0", "#ffbf00", "#00cc00", "#440044", "#ff3300"],
    m1message: "Start Point",
    m2message: "End Point",
    colorsl: ["#0099ff", "#ffff00", "#009900", "#ff9900", "#cc3300",
      "#4B0082"
    ],
    phenomenonleaflet: "Speed",
  })
angular.module('app')
  .controller('ChartController', ['$state', '$scope', '$http', '$rootScope',
    '$timeout', '$stateParams', 'factorysingletrack', 'chart', '$location',
    function($state, $scope, $http, $rootScope, $timeout, $stateParams,
      factorysingletrack, chart, $location) {

      $scope.loading = true;

      if (typeof $rootScope.globals.currentUser == "undefined") {
        $rootScope.url_redirect_on_login = $location.path();
        console.log("in if")
        $rootScope.showlogout = false;
      } else {
        console.log("in else");
        $rootScope.showlogout = true;
      }

      console.log("came to chart controller");
      $scope.options_pie = {
        chart: {
          type: chart.chart1type,
          height: chart.chart1height,
          x: function(d) {
            return d.key;
          },
          y: function(d) {
            return d.y;
          },
          showLabels: true,
          duration: chart.chart1duration,
          labelThreshold: 0.01,
          labelSunbeamLayout: true,
          legend: chart.chart1legend
        }
      };


      $scope.data_pie = [];
      $scope.options = {
        chart: {
          type: chart.chart2type,
          height: chart.chart2height,
          margin: chart.chart2margin,
          x: function(d) {
            return d[0];
          },
          y: function(d) {
            return d[1];
          },
          useInteractiveGuideline: true,
          interactive: true,
          tooltip: {
            contentGenerator: function(d) {
              var time = new Date(d.value);
              var html = "<h2>" + time.toLocaleString() + "</h2> <ul>";
              //var html = "<ul>";
              d.series.forEach(function(elem) {
                html += "<li><h3 style='color:" + elem.color + "'>" +
                  elem.key + "</h3> : <b>" + elem.value.toFixed(1) +
                  "</b></li>";
              })
              html += "</ul>"
              return html;
            }
          },
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
            tickFormat: function(d) {
              return d3.format(',.1f')(d);
            }
          },
          y2Axis: {
            tickFormat: function(d) {
              return d3.format(',.1f')(d);
            }
          },

        }
      };

      $scope.trackid;
      $scope.name;
      $scope.created;
      // the variables for the top bar.

      var latlongarray = [];
      var latinitial;
      var longinitial;
      angular.extend($scope, {
        center: {},
        paths: {},
        markers: {},
        controls: {
          custom: []
        },
        legend: {}

      });
      $scope.legend = {
        position: 'bottomleft',
        colors: chart.colorsl,
        labels: chart.legendtable_all['Speed']
      }
      $scope.legendtable = chart.legendtable_all['Speed'];
      /*
      var MyControl = L.control();
      MyControl.setPosition('bottomleft');
      MyControl.onAdd = function() {
          var div = L.DomUtil.create('div', 'phenomenons');
          div.innerHTML =
            "<div class=\"well\" id=\"legend\"  style=\"display:inline\">" +
            "<p> Legend </p >" +
            "<p id = \"legend-title\">Showing Speed</p><table><tbody>";

          for (var i = 0; i < 6; i++) {
            div.innerHTML += "<tr><td><p>" + chart.legendtable_all['Speed'][i] +
              "</p></td></tr>";
          }

          div.innerHTML += "</tbody></table></div>";
          div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent
            .stopPropagation;
          return div;
        }
        //$scope.controls.custom.push(MyControl);
        */
      //*****************************************************
      //*********VARIABLES REQUIRED FOR THE TABLE*************
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
      var len_data;
      var keys_second;
      //*****************************************************
      var colorsl = chart.colorsl;
      $scope.piechartselected = chart.piechartselected;
      $scope.phenomenonleaflet = chart.phenomenonleaflet;
      var piechartsdata = chart.piechartsdata;
      var rangeobjects = chart.rangeobjects;
      var data_global = {}
      $scope.changePhenomenon = function() {
        console.log("changed");
        console.log($scope.paths);
        optionchanger(data_global, $scope.phenomenonleaflet, 0);
        $scope.legendtable = [];
        $scope.legendtable = chart.legendtable_all[$scope.phenomenonleaflet];
        //  The section where the map has to be upated.
        console.log($scope.legend);
        $scope.legend.labels = chart.legendtable_all[$scope.phenomenonleaflet];
        console.log($scope.legend);
        $scope.legend = {};
        console.log($scope.legend);
        console.log("end of changePhenomenon");
        $scope.legend = {
          position: 'bottomleft',
          colors: chart.colorsl,
          labels: chart.legendtable_all[$scope.phenomenonleaflet]
        }
      }
      $scope.performancePeriod = 'week';
      $scope.selecteditemchanged = function() {
        console.log("fired");
        var temp_obj = {};
        for (var i = 0; i <= chart.numberofranges; i++) {
          temp_obj['y'] = piechartsdata[$scope.piechartselected][i];
          var content;
          if (i != chart.numberofranges) {
            content = rangeobjects[$scope.piechartselected][0][i] + "-" +
              rangeobjects[$scope.piechartselected][0][i + 1] + " " +
              rangeobjects[$scope.piechartselected][1];
          } else {
            content = "> " + rangeobjects[$scope.piechartselected][0][i] +
              " " + rangeobjects[$scope.piechartselected][1];
          }
          temp_obj['key'] = content;
          $scope.data_pie[i] = temp_obj;
          temp_obj = {}
        }
      };
      var url = chart.urlusers;
      if (typeof $rootScope.globals.currentUser == 'undefined') {
        console.log("came to if");
        url = chart.urlbase + $stateParams.trackid;
        $scope.trackid = $stateParams.trackid;
        console.log("here");

      } else {
        console.log("came to else")
        url = url + $rootScope.globals.currentUser.username + "/tracks/";
        $http.defaults.headers.common = {
          'X-User': $rootScope.globals.currentUser.username,
          'X-Token': $rootScope.globals.currentUser.authdata
        };
        url = url + $stateParams.trackid;
      }
      factorysingletrack.get(url).then(function(data) {
        if (data.status > 300) {
          console.log("getting a bad request")
          $scope.error = data.data;
          // In the event a wrong track ID is fed into the comments.
          $state.go("home.error", {
            path: data.data,
            status: data.status
          });
        } else {
          keys_second = Object.keys(data.data.features[0].properties.phenomenons);
          console.log(keys_second);
          var phenoms = chart.phenoms;
          var colors = chart.colors;

          // keys is a array.
          var keys_phenoms = Object.keys(rangeobjects);
          console.log(keys_phenoms);
          console.log(keys_second);
          if (keys_second.indexOf("MAF") >= 0) {
            // MAF is present!!
            rangeobjects = chart.rangeobjectsreplace;
            phenoms = chart.phenomsreplace;
            piechartsdata = chart.piechartsdatareplace

          }
          for (var i = 0; i < 5; i++) {
            if (keys_second.indexOf(keys_phenoms[i]) < 0) {
              //delete phenoms[keys_phenoms[i]];
              delete colors[keys_phenoms[i]];
              delete rangeobjects[keys_phenoms[i]];
              delete piechartsdata[keys_phenoms[i]];
              console.log("SHOUDL NOT HAVE COME HERE")
              console.log(keys_phenoms[i]);
              // it is not there

            }
          }
          phenoms = Object.keys(rangeobjects);
          console.log(phenoms);
          console.log(rangeobjects);
          console.log(colors);

          $scope.trackid = data.data.properties.id;
          $scope.name = data.data.properties.name;
          $scope.created = data.data.properties.created;
          console.log("coming here too but");
          console.log(data);
          data_global = data;
          var dist = data.data.properties.length;
          var datafinal = [];
          len_data = data.data.features.length;
          // need to handle this particular event before the phenoms gets the chart.phenoms and the corresponding color.phenoms.

          $scope.piechartoptions = phenoms;
          for (var j = 0; j < phenoms.length; j++) {
            if (j == 0) {
              keys = Object.keys(data.data.features[0].properties.phenomenons);
              if (keys.includes("Calculated MAF"))
                console.log("Swapped with replace");
              else {
                /*
                phenoms = chart.phenomsreplace;
                rangeobjects = {};
                rangeobjects = chart.rangeobjectsreplace;
                piechartsdata = {};
                piechartsdata = chart.piechartsdatareplace;
                console.log(phenoms);
                */
              }
            }
            var dat = [];
            for (var i = 0; i < len_data; i++) {
              var data_to_push;
              (function(iter) {
                if (j == 0) {
                  if (iter == 0) {
                    var time1 = data.data.features[0].properties.time;
                    var time2 = data.data.features[len_data - 1].properties
                      .time;
                    var seconds_passed = new Date(time2).getTime() -
                      new Date(time1).getTime();
                    var seconds = seconds_passed / 1000;
                    timeoftravel = seconds / 60;
                    starttimeg = time1;
                    endtimeg = time2;
                  }
                  worker(iter, data.data);
                }
                if (iter == 0) {
                  console.log(data.data.features[iter].properties.phenomenons);
                  console.log(phenoms[j])

                  rangeobjects[phenoms[j]][1] = data.data.features[
                      iter]
                    .properties.phenomenons[phenoms[j]].unit;
                }
                var date = new Date(data.data.features[iter].properties
                  .time);
                var date_as_ms = date.getTime();
                if (data.data.features[iter].properties.phenomenons[
                    phenoms[j]]) {
                  var speed = data.data.features[iter].properties.phenomenons[
                    phenoms[j]].value;
                  for (var k = chart.numberofranges; k >= 0; k--) {

                    if (speed >= rangeobjects[phenoms[j]][0][k]) {
                      console.log(phenoms[j]);
                      piechartsdata[phenoms[j]][k]++;
                      break;
                    }
                  }

                } else {
                  var speed = 0;
                }
                dat.push([date_as_ms, speed]);
                data_to_push = {
                  "key": phenoms[j],
                  "values": dat,
                  "color": colors[j]
                };
              })(i);
            }
            if (phenoms[j] == chart.piechartselected) {
              var temp_obj = {};
              for (var i = 0; i <= chart.numberofranges; i++) {
                temp_obj['y'] = piechartsdata[$scope.piechartselected][
                  i
                ];
                var content;
                if (i != chart.numberofranges) {
                  content = rangeobjects[$scope.piechartselected][0][i] +
                    "-" + rangeobjects[$scope.piechartselected][0][i +
                      1
                    ] +
                    " " + rangeobjects[$scope.piechartselected][1];
                } else {
                  content = "> " + rangeobjects[$scope.piechartselected]
                    [
                      0
                    ][i] + " " + rangeobjects[$scope.piechartselected][
                      1
                    ];
                }
                temp_obj['key'] = content;
                $scope.data_pie[i] = temp_obj;
                temp_obj = {}
              }
            }
            datafinal.push(data_to_push);
          }
          $scope.data = datafinal;
          optionchanger(data, 'Speed', 1);

        }
        $scope.center['lat'] = latinitial;
        $scope.center['lng'] = longinitial;
        $scope.center['zoom'] = Math.round((20 / Math.pow(dist, 1.5)) +
          9)

        function worker(i, data) {
          if (i <= (len_data - 2)) {
            function CO2Calc() {
              var time1 = data.features[i].properties.time;
              var time2 = data.features[i + 1].properties.time;
              var seconds_passed = new Date(time2).getTime() - new Date(
                time1).getTime();
              var seconds = seconds_passed / 1000;
              if (seconds <= 10) {
                var maf;
                if (data.features[i].properties.phenomenons[
                    "Calculated MAF"] != undefined) {
                  console.log(data.features[i].properties.phenomenons);
                  maf = data.features[i].properties.phenomenons[
                    "Calculated MAF"].value;
                  console.log(maf);
                } else {
                  console.log("how did it come here");
                  console.log(data.features[i].properties.phenomenons);
                  maf = data.features[i].properties.phenomenons["MAF"].value
                }
                var co2 = (((maf / 14.7) / 730)) * 2.35;
                Co2sum = Co2sum + (seconds * co2);
              }
            }
            CO2Calc();

            function ConsumptionCalc() {
              var time1 = data.features[i].properties.time;
              var time2 = data.features[i + 1].properties.time;
              var seconds_passed = new Date(time2).getTime() - new Date(
                time1).getTime();
              //seconds is in milliseconds so convert to seconds
              var seconds = seconds_passed / 1000;
              if (seconds <= 10) {
                var maf;
                if (data.features[i].properties.phenomenons[
                    "Calculated MAF"] != undefined)
                  maf = data.features[i].properties.phenomenons[
                    "Calculated MAF"].value;
                else
                  maf = data.features[i].properties.phenomenons["MAF"].value
                var consumption = maf / 10731;
                fuelSum += seconds * consumption;
              }
            }
            ConsumptionCalc();
          }
          if (i == 0) {
            console.log(keys.length + "length of keys");
            for (var j = 0; j < keys.length; j++) {
              units[keys[j]] = data.features[i].properties.phenomenons[
                keys[j]].unit;
            }
            distance = data.properties['length'];
            vehiclemodel = data.properties.sensor.properties.model;
            vehicletype = data.properties.sensor['type'];
            console.log(distance + " " + vehiclemodel + " " +
              vehicletype);
            console.log(units);
            return;
          }


        }
        console.log(Co2sum + " " + fuelSum)
        console.log(units)
        var fuelsplit;
        console.log(units['Consumption']);
        //  if(typeof units['Consumption'])
        if ((units['Consumption']) == undefined) {
          console.log("the consumption parameter is not available");
          fuelsplit = ["NA", ""];
        } else {
          fuelsplit = units['Consumption'].split("/");
        }
        var co2split;
        if (units['CO2'] == undefined) {
          co2split = ["NA", ""];
        } else {
          co2split = units['CO2'].split("/");
        }
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
          co2emissionperhour: ((Co2sum * 60) / timeoftravel).toFixed(
            2),
          fuelperhour: ((fuelSum * 60) / timeoftravel).toFixed(2),
          starttime: new Date(starttimeg).toLocaleString(),
          endtime: new Date(endtimeg).toLocaleString()
        }
        console.log($scope.tracksummary)
        $scope.loading = false
        console.log($scope.loading);
      });

      function optionchanger(data, phenomoption, flag) {
        for (var k = 0; k < len_data; k++) {
          if (k == 0 && flag == 1) {

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
          if (k >= 1) {
            var p = 'p';
            var path_number = String(p + (k + 1));
            var pathobj = {}
            if (data.data.features[k - 1].properties.phenomenons[
                phenomoption])
              for (var i = chart.numberofranges; i >= 0; i--) {

                if (data.data.features[k - 1].properties.phenomenons[
                    phenomoption].value >= rangeobjects[phenomoption][0][
                    i
                  ]) {
                  pathobj['color'] = colorsl[i];
                  break;
                }

              }
            pathobj['weight'] = 8;
            pathobj['latlngs'] = [{
              'lat': data.data.features[k - 1].geometry.coordinates[1],
              'lng': data.data.features[k - 1].geometry.coordinates[0]
            }, {
              'lat': data.data.features[k].geometry.coordinates[1],
              'lng': data.data.features[k].geometry.coordinates[0]
            }]
            $scope.paths['p' + (k)] = pathobj;
          }
          if (k == (len_data - 1) && flag == 1) {
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
    }
  ]);

angular.module('app')
  .factory('factorysingletrack', function($http) {
    console.log("called so many times");
    var get = function(url) {
      return $http.get(url).then(function(data) {
          return data;
        },
        function(err) {
          return err;
        })
    }

    return {
      get: get
    }
  });
