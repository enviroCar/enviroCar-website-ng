/* Chart controller
  The controller that handles all the components in the chart.html page.
*/


angular.module('app')
  .controller('SegmentController', ['$state', '$scope', '$http', '$rootScope',
    '$timeout', '$stateParams', 'factorysingletrack', 'chart', '$location',
    'requestgraphstats', 'leafletBoundsHelpers',
    'dashboard', 'leafletMarkerEvents',
    function($state, $scope, $http, $rootScope, $timeout, $stateParams,
      factorysingletrack, chart, $location, requestgraphstats,
      leafletBoundsHelpers,
      dashboard, leafletMarkerEvents) {
      var data_global = {}
      var latlongarray = [];
      $scope.SegmentAPI = true;
      $scope.slider = {
        minValue: 0,
        options: {
          floor: 0,
          step: 1,
          noSwitching: true,
          draggableRange: true,
          id: 'slider-id',
          onStart: function(id) {
          },
          onChange: function(id) {
            // Function to redraw the start and end markers when sliders are modified.
            markerchange($scope.slider.minValue, $scope.slider.maxValue);
          },
          onEnd: function(id) {
            var data_global_temp = JSON.parse(JSON.stringify(data_global));
            var features = data_global_temp.data.features.slice($scope.slider.minValue,$scope.slider.maxValue);
            data_global_temp.data.features = features;
            trackiterator(data_global, 1, $scope.slider.minValue, $scope.slider.maxValue);
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

      /*
        $scope.widgetType1 = dropdwon select in leaflet
        $scope.widgetType2 = dropdwon select in pie chart
        $scope.widgetType3 = dropdwon select in track vs public bar chart
      */
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

      //The array for dropdown options in bar chart
      $scope.barchartoptions = ["Speed", "Consumption", "CO2"];


      if (typeof $rootScope.globals.currentUser == "undefined") {
        // If user is logged out(the user is undefined) then show the login button
        $rootScope.url_redirect_on_login = $location.path();
        $rootScope.showlogout = false;
      } else {
        // If the user is logged in then show the logout button
        $rootScope.showlogout = true;
      }

       // Config for pie chart.
       $scope.options_pie = {
        chart: {
          type: chart.chart1type,
          height: chart.chart1height + 50,
          x: function(d) {
            return d.key;
          },
          y: function(d) {
            return (d.y);
          },
          showLabels: true,
          duration: chart.chart1duration,
          labelThreshold: 0,
          donut: true,
          donutLabelsOutside: true,
          cornerRadius: 0,
          donutRatio: 0.45,
          legend: chart.chart1legend,
          tooltip: {
            contentGenerator: function(d){
              var html = '<h3><b>' + d.data.key + '</b> - ' + d.data.y.toFixed(2) + '%</h3>';
              console.log(d);
              return(html);
            }
          }
        }
      };

      // Config for the Track vs public bar chart
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
      $scope.data_pie = [];

      // Config for the Time Series chart
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
              // Creates a custom tooltip with the time and the series value
              var time = new Date(d.value);
              var html = "<h4>" + time.toLocaleString() + "</h4> <ul>";
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

      // Utility function when marker is changed.
      function markerchange(start, end) {
        $scope.markers = {};
        var m2 = {};
        m2['lat'] = data_global.data.features[start]['geometry']['coordinates'][1];
        m2['lng'] = data_global.data.features[start]['geometry']['coordinates'][0];
        m2['focus'] = false;
        m2['draggable'] = true;
        m2['message'] = "Start";
        $scope.markers['m1'] = m2;
        var m3 = {};
        m3['lat'] = data_global.data.features[end]['geometry']['coordinates'][1];
        m3['lng'] = data_global.data.features[end]['geometry']['coordinates'][0];
        m3['focus'] = false;
        m3['draggable'] = true;
        m3['message'] = "End";
        $scope.markers['m2'] = m3;
      }

      $scope.events = {
        markers: {
          enable: leafletMarkerEvents.getAvailableEvents(),
        }
      };

      var markerEvents = leafletMarkerEvents.getAvailableEvents();
      for (var k in markerEvents) {
        var eventName = 'leafletDirectiveMarker.' + markerEvents[k];
        $scope.$on(eventName, function(event, args) {
          $scope.eventDetected = event.name;
          if (event.name == "leafletDirectiveMarker.dragend") {
            // Minimum value for distance.
            var min_Distance = shortestdistancecalculator(args.model.lat,args.model.lng, global_lat_lngs[0][0], global_lat_lngs[0][1]);
            var min_Index = 0;
            for (var i = 0; i < global_lat_lngs.length; i++) {
              // Iterate through all points and find theshortest distance for each of them
              var current_distance = shortestdistancecalculator(args.model.lat, args.model.lng, global_lat_lngs[i][0],global_lat_lngs[i][1]);
              if (current_distance < min_Distance) {
                // Update distance and index value.
                min_Distance = current_distance;
                min_Index = i;
              }
            }

            // Validations added to avoid markers from going overboard on either side for the markers.
            if (args.modelName == 'm1') {
              // marker start should not go beyond maxValue of the slider.
              if (min_Index > $scope.slider.maxValue) {
                min_Index = $scope.slider.maxValue;
              }
            } else if (args.modelName == 'm2') {
              // marker end should not go beyounf minValue of the slider.
              if (min_Index < $scope.slider.minValue) {
                min_Index = $scope.slider.minValue;
              }
            }

            // args.modelName either holds m1 or m2 depending on which marker was moved.
            // Reassign the location for args.modelName with the min_index values
            $scope.markers[args.modelName] = {
              'lat': global_lat_lngs[min_Index][0],
              'lng': global_lat_lngs[min_Index][1],
              'draggable': true,
              'message': args.modelName == "m1" ? 'Start' : 'End'
            }

            // Update the slider value after updating the corresponding marker.
            if (args.modelName == "m1") {
              $scope.slider.minValue = min_Index;
            } else if (args.modelName == "m2") {
              $scope.slider.maxValue = min_Index;
            }

            // Recalulcate all statistics on the page, for the range of track points starting from minValue till maxValue.
            trackiterator(data_global, 1, $scope.slider.minValue, $scope.slider.maxValue);
          }
        });
      }

      // calculates distance between coordinates [lat1, lon1] and [lat2, lon2]
      function shortestdistancecalculator(lat1, lon1, lat2, lon2) {
        return (Math.abs((lat1 - lat2) * (lat1 - lat2)) + Math.abs((lon1 -lon2) * (lon1 - lon2)));
      }

      // Calculates the distance between 2 points considering the curvature of the earth
      function distancecalculator(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295; // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
      }

      // the variables for the top bar information about the single track being explored
      $scope.trackid;
      $scope.name;
      $scope.created;

      var latinitial;
      var longinitial;

      $scope.tracksummary = {};

      $scope.legend = {
        position: 'bottomleft',
        colors: chart.colorsl,
        labels: chart.legendtable_all['Speed']
      }

      $scope.legendtable = chart.legendtable_all['Speed'];
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
      var speedDataCalculated;
      var consumptionDataCalculated;
      var co2DataCalculated;
      //*****************************************************
      var colorsl = chart.colorsl;
      $scope.piechartselected = chart.piechartselected;
      $scope.phenomenonleaflet = chart.phenomenonleaflet;
      var piechartsdata = JSON.parse(JSON.stringify(chart.piechartsdata));
      var rangeobjects = chart.rangeobjects;
      var date_for_seconds;

      // Change in selected phenomenon for pie chart.
      $scope.changePhenomenon = function(phenomenon) {
        optionchanger(data_global, phenomenon, 0);
        $scope.legendtable = [];
        $scope.legendtable = chart.legendtable_all[phenomenon];
        $scope.legend.labels = chart.legendtable_all[phenomenon];
        $scope.legend = {};
        $scope.legend = {
          position: 'bottomleft',
          colors: chart.colorsl,
          labels: chart.legendtable_all[phenomenon]
        }
      }

      var datafinal = [];
      $scope.phenomenonnvd3 = "Speed";
      $scope.selected = ['Speed']

      // Utility function to find if a item is present in a list
      $scope.exists = function(item, list) {
        return list.indexOf(item) > -1;
      };

      // Used by the Time Series graph to add multiple checked items in the nvd3 graph
      $scope.toggle = function(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        } else {
          list.push(item);
        }
        $scope.data = [];
        var datanew = [];
        for (var i = 0; i < $scope.selected.length; i++) {
          for (var j = 0; j < datafinal.length; j++) {
            if (datafinal[j]['key'] == $scope.selected[i]) {
              datanew.push(datafinal[j]);
            }
          }
        }
        // Update the $scope.data with the new phenomenon that was added or removed from the multiSelect list
        $scope.data = datanew;
        $scope.selected;
      };

      // Called by the pie graph to update $scope.data_pie when the phenomenon associated with it is changed.
      $scope.selecteditemchanged = function(phenomenon) {
        var temp_obj = {};
        for (var i = 0; i <= chart.numberofranges; i++) {
          // To calculate the % of points falling in that chart range.
          temp_obj['y'] = (piechartsdata[phenomenon][i] / ($scope.slider.maxValue - $scope.slider.minValue + 1)) * 100;

          var content;
          if (i != chart.numberofranges) {
            // For ranges that are bound on both sides.
            content = rangeobjects[phenomenon][0][i] + "-" + rangeobjects[phenomenon][0][i + 1] + " " + rangeobjects[phenomenon][1];
          } else {
            // For the last unbound range.
            content = "> " + rangeobjects[phenomenon][0][i] + " " + rangeobjects[phenomenon][1];
          }
          temp_obj['key'] = content;
          $scope.data_pie[i] = temp_obj;
          temp_obj = {}
        }
      };

      var url = chart.urlusers;

      if (typeof $rootScope.globals.currentUser == 'undefined') {
        url = chart.urlbase + $stateParams.trackid;
        $scope.trackid = $stateParams.trackid;
      } else {
        console.log("came to else")
        url = url + $rootScope.globals.currentUser.username + "/tracks/";
        $http.defaults.headers.common = {
          'X-User': $rootScope.globals.currentUser.username,
          'X-Token': $rootScope.globals.currentUser.authdata
        };
        url = url + $stateParams.trackid;
      }

      // Variables to keep track as to whether consumption and co2 are 2 parameters that are returned for the vehicle. If they are not defined, we assign NA.
      var consumptiondefined;
      var co2defined;

      //From dashboard
      var global_lat_lngs = [];
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

      var url_comparision = (dashboard.urltracks + $stateParams.trackid + dashboard.urlco2stats);
      var CO2_users;

      requestgraphstats.get(url_comparision).then(function(data) {
        // data.data.avg holds the data of CO2 avg consumption of user
        CO2_users = data.data.avg;
        url_comparision = dashboard.urlcommonco2;

        requestgraphstats.get(url_comparision).then(function(data) {
          // data.data.avg holds the data of CO2 avg consumption of all users.
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

      url_comparision = (dashboard.urltracks + $stateParams.trackid + dashboard.urlspeedstats);
      var speed_users;

      requestgraphstats.get(url_comparision).then(function(data) {
        // data.data.avg holds the data of avg Speed of user
        var store = data.data;
        speed_users = store.avg;
        url_comparision = dashboard.urlcommonspeed;

        requestgraphstats.get(url_comparision).then(function(data) {
          // data.data.avg holds the data of avg Speed of all users.
          var store = data.data;
          speed_public = store.avg
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
          // initially by default the overall data is that of speed.
          $scope.dataoverall = $scope.dataSpeed;
        });
      });

      url_comparision = (dashboard.urltracks + $stateParams.trackid + dashboard.urlconsstats);
      var consumption_users;

      requestgraphstats.get(url_comparision).then(function(data) {
        // data.data.avg holds the data of avg consumption of user
        consumption_users = data.data.avg;
        url_comparision = dashboard.urlcommoncons;

        requestgraphstats.get(url_comparision).then(function(data) {
          // data.data.avg holds the data of avg consumption of all users.
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

      // Function that is called when the phenomenon is changed in the track vs public bar chart
      $scope.changePhenomenonbar = function(phenombar, flag) {
          if (flag == 2 || $scope.slider.minValue == 0 && $scope.slider.maxValue == (len_data - 1)) {
            // if the entire track is requested for, then use the data tht is returned from the server.
            $scope.widgetType3 = phenombar;
            $scope.dataoverall = [];
            if (phenombar == "Speed") {
              $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "Speed (Km/h)"
              $scope.dataoverall = $scope.dataSpeed;
            } else if (phenombar == "Consumption") {
              $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "Consumption (l/h)"
              $scope.dataoverall = $scope.dataConsumption;
            } else if (phenombar == "CO2") {
              $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "CO2 (Kg/h)"
              $scope.dataoverall = $scope.dataCO2;
            }

          } else {
            // If only part of the track is requested for, then use the data that is returned from the client side calculation of each of these parameters
            $scope.widgetType3 = phenombar;
            $scope.dataoverall = [];
            if (phenombar == "Speed") {
              $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "Speed (Km/h)"
              $scope.dataoverall = speedDataCalculated;
            } else if (phenombar == "Consumption") {
              $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "Consumption (l/h)"
              $scope.dataoverall = consumptionDataCalculated;
            } else if (phenombar == "CO2") {
              $scope.optionsSpeed['chart']['yAxis']['axisLabel'] = "CO2 (Kg/h)"
              $scope.dataoverall = co2DataCalculated;
            }
          }
        }
        //end of code
      var run_once = 0;

      function trackiterator(data, override, index1, index2) {
        //resetting required values.
        piechartsdata = JSON.parse(JSON.stringify(chart.piechartsdata));
        $scope.piechartselected = $scope.widgetType2;

        keys_second = Object.keys(data.data.features[0].properties.phenomenons);
        var phenoms = chart.phenoms;
        var colors = chart.colors;

        // keys is a array.
        var keys_phenoms = Object.keys(rangeobjects);

        if (keys_second.indexOf("MAF") >= 0) {
          // If MAF Is present then we replace it with Calculated MAF among the few selected phenomenon.
          // MAF is present!! One of either MAF or Calculated MAF will definitely be present.
          rangeobjects = chart.rangeobjectsreplace;
          phenoms = chart.phenomsreplace;
          piechartsdata = JSON.parse(JSON.stringify(chart.piechartsdatareplace));
        }

        for (var i = 0; i < 5; i++) {
          // if a particular phenomenon is not returned by the server then remove it from the objects that we use as template base for filling up base values
          if (keys_second.indexOf(keys_phenoms[i]) < 0) {
            delete colors[keys_phenoms[i]];
            delete rangeobjects[keys_phenoms[i]];
            delete piechartsdata[keys_phenoms[i]];
          }
        }
        // Array of the phenomenons that are available for this track from an interesection of the important phenomenon and all returned for this track
        phenoms = Object.keys(rangeobjects);

        $scope.trackid = data.data.properties.id;
        $scope.name = data.data.properties.name;
        $scope.created = data.data.properties.created;

        data_global = data;

        var dist = data.data.properties.length;
        len_data = data.data.features.length;
        // need to handle this particular event before the phenoms gets the chart.phenoms and the corresponding color.phenoms.

        $scope.piechartoptions = phenoms;
        datafinal = [];

        // Iterate over all phenomenon
        for (var j = 0; j < phenoms.length; j++) {
          if (j == 0) {
            keys = Object.keys(data.data.features[0].properties.phenomenons);
          }

          var dat = [];
          if (run_once == 0) {
            // Sets the maximum value of the slider. len_data is a count of the number of points recorded in the track.
            $scope.slider['maxValue'] = len_data - 1;
            // Calculated once.
            run_once++;
          }

          var startindex;
          var endindex;
          if (override == 0) {
            // If calculation is being done for the entire points.
            startindex = 0;
            endindex = len_data;
          } else {
            // If calculation is being done for a segment of the track points
            startindex = index1;
            endindex = index2 + 1;
            if (startindex == 0 && endindex == (len_data)) {
              // If the slider is set with an override but the segment == original track(then use the precomputed values for the entire track - Do not recalculate)
              $scope.changePhenomenonbar($scope.widgetType3, 2);
            }
          }

          var cons_override = 0;
          var co2_override = 0;
          var distance_override = 0;

          // Iterate through each recorded point in the track to calculate avergae statistics and other items.
          for (var i = 0; i < len_data; i++) {
            var data_to_push;
            (function(iter) {
              if (j == 0) {
                if (iter == 0) {
                  // Some general information of the car that can be extracted in just one of the iterations.
                  // Distance of the track rounded to 2 decimal points
                  $scope.travel_distance = data.data.properties['length'].toFixed(2);

                  // Distance of the track without any rounding off
                  var length = data.data.properties['length'];

                  // Time of the first recorded instance - Start time
                  var time1 = data.data.features[startindex].properties.time;
                  // Time of the last recorded instance - End time
                  var time2 = data.data.features[endindex - 1].properties.time;

                  $scope.tracksummary['starttime'] = new Date(time1).toLocaleString();
                  $scope.tracksummary['endtime'] = new Date(time2).toLocaleString();

                  var seconds_passed = new Date(time2).getTime() - new Date(time1).getTime();
                  var seconds = seconds_passed / 1000;
                  timeoftravel = seconds / 60;
                  // time of travel is in minutes
                  // convert to the right format. of hh:mm:ss;
                  date_for_seconds = new Date(null);
                  date_for_seconds.setSeconds(seconds);
                  date_hh_mm_ss = date_for_seconds.toISOString().substr(11, 8)

                  $scope.tracksummary['timeoftravel'] = date_hh_mm_ss;

                  starttimeg = time1;
                  endtimeg = time2;

                  if (override == 0 || (override == 1 && (startindex == 0 && endindex == len_data))) {
                    // If the data being requested for is of the entire track, we use the data returned by the server.
                    factorysingletrack.get(url + "/statistics/Consumption").then(function(data) {

                        if (data.data.avg != undefined) {
                          // If consumption is defined, we read its value.
                          consumptiondefined = true;
                          var consumption_avg = (data.data.avg.toFixed(2));
                          var seconds_passed = new Date(endtimeg).getTime() - new Date(starttimeg).getTime();

                          // Formula to calculate Consumption/100 Km
                          var consumption100Km = ((100 * consumption_avg * (seconds_passed /(1000 *60 * 60))) / length).toFixed(2);
                          consumption100Km = consumption100Km.toString() +" L/100 Km";
                          $scope.consumption100Km = consumption100Km;
                        } else {
                          // Consumption is undefined so assign it is NA.
                          consumptiondefined = false;
                          $scope.consumption100Km = "NA";
                        }

                      })

                    factorysingletrack.get(url + "/statistics/CO2").then(function(data) {

                        if (data.data.avg != undefined) {
                          // If CO2 is defined, we read its value.
                          co2defined = true;
                          var co2_avg = (data.data.avg.toFixed(2));
                          var seconds_passed = new Date(endtimeg).getTime() - new Date(starttimeg).getTime();

                          // Formula to calculate CO2 g/Km
                          var co2gKm = ((1000 * co2_avg * (seconds_passed / (1000 * 60 * 60))) / length).toFixed(2);
                          co2gKm = co2gKm.toString() + " g/Km";
                          $scope.co2gKm = co2gKm;
                        } else {
                          // CO2 is undefined so assign it is NA.
                          co2defined = false;
                          $scope.co2gKm = "NA"
                        }
                      })
                  }
                }

                if (override == 1 && !(startindex == 0 && endindex == len_data) && (iter >= startindex && iter < endindex)) {
                  // If segment of the graph is being requested for
                  if (iter < endindex - 1) {
                    // Calculate distance between this point and the next point
                    distance_override += distancecalculator(data.data.features[iter + 1]['geometry']['coordinates'][1], data.data.features[iter + 1]['geometry']['coordinates'][0], data.data.features[iter]['geometry']['coordinates'][1], data.data.features[iter]['geometry']['coordinates'][0])
                  }

                  if (consumptiondefined) {
                    cons_override += data.data.features[iter]['properties']['phenomenons']['Consumption']['value'];
                  }

                  if (co2defined) {
                    co2_override += data.data.features[iter]['properties']['phenomenons']['CO2']['value'];
                  }

                  // The last segment in the track for which the distance_override, co2_override, cons_override are being calculated
                  if (iter == (endindex - 1)) {
                    $scope.travel_distance = distance_override.toFixed(2);
                    $scope.avgspeed = $scope.travel_distance / ((new Date(endtimeg).getTime() -new Date(starttimeg).getTime()) / (1000 * 60 * 60));
                    var temporaryspeed = JSON.parse(JSON.stringify($scope.dataSpeed))
                    temporaryspeed[0]['values'][0]['value'] = $scope.avgspeed;

                    if ($scope.widgetType3 == "Speed") {
                      $scope.dataoverall = temporaryspeed;
                    }

                    speedDataCalculated = temporaryspeed;

                    // calculate average now for consumption and co2.
                    if (consumptiondefined) {
                      var seconds_passed = new Date(endtimeg).getTime() -new Date(starttimeg).getTime();
                      var consumption100Km = ((100 * (cons_override / (endindex - startindex + 1)) * (seconds_passed / (1000 * 60 * 60))) / (distance_override)).toFixed(2);

                      consumption100Km = consumption100Km.toString() +" L/100 Km";
                      $scope.consumption100Km = consumption100Km;

                      var temporaryconsumption = JSON.parse(JSON.stringify($scope.dataConsumption))

                      temporaryconsumption[0]['values'][0]['value'] = cons_override / (endindex - startindex + 1);
                      if ($scope.widgetType3 == "Consumption") {
                        // Recaulcalating the value for $scope.dataoverall if the selected phenomenon was consumption
                        $scope.dataoverall = temporaryconsumption;
                      }
                      consumptionDataCalculated = JSON.parse(JSON.stringify(temporaryconsumption));

                    } else {
                      // Assigning NaN when consumption is not defined.
                      var temporaryconsumption = JSON.parse(JSON.stringify($scope.dataSpeed))
                      temporaryconsumption[0]['values'][0]['value'] = Number.Nan;
                      if ($scope.widgetType3 == "Consumption") {
                        $scope.dataoverall = temporaryconsumption;
                      }
                      consumptionDataCalculated = JSON.parse(JSON.stringify(temporaryconsumption));
                    }

                    if (co2defined) {
                      var seconds_passed = new Date(endtimeg).getTime() - new Date(starttimeg).getTime();
                      var co2gKm = ((1000 * (co2_override / (endindex - startindex + 1)) * (seconds_passed / ( 1000 * 60 * 60))) / (distance_override)).toFixed(2);
                      $scope.co2gKm = co2gKm.toString() + " g/Km";
                      var temporaryco2 = JSON.parse(JSON.stringify($scope.dataCO2))
                      temporaryco2[0]['values'][0]['value'] = co2_override / (endindex - startindex + 1);
                      if ($scope.widgetType3 == "CO2") {
                        // Recaulcalating the value for $scope.dataoverall if the selected phenomenon was CO2
                        $scope.dataoverall = temporaryco2;
                      }
                      co2DataCalculated = JSON.parse(JSON.stringify(temporaryco2));
                    } else {
                      // Assigning NaN when Co2 is not defined.
                      var temporaryco2 = JSON.parse(JSON.stringify($scope.dataCO2))
                      temporaryco2[0]['values'][0]['value'] = Number.Nan;
                      if ($scope.widgetType3 == "CO2") {
                        $scope.dataoverall = temporaryco2;
                      }
                      co2DataCalculated = JSON.parse(JSON.stringify(temporaryco2));
                    }
                  }
                }
                worker(iter, data.data);
              }
              if (iter == 0) {
                rangeobjects[phenoms[j]][1] = data.data.features[iter].properties.phenomenons[phenoms[j]].unit;
                // Assigning units to the rangeObjecs.
                /*
                'Speed': [
                  [0, 30, 60, 90, 120, 150],
                ],
                'Calculated MAF': [
                  [0, 5, 10, 15, 20, 25],
                ]
                First index of Speed is an array and second index is unit.
                */
              }
              if (override == 0 || (override == 1 && ((iter >= startindex && iter < endindex)))) {
                var date = new Date(data.data.features[iter].properties.time);
                var date_as_ms = date.getTime();
                if (data.data.features[iter].properties.phenomenons[phenoms[j]]) {
                  // Filling up the data for pie charts by checking the range in which the value of that particular phenomenon lies.
                  var speed = data.data.features[iter].properties.phenomenons[phenoms[j]].value;
                  for (var k = chart.numberofranges; k >= 0; k--) {

                    if (speed >= rangeobjects[phenoms[j]][0][k]) {
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

              // This is finally pushed in $scope.data
              data_to_push = {
                "key": phenoms[j],
                "values": dat,
                "color": colors[j]
              };
            })(i);
          }

          $scope.onload_summary = true;
          if (phenoms[j] == $scope.piechartselected) {
            var temp_obj = {};
            for (var i = 0; i <= chart.numberofranges; i++) {
              // Calculating the fraction of points that belong in the phenomenon range
              temp_obj['y'] = (piechartsdata[$scope.piechartselected][i] * 100) / (endindex - startindex);
              var content;
              if (i != chart.numberofranges) {
                // For any of the intermediate phenomenon range like 0 - 30 Km/H
                content = rangeobjects[$scope.piechartselected][0][i] +"-" + rangeobjects[$scope.piechartselected][0][i +1] + " " + rangeobjects[$scope.piechartselected][1];
              } else {
                // For the maximum phenomenon value of that phenomenon like > 150 Km/H
                content = "> " + rangeobjects[$scope.piechartselected][0][i] + " " + rangeobjects[$scope.piechartselected][1];
              }
              temp_obj['key'] = content;
              $scope.data_pie[i] = temp_obj;
              temp_obj = {}
            }
          }
          datafinal.push(data_to_push);
        }
        $scope.onload_nvd3line = true;
        $scope.onload_nvd3pie = true;

        var data_temp = []

        for (var iterator = 0; iterator < datafinal.length; iterator++) {
          if ($scope.selected.indexOf(datafinal[iterator]['key']) > -1) {
            data_temp.push(datafinal[iterator]);
            $scope.data = data_temp;
          }
        }
        if (override != 1) {
          optionchanger(data, 'Speed', 1);
        }

        // Determining the bounds for the map. The bound primarily depend on two scenarios when the start is relatively northeast/southeast  compared to end point, and vice versa.
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

        // Zoom is calculated on basis of a hypothetical function that fit most use cases and exhibits a inverse relation to distance.
        // The zoom does not perform well when the car distance is much gretaer than the displacement.
        $scope.center['zoom'] = Math.round((20 / Math.pow(dist, 1.5)) +9)
        $scope.onload_leaflet = true;

        function worker(i, data) {
          // A utility function called to store the units and some other static information about the track
          if (i == 0) {
            for (var j = 0; j < keys.length; j++) {
              units[keys[j]] = data.features[i].properties.phenomenons[keys[j]].unit;
            }
            distance = data.properties['length'];
            vehiclemodel = data.properties.sensor.properties.model;
            vehicletype = data.properties.sensor['type'];
            vehiclemanufacturer = data.properties.sensor.properties['manufacturer'];
            return;
          }
        }

        // The object from which most values are used in the html page
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
          co2emissionperhour: consumption_avg,
          starttime: new Date(starttimeg).toLocaleString(),
          endtime: new Date(endtimeg).toLocaleString()
        }
        $scope.loading = false
      }

      factorysingletrack.get(url).then(function(data) {
        if (data.status > 300) {
          // Handling the page when an invalid trackID is entered by the user!
          console.log("getting a bad request")
          $scope.error = data.data;
          // In the event a wrong track ID is fed into the comments.
          $state.go("home.error", {
            path: data.data,
            status: data.status
          });
        } else {
          // A valid track ID was presented. Build the data for the entire track initially
          trackiterator(data, 0, 0, 0);
        }
      });

      function optionchanger(data, phenomoption, flag) {

        for (var k = 0; k < len_data; k++) {
          if (k == 0 && flag == 1) {
            // Set the start marker.
            var m1 = {};
            m1['lat'] = data.data.features[0].geometry.coordinates[1];
            m1['lng'] = data.data.features[0].geometry.coordinates[0];
            m1['focus'] = true;
            m1['draggable'] = true;
            m1['message'] = chart.m1message;
            $scope.markers['m1'] = m1;
            latinitial = data.data.features[0].geometry.coordinates[1];
            longinitial = data.data.features[0].geometry.coordinates[0];
          }
          if (k >= 1) {
            // create the path for the track points on the graph.
            var p = 'p';
            var path_number = String(p + (k + 1));
            var pathobj = {}
            if (data.data.features[k - 1].properties.phenomenons[phenomoption])
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
            global_lat_lngs.push([data.data.features[k - 1].geometry.coordinates[1], data.data.features[k - 1].geometry.coordinates[0]]);

            // Message to be displayed when user clicks on a path
            pathobj['message'] =
              (
                "<div style=\"color:#0065A0;width:120px\"><p style=\"font-size:10px;\"><b>Speed: </b>" +
                data.data.features[k - 1].properties.phenomenons["Speed"].value.toFixed(2) +
                " " + data.data.features[k - 1].properties.phenomenons["Speed"].unit +
                "</p><p style=\"font-size:10px;\"><b>Consumption: </b>" +
                (data.data.features[k - 1].properties.phenomenons["Consumption"] != undefined ?
                  data.data.features[
                    k - 1].properties.phenomenons["Consumption"].value.toFixed(
                    2) : "NA") +
                " " + (data.data.features[k - 1].properties.phenomenons[
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
            // Adding the Finish marker.
            var m2 = {};
            m2['lat'] = data.data.features[k].geometry.coordinates[1];
            m2['lng'] = data.data.features[k].geometry.coordinates[0];
            m2['focus'] = false;
            m2['draggable'] = true;
            m2['message'] = chart.m2message;
            $scope.markers['m2'] = m2;
            global_lat_lngs.push([data.data.features[k - 1].geometry.coordinates[
              1], data.data.features[k - 1].geometry.coordinates[0]]);
          }
        }
      }
      /*
      ARTIFICAT FROM A BETA
      $scope.showSegmentAPI = function() {
        console.log("User has requested for more data");
        $scope.SegmentAPI = false;
        var coordinates = [];
        // now we have to construct the POST query to retirieve the results. //
        for (var i = $scope.slider.minValue; i < $scope.slider.maxValue; i++) {
          coordinates.push([data_global.data.features[i]['geometry'][
            'coordinates'
          ][1], data_global.data.features[i]['geometry'][
            'coordinates'
          ][0]]);
        }
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
          "tolerance": 10.0
        };

        var req = {
          method: 'POST',
          url: "https://envirocar.org/envirocar-rest-analyzer/dev/rest/route/statistics",
          data: dataput
        }
         delete $http.defaults.headers.common["X-User"];
       delete $http.defaults.headers.common["X-Token"];
        $http(req).then(function(resp) {
          console.log(resp);
        })
      }
      */
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
