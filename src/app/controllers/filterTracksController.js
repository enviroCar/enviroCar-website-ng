angular.module('app')
  .controller("filterTracksController", ['$scope', '$q', '$rootScope', '$http',
    '$stateParams', '$state','$mdDialog', '$mdMedia', 'tracks_calendar',
    function($scope,$q, $rootScope, $http, $stateParams, $state, $mdDialog,
      $mdMedia, tracks_calendar) {
      $scope.showSearch = false;
      $scope.showSearch2 = false;

      // Whether the order by is to be filtered or not
      $scope.reverseEnabled = false;
      $scope.reverse = true;
      $scope.onload = true;

      $scope.reverseClicked = function()
      {
        if($scope.reverse == false)
        {
          $scope.reverse = true;
        }
        else{
          $scope.reverse = false;
        }
        console.log($scope.reverseEnabled);
      }

      $scope.toggleShow = function()
      {
        // when the search icon is shown on the topbar
        if($scope.showSearch == true)
        {
          $scope.search = "";
          $scope.showSearch = false;
        }
        else{
          $scope.showSearch = true;
        }
      }

      $scope.dateCustomShow = false;
      $scope.distanceCustomShow = false;

      $scope.submitButtonShow = false;

      $scope.dateCustom = "All days";
      $scope.distanceCustom = "All lengths";

      $scope.dateStartCustom = new Date();
      $scope.dateEndCustom = new Date();

      $http.defaults.headers.common = {
        'X-User': $rootScope.globals.currentUser.username,
        'X-Token': $rootScope.globals.currentUser.authdata
      };

      $scope.$on('$viewContentLoaded', $scope.init);
      $scope.init = function() {
        $scope.filterSelected = "Duration";
      }

      $rootScope.showPopOver = function(trackid) {
        $rootScope.popoverIsVisible = true;
        $rootScope.previewurl = trackid;
      }

      $scope.hidePopOver = function() {
        $rootScope.previewurl = "";
        $rootScope.popoverIsVisible = false;
      }

      $scope.goToActivity = function(trackid) {
        // Redirects to the single track analysis page if a track list item is clicked
        //redirect to the track analytics page.
        $state.go('home.chart', {
          'trackid': trackid
        });
      }


      $scope.itemtest = 5;
      /*
      $scope.submitButtonAction = function() {
        $scope.submitbuttonclicked = true;
        if ($scope.distanceCustom == "Custom") {
          //only in this case will the filter be applied.
          $scope.modifiedMinDistance = $scope.minDistanceFilter;
          $scope.modifiedMaxDistance = $scope.maxDistanceFilter;
        }
        if ($scope.dateCustom == "Custom") {
          console.log("start and end value");
          console.log($scope.dateStartCustom);
          console.log($scope.dateEndCustom);
          console.log($scope.dateStartObject);
          console.log($scope.dateEndObject);
          // only in this case will the filter be applied to the date filtering capabilities.
          $scope.modifiedStartDate = $scope.dateStartCustom.getTime();
          $scope.modifiedEndDate = $scope.dateEndCustom.getTime();
        }
      }

      $scope.showAdvanced = function(ev, eventid) {
        $scope.currenttrack = {};
        $scope.currenttrack['id'] = eventid;
        $scope.track = eventid;
        console.log(eventid);

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'app/views/dialog1.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
              currenttrack: $scope.currenttrack
            },
            fullscreen: useFullScreen
          })
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
      };
      */

      $scope.vegetables = loadFilters();
      $rootScope.selectedFilters = [];
      $scope.autocompleteDemoRequireMatch = true;
      $scope.searchText = null;
      $scope.selectedItem  = null;

      $scope.transformChip = function (chip)
      {
        if(angular.isObject(chip))
        {
          return chip;
        }
        else{
          return(chip);
        }
      }

      $scope.querySearch = function (query)
      {
        // When a filter is being created by typing the filtername
        var results = query ? $scope.vegetables.filter($scope.createFilterFor(query)) : [];
        return results;
      }

      $scope.createFilterFor = function (query) {
        // Creates a filter by making use of autocomplete
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(vegetable) {
        return (vegetable._lowername.indexOf(lowercaseQuery) === 0) ||
            (vegetable._lowertype.indexOf(lowercaseQuery) === 0);
         };
      }

      function loadFilters() {
      var filtersArray = [
        {
          'name': 'Distance',
          'type': '1'
        },
        {
          'name': 'Date',
          'type': '1'
        },
        {
          'name': 'Duration of Travel',
          'type': '1'
        },
        {
          'name': 'Vehicle',
          'type': '1'
        }
      ];
      return filtersArray.map(function (f) {
        f._lowername = f.name.toLowerCase();
        f._lowertype = f.type.toLowerCase();
        return f;
      });
    }

    $scope.getChipInfo = function(chip)
    {
      // When a click event is fired on the chip, we reopen the corresponding filter dialog
      // to allow the user to make edits to the filter.
      commonDialog(chip.name);
    }

    var distanceRange = {};
    var dateRange = {};
    var durationRange = {};
    var vehiclesRange = {};

    var vehiclesList = {};

    $scope.add = function(chip) {
      // Adds a chip
      commonDialog(chip.name);
    }

    // To keep track of whether a filter is already present
    var dateFilterPresent = false;
    var distanceFilterPresent = false;
    var durationFilterPresent = false;
    var vehicleFilterPresent = false;

    function commonDialog(filter)
    {
        var showObject = {};
        if(filter == "Distance")
        {
          showObject = {
            controller: DistanceDialogController,
            templateUrl: 'app/views/DistanceDialogPage.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: useFullScreen
          }
        }
        else if(filter == "Date")
        {
          showObject = {
            controller: DateDialogController,
            templateUrl: 'app/views/DateDialogPage.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: useFullScreen
          }
        }
        else if(filter == "Duration of Travel")
        {
          showObject = {
             controller: DurationDialogController,
            templateUrl: 'app/views/DurationDialogPage.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: useFullScreen
          }
        }
        else if(filter == "Vehicle")
        {
          showObject = {
            controller: VehicleDialogController,
            templateUrl: 'app/views/VehicleDialogPage.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: useFullScreen
          }
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
    // Array of Filters from which one can select in the dropdownMenu for adding filters.
    $rootScope.filters = [["Distance",0,distanceFilterPresent], ["Date",1,dateFilterPresent], ["Duration of Travel",2,durationFilterPresent], ["Vehicle",3,vehicleFilterPresent]];

    // Holds the filters that are currently selected
    $scope.filtersS  = [];

    var originatorEv;
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    // If false, that phenomenon would bot be displayed in the dropdown menu. It will be false if the phenomenon is already added in the chips list.
    $rootScope.distanceShow = true;
    $rootScope.dateShow = true;
    $rootScope.vehicleShow = true;
    $rootScope.durationShow = true;

    $scope.addFilter = function(filter)
    {
      // An utility map to replace writing switch cases for each of the filter
      var filterMap = {0:["Distance",distanceFilterPresent],1:["Date",dateFilterPresent],2:["Duration of Travel",durationFilterPresent],3:["Vehicle",vehicleFilterPresent]};
      if(!filterMap[filter][1])
      {
        // if it is not already present only then add it
         $rootScope.selectedFilters.push({'name':filterMap[filter][0],'type':'new'});
         $scope.add({'name':filterMap[filter][0]});
      }
    }
    /*
    $scope.filterAddedRemoved = function()
    {
      var filtermap = {'Distance':distanceFilterPresent,'Date':dateFilterPresent,'Duration of Travel':durationFilterPresent,'Vehicle':vehicleFilterPresent};

        for(var i = 0 ; i <  $scope.filtersS.length ; i++)
        {
            if(!filtermap[$scope.filtersS[i]])
            {
              // if this filter was not present, then add it.
              $scope.selectedFilters.push({ 'name':$scope.filtersS[i],'type':'new'});
              $scope.add({'name':$scope.filtersS[i]});
            }
        }
    }*/

    // Controller to handle the dialog for Distance filter to be applied
    function DistanceDialogController($scope, $mdDialog, $state) {
      $scope.valid = function()
      {
        return true;
      }
      // The flags for 2 error checks that are to be performed

      $scope.errorNegative = false;
      $scope.errorOverlap = false;

       if(distanceFilterPresent == true)
       {
         // If it was already present/ We are onlt editing the chip that is already present, then load the previous values
         $scope.minDistanceFilter = distanceRange['min'];
         $scope.maxDistanceFilter = distanceRange['max'];
       }

      $scope.minDistanceFilter;

       $scope.hide = function() {
         $scope.errorNegative = false;
         $scope.errorOverlap = false;
         $rootScope.distanceShow = false;

         if($scope.minDistanceFilter < 0 || $scope.maxDistanceFilter<0)
         {
            // Negative values given for distance.
            $scope.errorNegative = true;
         }
         else if($scope.minDistanceFilter > $scope.maxDistanceFilter)
         {
           // If minimum distance value is larger than maximum distance value
           $scope.errorOverlap = true;
         }
         else if($scope.maxDistanceFilter > 5000)
         {
           // Limit maximum distance to 5000km
           $scope.errorLimit = true;
         }
         else{
           // None of the errors occured! Can successfully set filters
           $rootScope.filters[0][2] = true;
           // Set the distance range with two keys for min and max.
           // (The ternary conditions also ensure that the default values are assigned if the user leaves the field empty)
           distanceRange = {'min':($scope.minDistanceFilter!=(undefined || null)?$scope.minDistanceFilter:0),'max':($scope.maxDistanceFilter!=(undefined || null)?$scope.maxDistanceFilter:5000)}
            distanceFilterPresent = true;
            $mdDialog.hide();
         }
        };


        $scope.cancel = function() {
          // The user clicked on cancel, so remove the filter that was added.
          for(var i = 0 ; i < $rootScope.selectedFilters.length; i++)
          {
              if($rootScope.selectedFilters[i].name=="Distance" && !distanceFilterPresent)
              {
                // Remove the filter only if the filter was not already present.
                $rootScope.selectedFilters.splice(i,1);
              }
          }
          $mdDialog.cancel();
        };
    }

       function DateDialogController($scope, $mdDialog, $state) {
         $scope.errorOverlap = false;
         $scope.dateStartCustom = new Date();
         $scope.dateEndCustom = new Date();
         if(dateFilterPresent == true)
         {
           $scope.dateStartCustom = dateRange['start'];
           $scope.dateEndCustom = dateRange['end'];
         }
       $scope.hide = function() {
         if($scope.dateStartCustom.getTime() > $scope.dateEndCustom.getTime())
         {
           // If start date occurs fater the end date.
           $scope.errorOverlap = true;
         }
         else{
         $rootScope.dateShow = false;
         $rootScope.filters[1][2] = true;
         dateRange = {'start':$scope.dateStartCustom,'end':$scope.dateEndCustom};
         dateFilterPresent = true;
            $mdDialog.hide();
         }
        };
        $scope.cancel = function() {
          // The user clicked on cancel, so remove the filter that was added.
          for(var i = 0 ; i < $rootScope.selectedFilters.length; i++)
          {
              if($rootScope.selectedFilters[i].name=="Date" && !dateFilterPresent)
              {
                // Remove the filter only if the filter was not already present.
                $rootScope.selectedFilters.splice(i,1);
              }
          }
          $mdDialog.cancel();
        };
    }

    // Works the same way as the Distance Controller
    function DurationDialogController($scope, $mdDialog, $state) {
       $scope.errorNegative = false;
       $scope.errorOverlap = false;
       if(durationFilterPresent == true)
         {
           //which implies this is a event to change the existing filter
           $scope.minDurationFilter = durationRange['min'];
           $scope.maxDurationFilter = durationRange['max'];
         }
       $scope.hide = function() {
          if($scope.minDurationFilter < 0 || $scope.maxDurationFilter<0)
         {
            $scope.errorNegative = true;
         }
         else if($scope.minDurationFilter > $scope.maxDurationFilter)
         {
           $scope.errorOverlap = true;
         }
         else if($scope.maxDurationFilter > 6000)
         {
           $scope.errorLimit = true;
         }
         else{
           // Default minimum is 0 and max is 6000 minutes.
         $rootScope.durationShow = false;
         $rootScope.filters[2][2] = true;
         durationRange = {'min':($scope.minDurationFilter!=(undefined || null)?$scope.minDurationFilter:0),'max':($scope.maxDurationFilter!=(undefined || null)?$scope.maxDurationFilter:6000)}
         durationFilterPresent = true;
            $mdDialog.hide();
         }
        };
        $scope.cancel = function() {
          for(var i = 0 ; i < $rootScope.selectedFilters.length; i++)
          {
              if($rootScope.selectedFilters[i].name=="Duration of Travel" && !durationFilterPresent)
              {
                $rootScope.selectedFilters.splice(i,1);
              }
          }
          $mdDialog.cancel();
        };
    }

    function VehicleDialogController($scope, $mdDialog, $state)
    {
      $scope.vehicleList = Object.keys(vehiclesList);
      // Vehicle list is the object map of all vehicles that was extracted from the list of all tracks that was returned
         if(vehicleFilterPresent == true)
         {
           $scope.vehicles = JSON.parse(JSON.stringify(vehiclesRange))
           //which implies this is a event to change the existing filter
         }
       $scope.hide = function() {
            $rootScope.filters[3][2] = true;
            $rootScope.vehicleShow = false;
            vehiclesRange = JSON.parse(JSON.stringify($scope.vehicles));
            vehicleFilterPresent = true;
            $mdDialog.hide();
        };

        $scope.cancel = function() {
          for(var i = 0 ; i < $rootScope.selectedFilters.length; i++)
          {
              if($rootScope.selectedFilters[i].name=="Vehicle" && !vehicleFilterPresent)
              {
                // remove item
                $rootScope.selectedFilters.splice(i,1);
              }
          }
          $mdDialog.cancel();
        };
    }


    /*var searchTracks = function()
    {
        var dateFilterPresent = false;
   	    $scope.distanceFilterPresent = false;
        $scope.durationFilterPresent = false;
        $scope.vehicleFilterPresent = false;
        console.log($rootScope.selectedFilters);
        console.log(dateRange);
        console.log(distanceRange);
        for(var i = 0; i < $rootScope.selectedFilters.length; i++)
        {
            if($rootScope.selectedFilters[i].name == "Date")
            {
                //Date is present in the filters
                $scope.dateFilterPresent = true;
            }
            else if($rootScope.selectedFilters[i].name == "Distance")
            {
              // Distance is present in the filters
              $scope.distanceFilterPresent = true;
            }
            else if($rootScope.selectedFilters[i].name == "Duration of Travel")
            {
              // Duration of Travel is present in the filters.
              $scope.durationFilterPresent = true;
            }
            else if($rootScope.selectedFilters[i].name == "Vehicle")
            {
              // Vehicle is present in the filters
              $scope.vehicleFilterPresent = true;
            }
        }
    }
    */

     $scope.dateFilter = function(item) {
        if(!dateFilterPresent)
        {
          //no date filter is present. Return all
          return(item.Start);
        }
        else{
          // 864000000 is added to account for the tracks that fall on the day of the filter.
          // If the second date selected is 17/8/2016 we have to also include all tracks that fall on that day,
          // this addition is to ensure that we consider tracks till 23:59 hours also.
          return(item.StartDateObject >= dateRange['start'].getTime() && item.StartDateObject <= (dateRange['end'].getTime()+ 86400000) )
        }
      }

      $scope.distanceFilter = function(item) {
        if(!distanceFilterPresent)
        {
          // No distance filter is present. Return all
          return(item.Distance);
        }
        else{
          return(item.Distance > distanceRange['min'] && item.Distance < distanceRange['max'])
        }
      }

      $scope.durationFilter = function(item)
      {
        if(!durationFilterPresent)
        {
          // No duration filter is present. Return all
          return(item.DurationInMinutes);
        }
        else{
          return(item.DurationInMinutes > durationRange['min'] && item.DurationInMinutes < durationRange['max']);
        }
      }

      $scope.vehicleFilter = function(item)
      {
        if(!vehicleFilterPresent)
        {
          return(item.Vehicle)
        }
        else{
          if(vehiclesRange.indexOf(item.Vehicle) > -1)
          {
            return(item.Vehicle);
          }
        }
      }

    $scope.removeChip = function(chip)
    {
          // Function fired when a chip is removed.
          if(chip.name == "Distance")
          {
            // The filter is no longer applied
            $rootScope.filters[0][2] = false;
            // The filter is to now be visible in the select dropdown list
            $rootScope.distanceShow = true;
            distanceFilterPresent = false;
          }
          else if(chip.name == "Date")
          {
            $rootScope.filters[1][2] = false;
            $rootScope.dateShow = true;
            dateFilterPresent = false;
          }
          else if(chip.name == "Duration of Travel")
          {
            $rootScope.filters[2][2] = false;
            $rootScope.durationShow = true;
            durationFilterPresent = false;
          }
          else if(chip.name == "Vehicle")
          {
            $rootScope.filters[3][2] = false;
            $rootScope.vehicleShow = true;
            vehicleFilterPresent = false;
          }
    }

    /* ARTIFACT from previous implementation where clicking on a track first opened up a dialog with track summary.
    // This approach was dismissed as the statistics sometimes too long to be loaded on the screen.
      function DialogController($scope, $mdDialog, $state, currenttrack) {
        $scope.onload = false;
        $scope.currenttrack = currenttrack;

        var starttime;
        var endtime;
        var length;
        var url_requested = "https://envirocar.org/api/stable/users/" +
          $rootScope.globals.currentUser.username + "/tracks/" + currenttrack
          .id;
        tracks_calendar.get(url_requested).then(function(data) {
          console.log(data.data);
          length = data.data.properties['length'];
          $scope.currenttrack['manufacturer'] = data.data.properties.sensor
            .properties['manufacturer'];
          $scope.currenttrack['model'] = data.data.properties.sensor.properties[
            'model'];
          $scope.currenttrack['start'] = new Date(data.data.features[0].properties
            .time).toLocaleString();
          $scope.currenttrack['end'] = new Date(data.data.features[data.data
            .features.length - 1].properties.time).toLocaleString();
          starttime = data.data.features[0].properties.time;
          endtime = (data.data.features[data.data.features.length - 1].properties
            .time);
          console.log(starttime + 'is starttime');
          console.log(endtime + "is endtime");
          console.log(length + "is legnth");
          tracks_calendar.get(url_requested + "/statistics/Consumption").then(
            function(
              data) {
              console.log(data.data.avg);
              if (data.data.avg != undefined) {
                $scope.currenttrack['consumption_avg'] = (data.data.avg
                  .toFixed(
                    2));
                var seconds_passed = new Date(endtime).getTime() - new Date(
                  starttime).getTime();
                console.log(seconds_passed);
                $scope.currenttrack['consumption100Km'] = ((100 *
                    $scope
                    .currenttrack[
                      'consumption_avg'] * (seconds_passed / (1000 *
                      60 *
                      60))) /
                  length).toFixed(2);
                $scope.currenttrack['consumption100Km'] = $scope.currenttrack[
                  'consumption100Km'].toString() + " L/100 Km";
              } else
                $scope.currenttrack['consumption100Km'] = "NA";

              //  currenttrack['']
              $scope.onload = true;
            })

          tracks_calendar.get(url_requested + "/statistics/CO2").then(
            function(
              data) {
              console.log(data.data.avg);
              if (data.data.avg != undefined) {
                $scope.currenttrack['co2_avg'] = (data.data.avg
                  .toFixed(
                    2));
                var seconds_passed = new Date(endtime).getTime() - new Date(
                  starttime).getTime();
                console.log(seconds_passed);
                $scope.currenttrack['co2gKm'] = ((1000 *
                    $scope
                    .currenttrack[
                      'co2_avg'] * (seconds_passed / (1000 *
                      60 *
                      60))) /
                  length).toFixed(2);
                $scope.currenttrack['co2gKm'] = $scope.currenttrack[
                  'co2gKm'].toString() + "  g/Km";
              } else
                $scope.currenttrack['co2gKm'] = "NA";

              //  currenttrack['']
              $scope.onload = true;

              console.log(data.data.avg);
              if (data.data.avg != undefined)
                $scope.currenttrack['co2_avg'] = (data.data.avg.toFixed(
                  2));
              else
                $scope.currenttrack['co2_avg'] = "NA";

              //  currenttrack['']
              $scope.onload = true;
            })
        })
        tracks_calendar.get(url_requested + "/statistics/Speed").then(
          function(data) {
            console.log(data.data);
            $scope.currenttrack['speed_avg'] = (data.data.avg.toFixed(2));
            //  currenttrack['']
          })



        $scope.currenttrack['url'] =
          "https://envirocar.org/api/stable/tracks/" + currenttrack.id +
          "/preview";
        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
        $scope.redirect = function(trackid) {
          $mdDialog.hide();

          $state.go('home.chart', {
            'trackid': trackid
          });
        }
      }
      */
      $scope.Modified = "Modified";

      // Array of options that can be used to to order the list of tracks.
      $scope.filterOptions = ["Start", "Distance", "Duration", "Name","Vehicle", "TrackId", "Modified"];

      if ($stateParams.user == "") {
        username = $rootScope.globals.currentUser.username;
      } else {
        // If the tracks for a different user is being requested for.
        username = $stateParams.user;
      }

      // Array of subset of information of all tracks returned by the server
      $scope.tracks = [];
      var url = 'https://envirocar.org/api/stable/users/' + username + '/tracks?limit=1000';
      $http.get(url).then(function(data) {
        var tracks = [];
        for (var i = 0; i < data.data.tracks.length; i++) {

          var track_helper = {};
          track_helper['TrackId'] = data.data.tracks[i].id;
          track_helper['Name'] = data.data.tracks[i].name;
          track_helper['Start'] = data.data.tracks[i].begin;
          track_helper['StartDateObject'] = new Date(data.data.tracks[i].begin).getTime();
          track_helper['Vehicle'] = data.data.tracks[i].sensor.properties.model;
          if(vehiclesList[ data.data.tracks[i].sensor.properties.model] == undefined)
          {
              vehiclesList[data.data.tracks[i].sensor.properties.model] = 1;
          }
          track_helper['manufacturer'] = data.data.tracks[i].sensor.properties.manufacturer;
          track_helper['Distance'] = Number(data.data.tracks[i]['length'].toFixed(2));
          track_helper['url'] = "https://envirocar.org/api/stable/tracks/" + data.data.tracks[i].id + "/preview";
          track_helper['Modified'] = data.data.tracks[i].modified;
          var seconds_passed = new Date(data.data.tracks[i].end).getTime() -new Date(data.data.tracks[i].begin).getTime();
          track_helper['Duration'] = seconds_passed;

          var seconds = seconds_passed / 1000;
          var timeoftravel = seconds / 60;
          track_helper['DurationInMinutes'] = timeoftravel;

          date_for_seconds = new Date(null);
          date_for_seconds.setSeconds(seconds);
          date_hh_mm_ss = date_for_seconds.toISOString().substr(11, 8)
          track_helper['DurationString'] = date_hh_mm_ss;
          tracks.push(track_helper);
        }
        $scope.tracks = tracks;
        $scope.onload = false;
      })
      $scope.$watch('filterSelected', function() {
        //  $scope.filterOrig = $scope.filterSelected;
      })

      $scope.changeFilter = function(d) {
        $scope.filterSelected = d;
        if (d == "Start" || d == "Modified") {
          // For ordering by start and modified date, the default filtering is to be from latest to older tracks
          // Latest to older is technically a descending ordering, so include a "-" to force a reverse.
          d == "Start" ? $scope.filterOrig = "-Start" : $scope.filterOrig = "-Modified";
        } else
          $scope.filterOrig = d;
      }
    }
  ]);
