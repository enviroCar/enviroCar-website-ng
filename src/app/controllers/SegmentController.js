/* Chart controller
  The controller that handles all the components in the chart.html page.
*/


angular.module('app')
  .controller('SegmentController', ['$state', '$scope', '$http', '$rootScope',
    '$timeout', '$stateParams', 'factorysingletrack', 'chart', '$location',
    'requestgraphstats', 'leafletBoundsHelpers',
    'dashboard',
    function($state, $scope, $http, $rootScope, $timeout, $stateParams,
      factorysingletrack, chart, $location, requestgraphstats,
      leafletBoundsHelpers,
      dashboard) {
      var data_global = {}

      $scope.slider = {
        minValue: 0,
        options: {
          floor: 0,
          step: 1,
          noSwitching: true,
          draggableRange: true,
          id: 'slider-id',
          onStart: function(id) {
            console.log('on start ' + $scope.slider.maxValue); // logs 'on start slider-id'
          },
          onChange: function(id) {
            markerchange($scope.slider.minValue, $scope.slider.maxValue);
            console.log('on change ' + $scope.slider.maxValue); // logs 'on change slider-id'
            // fire events to change the corresponding marker from here.

          },
          onEnd: function(id) {
            console.log('on end ' + $scope.slider.maxValue);
            var data_global_temp = JSON.parse(JSON.stringify(data_global));

            //var data_global_temp = data_global;
            //  alert("should have fired once")
            var features = data_global_temp.data.features.slice($scope.slider
              .minValue,
              $scope.slider.maxValue);
            data_global_temp.data.features = features;
            console.log(data_global_temp);
            console.log(data_global);
            trackiterator(data_global, 1, $scope.slider
              .minValue, $scope.slider.maxValue);
            // NVD3 data has to be updated.
            // TrackSummary for this section has to be calculated.
            // Statistics of Pie Chart has to be recomputed.
            // Track Vs Public has to be recalculated on the client side.

          },
          translate: function(value, sliderId, label) {
            switch (label) {
              case 'model':
                return '<b>Start Point:</b>' + value;
              case 'high':
                return '<b>End Point:</b>' + value;
              default:
                return value
            }
          }

        }
      };
      $scope.widget = [{
        "id": "line",
        "title": "Line"
      }, {
        "id": "spline",
        "title": "Smooth line"
      }, {
        "id": "area",
        "title": "Area"
      }, {
        "id": "areaspline",
        "title": "Smooth area"
      }];

      //init
      $scope.widgetType1 = 'Speed';
      $scope.widgetType2 = 'Speed';
      $scope.widgetType3 = 'Speed';

      //individual loaders for elements
      $scope.onload_leaflet = false;
      $scope.onload_nvd3line = false;
      $scope.onload_nvd3pie = false;
      $scope.onload_nvd3_user_vs_public = false;
      $scope.onload_summary = false;

      $scope.loading = true;
      $scope.barchartoptions = ["Speed", "Consumption", "CO2"];

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


      $scope.optionsSpeed = {
        chart: {
          type: 'discreteBarChart',
          height: 260,
          margin: {
            top: 40,
            right: 0,
            bottom: 40,
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
            axisLabel: 'User vs Public '
          },
          yAxis: {
            axisLabel: 'Speed(Km/Hr)',
            axisLabelDistance: -20
          }
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
          showLegend: false,
          useInteractiveGuideline: false,
          interactive: true,
          tooltip: {
            contentGenerator: function(d) {
              //    console.log(d);
              var time = new Date(d.value);
              var html = "<h4>" + time.toLocaleString() + "</h4> <ul>";
              //var html = "<ul>";
              //  $scope.trailchange(d.pointIndex);
              //  console.log("came here")
              d.series.forEach(function(elem) {
                html += "<li><h3 style='color:" + elem.color + "'>" +
                  elem.key + ": <b>" + elem.value.toFixed(1) +
                  "</b></h3> </li>";
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

      var bounds = leafletBoundsHelpers.createBoundsFromArray([
        [51.508742458803326, -0.087890625],
        [51.508742458803326, -0.087890625]
      ]);


      angular.extend($scope, {
        center: {},
        bounds: bounds,
        paths: {},
        markers: {},
        controls: {
          custom: []
        },
        legend: {}

      });
      /*
      $scope.center = {};
      $scope.paths = {};
      $scope.markers ={};
      $scope.controls = {custom:[]};
      $scope.legend = {};
      */


      function markerchange(start, end) {
        console.log(start + "is start" + end + "is end")
        $scope.markers['m1'] = {};
        $scope.markers['m2'] = {};
        var m2 = {};
        m2['lat'] = data_global.data.features[start]['geometry'][
          'coordinates'
        ][1];
        m2['lng'] = data_global.data.features[start]['geometry'][
          'coordinates'
        ][0];
        m2['focus'] = start;
        m2['draggable'] = false;
        m2['message'] = "Start";
        $scope.markers['m1'] = m2;
        m2 = {};
        console.log(end);
        console.log(data_global.data);
        console.log(data_global.data.features[end]);
        m2['lat'] = data_global.data.features[end]['geometry']['coordinates']
          [1];
        m2['lng'] = data_global.data.features[end]['geometry']['coordinates']
          [0];
        m2['focus'] = false;
        m2['draggable'] = false;
        m2['message'] = "End";
        $scope.markers['m2'] = m2;
        //  console.log($scope.markers['start_moving']);
        //  console.log($scope.markers['end_moving']);

      }
      $scope.trailchange = function(index) {
        console.log(data_global);
        console.log($scope.paths);
        $scope.paths['nvd3pointer'] = {};
        $scope.paths['nvd3pointer'] = {
          type: "circleMarker",
          radius: 10,
          latlngs: ([data_global.data.features[index]['geometry'][
            'coordinates'
          ][1], data_global.data.features[index]['geometry'][
            'coordinates'
          ][0]])
        }
        console.log($scope.paths);
      }


      $scope.trackid;
      $scope.name;
      $scope.created;
      // the variables for the top bar.

      var latlongarray = [];
      var latinitial;
      var longinitial;
      $scope.tracksummary = {};
      $scope.tracksummary_c_e = {
        'fuelperhour': 0,
        'co2emission': 0
      }
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
      var vehiclemanufacturer;
      var timeoftravel = 0;
      var units = {};
      var keys;
      var starttimeg;
      var endtimeg;
      var len_data;
      var keys_second;
      var date_hh_mm_ss;
      var consumption_avg;
      var consumption100Km;
      var co2gKm;
      var co2_avg;
      var break_cons = true;
      //*****************************************************
      var colorsl = chart.colorsl;
      $scope.piechartselected = chart.piechartselected;
      $scope.phenomenonleaflet = chart.phenomenonleaflet;
      var piechartsdata = chart.piechartsdata;
      var rangeobjects = chart.rangeobjects;
      var date_for_seconds;

      $scope.changePhenomenon = function(phenomenon) {
        console.log(phenomenon);
        console.log("changed");
        console.log($scope.paths);
        optionchanger(data_global, phenomenon, 0);
        $scope.legendtable = [];
        $scope.legendtable = chart.legendtable_all[phenomenon];
        console.log($scope.legend);
        $scope.legend.labels = chart.legendtable_all[phenomenon];
        console.log($scope.legend);
        $scope.legend = {};
        console.log($scope.legend);
        console.log($scope.phenomenonleaflet);
        console.log("end of changePhenomenon");
        $scope.legend = {
          position: 'bottomleft',
          colors: chart.colorsl,
          labels: chart.legendtable_all[phenomenon]
        }
      }
      var datafinal = [];
      $scope.phenomenonnvd3 = "Speed";
      $scope.selected = ['Speed']
      $scope.exists = function(item, list) {
        return list.indexOf(item) > -1;
      };
      $scope.toggle = function(item, list) {
        console.log("came here");
        console.log($scope.selected)
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        } else {
          list.push(item);
        }
        console.log($scope.selected)
        $scope.data = [];
        var datanew = [];
        for (var i = 0; i < $scope.selected.length; i++) {
          for (var j = 0; j < datafinal.length; j++) {
            if (datafinal[j]['key'] == $scope.selected[i]) {
              datanew.push(datafinal[j]);
            }
          }
        }
        $scope.data = datanew;
        $scope.selected;
      };

      $scope.changePhenomenonnvd3 = function() {
        console.log($scope.phenomenonnvd3);
      }

      $scope.performancePeriod = 'week';
      $scope.selecteditemchanged = function(phenomenon) {
        console.log("fired");
        var temp_obj = {};
        for (var i = 0; i <= chart.numberofranges; i++) {
          temp_obj['y'] = piechartsdata[phenomenon][i];
          var content;
          if (i != chart.numberofranges) {
            content = rangeobjects[phenomenon][0][i] + "-" +
              rangeobjects[phenomenon][0][i + 1] + " " +
              rangeobjects[phenomenon][1];
          } else {
            content = "> " + rangeobjects[phenomenon][0][i] +
              " " + rangeobjects[phenomenon][1];
          }
          temp_obj['key'] = content;
          $scope.data_pie[i] = temp_obj;
          temp_obj = {}
        }
        console.log($scope.data_pie)

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

      var consumptiondefined;
      var co2defined;
      //From dashboard
      $scope.travel_distance;
      $scope.dataoverall;
      $scope.dataConsumption;
      $scope.dataCO2;
      $scope.dataSpeed;
      $scope.dataEngineload;
      $scope.consumption100Km;
      $scope.co2gKm;
      var datausers = [];
      var dataotherusers = [];
      var url_comparision = (dashboard.urltracks + $stateParams.trackid +
        dashboard.urlco2stats);
      var CO2_users;
      requestgraphstats.get(url_comparision).then(function(data) {
        console.log(data.data);
        CO2_users = data.data.avg;
        url_comparision = dashboard.urlcommonco2;
        console.log(url_comparision);
        requestgraphstats.get(url_comparision).then(function(data) {
          console.log(data.data);
          console.log("COME IN")
          $scope.dataCO2 = [{
            key: "Cumulative Return",
            values: [{
              "label": "User",
              "value": CO2_users
            }, {
              "label": "Public",
              "value": data.data.avg
            }]
          }]

        });
      });
      url_comparision = (dashboard.urltracks + $stateParams.trackid +
        dashboard.urlspeedstats);
      var speed_users;
      requestgraphstats.get(url_comparision).then(function(data) {
        console.log(data.data);
        var store = data.data;
        speed_users = store.avg;
        url_comparision = dashboard.urlcommonspeed;
        console.log(url_comparision);

        console.log("came here");
        requestgraphstats.get(url_comparision).then(function(data) {
          console.log(data.data);
          var store = data.data;
          speed_public = store.avg
          console.log("came here in 442");
          $scope.dataSpeed = [{
            key: "Cumulative Return",
            values: [{
              "label": "User",
              "value": speed_users
            }, {
              "label": "Public",
              "value": speed_public
            }]
          }]
          $scope.dataoverall = $scope.dataSpeed;

        });
      });

      url_comparision = (dashboard.urltracks + $stateParams.trackid +

        dashboard.urlconsstats);
      var consumption_users;
      requestgraphstats.get(url_comparision).then(function(data) {
        console.log(data.data);
        consumption_users = data.data.avg;
        url_comparision = dashboard.urlcommoncons;
        console.log(url_comparision);

        requestgraphstats.get(url_comparision).then(function(data) {
          console.log(data.data);
          $scope.loading = false;
          $scope.dataConsumption = [{
            key: "Cumulative Return",
            values: [{
              "label": "User",
              "value": consumption_users
            }, {
              "label": "Public",
              "value": data.data.avg
            }]
          }]
          $scope.onload_nvd3_user_vs_public = true;


        });
      });


      $scope.changePhenomenonbar = function(phenombar) {
          console.log("came here")
          $scope.dataoverall = [];
          if (phenombar == "Speed") {
            console.log($scope.optionsSpeed['chart']['yAxis']['axisLabel'])
            $scope.optionsSpeed['chart']['yAxis']['axisLabel'] =
              "Speed (Km/h)"
            $scope.dataoverall = $scope.dataSpeed;
          } else if (phenombar == "Consumption") {
            $scope.optionsSpeed['chart']['yAxis']['axisLabel'] =
              "Consumption (l/h)"
            $scope.dataoverall = $scope.dataConsumption;
          } else if (phenombar == "CO2") {
            $scope.optionsSpeed['chart']['yAxis']['axisLabel'] =
              "CO2 (Kg/h)"
            $scope.dataoverall = $scope.dataCO2;
          }

        }
        //end of code
      var run_once = 0;

      function trackiterator(data, override, index1, index2) {
        //resetting required values.
        piechartsdata = chart.piechartsdata;
        console.log("******************")
        console.log(piechartsdata);
        console.log(chart.piechartsdata);
        //else {
        //speed and consumption calculations.
        //when override = 1 then recalculation has to be done for the indexes.
        // when index2 - index1 == len_data then we can assume that the calculation is to be done for the entire track.

        $scope.piechartselected = $scope.widgetType2;

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

        len_data = data.data.features.length;
        // need to handle this particular event before the phenoms gets the chart.phenoms and the corresponding color.phenoms.

        $scope.piechartoptions = phenoms;
        datafinal = [];
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
          console.log(dat);
          if (run_once == 0) {
            $scope.slider['maxValue'] = len_data - 1;
            run_once++;
          }
          var startindex;
          var endindex;
          if (override == 0) {
            startindex = 0;
            endindex = len_data;
          } else {
            //  alert("came here");
            startindex = index1;
            endindex = index2 + 1;
          }
          var cons_override = 0;
          var co2_override = 0;
          var distance_override = 0;
          for (var i = 0; i < len_data; i++) {
            var data_to_push;
            (function(iter) {
              if (j == 0) {
                if (iter == 0) {
                  $scope.travel_distance = data.data.properties['length'].toFixed(
                    2);
                  var length = data.data.properties['length'];
                  var time1 = data.data.features[startindex].properties.time;
                  var time2 = data.data.features[endindex - 1].properties
                    .time;
                  $scope.tracksummary['starttime'] = new Date(time1).toLocaleString();
                  $scope.tracksummary['endtime'] = new Date(time2).toLocaleString();

                  var seconds_passed = new Date(time2).getTime() -
                    new Date(time1).getTime();
                  var seconds = seconds_passed / 1000;
                  timeoftravel = seconds / 60;
                  // time of travel is in minutes
                  // convert to the right format. of hh:mm:ss;
                  date_for_seconds = new Date(null);
                  date_for_seconds.setSeconds(seconds);
                  date_hh_mm_ss = date_for_seconds.toISOString().substr(
                    11, 8)
                  $scope.tracksummary['timeoftravel'] = date_hh_mm_ss;

                  starttimeg = time1;
                  endtimeg = time2;
                  if (override == 0 || (override == 1 && (startindex == 0 &&
                      endindex == len_data))) {
                    factorysingletrack.get(url +
                      "/statistics/Consumption").then(
                      function(data) {
                        console.log(data);
                        if (data.data.avg != undefined) {
                          console.log("came here to defined");
                          consumptiondefined = true;
                          var consumption_avg = (data.data.avg
                            .toFixed(
                              2));
                          var seconds_passed = new Date(endtimeg).getTime() -
                            new Date(
                              starttimeg).getTime();
                          console.log(seconds_passed);
                          var consumption100Km = ((100 *
                              consumption_avg * (seconds_passed /
                                (
                                  1000 *
                                  60 *
                                  60))) /
                            length).toFixed(2);
                          consumption100Km = consumption100Km.toString() +
                            " L/100 Km";
                          $scope.consumption100Km =
                            consumption100Km;

                          console.log($scope.tracksummary_c_e);
                        } else {
                          consumptiondefined = false;
                          $scope.consumption100Km = "NA";
                        }

                      })

                    factorysingletrack.get(url +
                      "/statistics/CO2").then(
                      function(data) {
                        console.log(data);
                        console.log(data.data.avg);
                        if (data.data.avg != undefined) {
                          co2defined = true;
                          var co2_avg = (data.data.avg
                            .toFixed(
                              2));
                          var seconds_passed = new Date(endtimeg).getTime() -
                            new Date(
                              starttimeg).getTime();
                          console.log(seconds_passed);
                          var co2gKm = ((1000 *
                              co2_avg * (seconds_passed / (
                                1000 *
                                60 *
                                60))) /
                            length).toFixed(2);
                          co2gKm = co2gKm.toString() +
                            " g/Km";
                          $scope.co2gKm = co2gKm;

                          console.log($scope.tracksummary_c_e);
                          console.log(co2gKm);
                        } else {
                          console.log("co2 not present")
                          co2defined = false;
                          $scope.co2gKm = "NA"
                        }
                      })
                  }



                }
                //  console.log(override + "override " + override + " " +
                //  startindex + " " +
                //  endindex + " " + iter)
                if (override == 1 && !(startindex == 0 && endindex ==
                    len_data) && (iter >= startindex && iter < endindex)) {
                  console.log(iter + 'is iter and' + endindex +
                      "is endindex")
                    //distance calculation.
                  if (iter < endindex - 1) {
                    distance_override += distancecalculator(data.data.features[
                        iter + 1]['geometry']['coordinates'][1], data.data
                      .features[
                        iter + 1]['geometry']['coordinates'][0], data.data
                      .features[
                        iter]['geometry']['coordinates'][1], data.data.features[
                        iter]['geometry']['coordinates'][0])
                  }

                  function distancecalculator(lat1, lon1, lat2, lon2) {
                    var p = 0.017453292519943295; // Math.PI / 180
                    var c = Math.cos;
                    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
                      c(lat1 * p) * c(lat2 * p) *
                      (1 - c((lon2 - lon1) * p)) / 2;

                    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
                  }
                  console.log("came in")
                  console.log(consumptiondefined);
                  console.log(co2defined);
                  //calculate the average statistics of consumption and co2 emission.
                  if (consumptiondefined) {
                    cons_override += data.data.features[iter]['properties']
                      ['phenomenons']['Consumption']['value'];
                    console.log(data.data.features[iter]['properties']
                      ['phenomenons']['Consumption']['value'])
                    console.log(cons_override);
                  }
                  if (co2defined) {
                    co2_override += data.data.features[iter]['properties'][
                      'phenomenons'
                    ]['CO2']['value'];
                  }
                  //  console.log(iter);
                  //  console.log(endindex - 1);
                  if (iter == (endindex - 1)) {
                    //  alert(distance_override);
                    $scope.travel_distance = distance_override.toFixed(2);
                    console.log("came here for last")
                      // calculate average now for consumption and co2.
                    if (consumptiondefined) {
                      var seconds_passed = new Date(endtimeg).getTime() -
                        new Date(
                          starttimeg).getTime();
                      //  console.log(seconds_passed);
                      //    console.log(cons_override);
                      var consumption100Km = ((100 *
                          (cons_override / (endindex - startindex +
                            1)) * (seconds_passed /
                            (
                              1000 *
                              60 *
                              60))) /
                        (distance_override)).toFixed(2);
                      console.log(distance_override + "the denom")
                      console.log(cons_override / (endindex - startindex +
                        1) + "the value");
                      //console.log(seconds_passed);
                      //  console.log(consumption100Km);
                      consumption100Km = consumption100Km.toString() +
                        " L/100 Km";
                      $scope.consumption100Km =
                        consumption100Km;
                      console.log($scope.consumption100Km);
                    }
                    if (co2defined) {
                      var seconds_passed = new Date(endtimeg).getTime() -
                        new Date(
                          starttimeg).getTime();
                      console.log(seconds_passed);

                      var co2gKm = ((1000 *
                          (co2_override / (endindex - startindex +
                            1)) * (seconds_passed / (
                            1000 *
                            60 *
                            60))) /
                        (distance_override)).toFixed(2);
                      $scope.co2gKm = co2gKm.toString() +
                        " g/Km";

                    }
                  }
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
              if (override == 0 || (override == 1 && ((iter >= startindex &&
                  iter <
                  endindex)))) {
                //console.log(iter + " iter " + endindex + "endindex")
                var date = new Date(data.data.features[iter].properties
                  .time);
                var date_as_ms = date.getTime();
                if (data.data.features[iter].properties.phenomenons[
                    phenoms[j]]) {
                  var speed = data.data.features[iter].properties.phenomenons[
                    phenoms[j]].value;
                  for (var k = chart.numberofranges; k >= 0; k--) {

                    if (speed >= rangeobjects[phenoms[j]][0][k]) {
                      //        console.log(phenoms[j]);
                      piechartsdata[phenoms[j]][k]++;
                      break;
                    }
                  }

                } else {
                  var speed = 0;
                }
              }
              if (iter >= startindex && iter < endindex) {
                dat.push([date_as_ms, speed]);
              }
              //  console.log("iter values")
              data_to_push = {
                "key": phenoms[j],
                "values": dat,
                "color": colors[j]
              };

            })(i);
          }
          //  console.log(piechartsdata);
          $scope.onload_summary = true;
          if (phenoms[j] == $scope.piechartselected) {
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
              //  console.log($scope.data_pie)
              temp_obj = {}
            }
          }
          //  console.log(data_to_push);
          datafinal.push(data_to_push);
        }
        $scope.onload_nvd3line = true;
        $scope.onload_nvd3pie = true;
        //$scope.data = datafinal;
        var data_temp = []
          //  console.log(datafinal);
        for (var iterator = 0; iterator < datafinal.length; iterator++) {

          //  console.log(iterator);
          //  console.log(datafinal);
          if ($scope.selected.indexOf(datafinal[iterator]['key']) > -1) {
            //  if (datafinal[iterator]['key'] == "Speed") {
            data_temp.push(datafinal[iterator]);
            $scope.data = data_temp;
            console.log("phenomset");
          }
        }
        console.log(datafinal);
        if (override != 1) {
          optionchanger(data, 'Speed', 1);
        }

        //}
        //  $scope.center['lat'] = latinitial;
        //  $scope.center['lng'] = longinitial;
        //  $scope.center = {};
        //  $scope.center['autoDiscover'] = true;
        // setting bounds on the map based on the points.
        // northeast and soutwest bounds are to be set.
        if ($scope.markers.m1.lng > $scope.markers.m2.lng) {
          $scope.bounds.northEast.lng = $scope.markers.m1.lng + 0.01;
          $scope.bounds.southWest.lng = $scope.markers.m2.lng - 0.01;
          if ($scope.markers.m1.lat > $scope.markers.m2.lat) {
            $scope.bounds.northEast.lat = $scope.markers.m1.lat + 0.01;
            $scope.bounds.southWest.lat = $scope.markers.m2.lat - 0.01;
          } else {
            $scope.bounds.northEast.lat = $scope.markers.m2.lat + 0.01;
            $scope.bounds.southWest.lat = $scope.markers.m1.lat - 0.01;

          }
        } else {
          $scope.bounds.northEast.lng = $scope.markers.m2.lng + 0.01;
          $scope.bounds.southWest.lng = $scope.markers.m1.lng - 0.01;
          if ($scope.markers.m1.lat > $scope.markers.m2.lat) {
            $scope.bounds.northEast.lat = $scope.markers.m1.lat + 0.01;
            $scope.bounds.southWest.lat = $scope.markers.m2.lat - 0.01;
          } else {
            $scope.bounds.northEast.lat = $scope.markers.m2.lat + 0.01;
            $scope.bounds.southWest.lat = $scope.markers.m1.lat - 0.01;

          }
        }
        console.log($scope.bounds);

        console.log($scope.markers);
        $scope.center['zoom'] = Math.round((20 / Math.pow(dist, 1.5)) +
          9)
        $scope.onload_leaflet = true;

        function worker(i, data) {

          if (i == 0) {
            console.log(keys.length + "length of keys");
            for (var j = 0; j < keys.length; j++) {
              units[keys[j]] = data.features[i].properties.phenomenons[
                keys[j]].unit;
            }
            distance = data.properties['length'];
            vehiclemodel = data.properties.sensor.properties.model;
            vehicletype = data.properties.sensor['type'];
            vehiclemanufacturer = data.properties.sensor.properties[
              'manufacturer'];

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
        if (consumption_avg == undefined) {
          consumption_avg = "NA";
        } else {
          consumption_avg = consumption_avg.toFixed(2);
        }
        if (co2_avg == undefined) {
          co2_avg = "NA";
        } else {
          co2_avg = co2_avg.toFixed(2);
        }
        $scope.tracksummary = {
          distance: distance.toFixed(2),
          vehiclemodel: vehiclemodel,
          vehicletype: vehicletype,
          vehiclemanufacturer: vehiclemanufacturer,
          unitsspeed: units['Speed'],
          timeoftravel: date_hh_mm_ss,
          unitsofdistance: "Km",
          unitsoftime: "Minutes",
          fuel: fuelSum.toFixed(2),
          unitsoffuel: fuelsplit[0],
          unitsofco2emission: co2split[0],
          co2emissionperhour: consumption_avg,
          starttime: new Date(starttimeg).toLocaleString(),
          endtime: new Date(endtimeg).toLocaleString()
        }
        console.log($scope.tracksummary)
        $scope.loading = false
        console.log($scope.loading);
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
          trackiterator(data, 0, 0, 0);
        }
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

            pathobj['message'] =
              (
                "<div style=\"color:#0065A0;width:120px\"><p style=\"font-size:10px;\"><b>Speed: </b>" +
                data.data.features[
                  k - 1].properties.phenomenons["Speed"].value.toFixed(2) +
                " " +
                data.data.features[
                  k - 1].properties.phenomenons["Speed"].unit +
                "</p><p style=\"font-size:10px;\"><b>Consumption: </b>" +
                (data.data.features[k - 1].properties.phenomenons[
                    "Consumption"] != undefined ?
                  data.data.features[
                    k - 1].properties.phenomenons["Consumption"].value.toFixed(
                    2) : "NA") +
                " " +
                (data.data.features[k - 1].properties.phenomenons[
                    "Consumption"] != undefined ?
                  data.data.features[
                    k - 1].properties.phenomenons["Consumption"].unit :
                  "NA") +
                "</p><p style=\"font-size:10px;\"><b>CO2: </b>" +
                (data.data.features[k - 1].properties.phenomenons["CO2"] !=
                  undefined ?
                  data.data.features[
                    k - 1].properties.phenomenons["CO2"].value.toFixed(
                    2) : "NA") +
                " " +
                (data.data.features[k - 1].properties.phenomenons["CO2"] !=
                  undefined ?
                  data.data.features[
                    k - 1].properties.phenomenons["CO2"].unit : "NA") +
                "</div>");

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
