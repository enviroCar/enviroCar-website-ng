angular.module('app')
  .controller("filterTracksController", ['$scope', '$q', '$rootScope', '$http',
    '$stateParams', '$state','$mdDialog', '$mdMedia', 'tracks_calendar',
    function($scope,$q, $rootScope, $http, $stateParams, $state, $mdDialog,
      $mdMedia, tracks_calendar) {
      $scope.showSearch = false;
      $scope.showSearch2 = false;
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

      function initializeDefaultValues() {
        console.log("came to date");
        $scope.dateEndCustom = new Date();
        var startdate = new Date($scope.dateEndCustom);
        startdate.setFullYear($scope.dateEndCustom.getFullYear() - 1);
        $scope.dateStartCustom = new Date(startdate);
      }
      $scope.$on('$viewContentLoaded', $scope.init);
      $scope.init = function() {
        $scope.filterSelected = "Duration";
      }

      $rootScope.showPopOver = function(trackid) {
        $rootScope.popoverIsVisible = true;
        $rootScope.previewurl = trackid;
        console.log(trackid);
        console.log("show pop");
      }

      $scope.hidePopOver = function() {
        $rootScope.previewurl = "";
        $rootScope.popoverIsVisible = false;
        console.log("hide pop");
      }

      $scope.goToActivity = function(trackid) {
        console.log("came here");
        //redirect to the track analytics page.
        $state.go('home.chart', {
          'trackid': trackid
        });

        console.log("fired");
      }

      $scope.defaultDatesAll = function() {
        $scope.dateCustom = "All days"
        $scope.dateCustomShow = false;
      }

      $scope.startDateChange = function() {
        console.log("came here 1");
        console.log($scope.dateStartCustom)
        $scope.dateStartObject = new Date($scope.dateStartCustom);
        console.log($scope.dateStartObject);
      }

      $scope.endDateChange = function() {
        console.log("came here 2");
        console.log($scope.dateEndCustom);
        $scope.dateEndObject = new Date($scope.dateEndCustom);
        console.log($scope.dateEndObject);
      }

      $scope.defaultDatesCustom = function() {
        $scope.dateCustom = "Custom";
        //  initializeDefaultValues();
        $scope.dateCustomShow = true;
        $scope.submitButtonShow = true;
      }

      $scope.defaultDistanceAll = function() {
        $scope.distanceCustom = "All lengths"
        $scope.distanceCustomShow = false;
      }

      $scope.defaultDistanceCustom = function() {
        $scope.distanceCustom = "Custom"
        $scope.distanceCustomShow = true;
        $scope.submitButtonShow = true;
      }
      $scope.itemtest = 5;

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

      $scope.vegetables = loadVegetables();
      $rootScope.selectedVegetables = [];
      $scope.autocompleteDemoRequireMatch = true;
      $scope.searchText = null;
      $scope.selectedItem  = null;


            $scope.sItems = [{
          name: "Mini Cooper",
          id: 0
        }, {
          name: "Lexus IS250",
          id: 1
        }, {
          name: "Ford F150",
          id: 2
        }, {
          name: "Toyota Prius",
          id: 3
        }, {
          name: "Porsche 911",
          id: 4
        }, {
          name: "Ferreri 488",
          id: 5
        }];

        $scope.myItems = [$scope.sItems[4], $scope.sItems[5]];

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
        var results = query ? $scope.vegetables.filter($scope.createFilterFor(query)) : [];
        return results;
      }

      $scope.createFilterFor = function (query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(vegetable) {
        return (vegetable._lowername.indexOf(lowercaseQuery) === 0) ||
            (vegetable._lowertype.indexOf(lowercaseQuery) === 0);
         };
      }

      function loadVegetables() {
      var veggies = [
        {
          'name': 'Distance',
          'type': 'Brassica'
        },
        {
          'name': 'Date',
          'type': 'Brassica'
        },
        {
          'name': 'Duration of Travel',
          'type': 'Umbelliferous'
        },
        {
          'name': 'Vehicle',
          'type': 'Composite'
        }
      ];
      return veggies.map(function (veg) {
        veg._lowername = veg.name.toLowerCase();
        veg._lowertype = veg.type.toLowerCase();
        return veg;
      });
    }

    $scope.getChipInfo = function(chip)
    {
      commonDialog(chip.name);
    }
    $scope.fruitNames = ['Apple', 'Banana', 'Orange'];
    $scope.roFruitNames = angular.copy(self.fruitNames);

    var distanceRange = {};
    var dateRange = {};
    var durationRange = {};
    var vehiclesRange = {};
    var vehiclesList = {};

    $scope.add = function(chip) {
      console.log(chip);
      commonDialog(chip.name);

     // $scope.selectedVegetables.push({'name':'naveen','type':'new'})
     // $scope.selected = chip;
    }
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
    $rootScope.filters = [["Distance",0,distanceFilterPresent], ["Date",1,dateFilterPresent], ["Duration of Travel",2,durationFilterPresent], ["Vehicle",3,vehicleFilterPresent]];
    $scope.filtersS  = [];

    var originatorEv;
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    $rootScope.distanceShow = true;
    $rootScope.dateShow = true;
    $rootScope.vehicleShow = true;
    $rootScope.durationShow = true;

    $scope.addFilter = function(filter)
    {
      var filterMap = {0:["Distance",distanceFilterPresent],1:["Date",dateFilterPresent],2:["Duration of Travel",durationFilterPresent],3:["Vehicle",vehicleFilterPresent]};
      if(!filterMap[filter][1])
      {
        // if it is not already present only then add it
         $rootScope.selectedVegetables.push({'name':filterMap[filter][0],'type':'new'});
         $scope.add({'name':filterMap[filter][0]});
      }
      console.log(filter);
      console.log($rootScope.selectedVegetables);
      console.log("cotnetn");
    }

    $scope.filterAddedRemoved = function()
    {
      var filtermap = {'Distance':distanceFilterPresent,'Date':dateFilterPresent,'Duration of Travel':durationFilterPresent,'Vehicle':vehicleFilterPresent};

        for(var i = 0 ; i <  $scope.filtersS.length ; i++)
        {
            if(!filtermap[$scope.filtersS[i]])
            {
              // if this filter was not present, then add it.
              $scope.selectedVegetables.push({ 'name':$scope.filtersS[i],'type':'new'});
              $scope.add({'name':$scope.filtersS[i]});
            }
        }
    }

    function DistanceDialogController($scope, $mdDialog, $state) {
      $scope.valid = function()
      {
        return true;
      }
      $scope.errorNegative = false;
      $scope.errorOverlap = false;
       if(distanceFilterPresent == true)
       {
         $scope.minDistanceFilter = distanceRange['min'];
         $scope.maxDistanceFilter = distanceRange['max'];
       }
      $scope.minDistanceFilter;

       $scope.hide = function() {
         $scope.errorNegative = false;
         $scope.errorOverlap = false;
         $rootScope.distanceShow = false;
         console.log("looking for");
         console.log($scope.minDistanceFilter + $scope.maxDistanceFilter);
         if($scope.minDistanceFilter < 0 || $scope.maxDistanceFilter<0)
         {
            $scope.errorNegative = true;
         }
         else if($scope.minDistanceFilter > $scope.maxDistanceFilter)
         {
           $scope.errorOverlap = true;
         }
         else if($scope.maxDistanceFilter > 5000)
         {
           $scope.errorLimit = true;
         }
         else{
           console.log($scope.filters);
           console.log($scope.maxDistanceFilter);
           console.log("is max distance");
           $rootScope.filters[0][2] = true;
           distanceRange = {'min':($scope.minDistanceFilter!=(undefined || null)?$scope.minDistanceFilter:0),'max':($scope.maxDistanceFilter!=(undefined || null)?$scope.maxDistanceFilter:5000)}
            distanceFilterPresent = true;
         //   $scope.filters = [["Distance",0,true], ["Duration of Travel",1,durationFilterPresent], ["Date",2,dateFilterPresent], ["Vehicle",3,vehicleFilterPresent]];

            $mdDialog.hide();
            console.log(distanceRange);
         }
        };


        $scope.cancel = function() {
          console.log("cancelled");
          for(var i = 0 ; i < $rootScope.selectedVegetables.length; i++)
          {
              if($rootScope.selectedVegetables[i].name=="Distance" && !distanceFilterPresent)
              {
                // remove item
                $rootScope.selectedVegetables.splice(i,1);
              }
          }
          console.log($rootScope.selectedVegetables);
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
           // overlap
           $scope.errorOverlap = true;
         }
         else{
         $rootScope.dateShow = false;
          $rootScope.filters[1][2] = true;

         dateRange = {'start':$scope.dateStartCustom,'end':$scope.dateEndCustom};
         dateFilterPresent = true;
            $mdDialog.hide();
            console.log(dateRange);
         }
        };
        $scope.cancel = function() {
          for(var i = 0 ; i < $rootScope.selectedVegetables.length; i++)
          {
              if($rootScope.selectedVegetables[i].name=="Date" && !dateFilterPresent)
              {
                // remove item
                $rootScope.selectedVegetables.splice(i,1);
              }
          }
          $mdDialog.cancel();
        };
    }

    function DurationDialogController($scope, $mdDialog, $state) {
       $scope.errorNegative = false;
       $scope.errorOverlap = false;
       if(durationFilterPresent == true)
         {
           console.log("True if reached");
           //which implies this is a event to change the existing filter
           $scope.minDurationFilter = durationRange['min'];
           $scope.maxDurationFilter = durationRange['max'];
           console.log($scope.minDurationFilter);
           console.log($scope.maxDurationFilter);
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
         $rootScope.durationShow = false;
         $rootScope.filters[2][2] = true;
         durationRange = {'min':($scope.minDurationFilter!=(undefined || null)?$scope.minDurationFilter:0),'max':($scope.maxDurationFilter!=(undefined || null)?$scope.maxDurationFilter:6000)}
         console.log("duration range is");
         console.log(durationRange);
         durationFilterPresent = true;
            $mdDialog.hide();
            console.log(dateRange);
         }
        };
        $scope.cancel = function() {
          for(var i = 0 ; i < $rootScope.selectedVegetables.length; i++)
          {
              if($rootScope.selectedVegetables[i].name=="Duration of Travel" && !durationFilterPresent)
              {
                // remove item
                $rootScope.selectedVegetables.splice(i,1);
              }
          }
          $mdDialog.cancel();
        };
    }

    function VehicleDialogController($scope, $mdDialog, $state)
    {
      $scope.vehicleList = Object.keys(vehiclesList);
      console.log($scope.vehicleList);
         if(vehicleFilterPresent == true)
         {
           console.log("True if reached");
           $scope.vehicles = JSON.parse(JSON.stringify(vehiclesRange))
           //which implies this is a event to change the existing filter
         }
       $scope.hide = function() {
            $rootScope.filters[3][2] = true;
            $rootScope.vehicleShow = false;
            console.log($scope.vehicles);
            vehiclesRange = JSON.parse(JSON.stringify($scope.vehicles));
            vehicleFilterPresent = true;
            $mdDialog.hide();
            console.log(dateRange);

        };

        $scope.cancel = function() {
          for(var i = 0 ; i < $rootScope.selectedVegetables.length; i++)
          {
              if($rootScope.selectedVegetables[i].name=="Vehicle" && !vehicleFilterPresent)
              {
                // remove item
                $rootScope.selectedVegetables.splice(i,1);
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
        console.log($rootScope.selectedVegetables);
        console.log(dateRange);
        console.log(distanceRange);
        for(var i = 0; i < $rootScope.selectedVegetables.length; i++)
        {
            if($rootScope.selectedVegetables[i].name == "Date")
            {
                //Date is present in the filters
                $scope.dateFilterPresent = true;
            }
            else if($rootScope.selectedVegetables[i].name == "Distance")
            {
              // Distance is present in the filters
              $scope.distanceFilterPresent = true;
            }
            else if($rootScope.selectedVegetables[i].name == "Duration of Travel")
            {
              // Duration of Travel is present in the filters.
              $scope.durationFilterPresent = true;
            }
            else if($rootScope.selectedVegetables[i].name == "Vehicle")
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
          console.log(dateRange['start'].getTime() + "start time in s");
          console.log(dateRange['end'].getTime() + 86400000 + "end time in s" + dateRange['end']);
          console.log(item.StartDateObject + "the actual date" + item.Start);
          return(item.StartDateObject >= dateRange['start'].getTime() && item.StartDateObject <= (dateRange['end'].getTime()+ 86400000) )
        }
       /*
     //   console.log($scope.dateCustom);
        if ($scope.dateCustom === "All Days") {
        //  console.log("never came here");
          return (item.Start);
        } else {
       //  console.log("should not" + $scope.dateCustom);
          if ($scope.modifiedStartDate == undefined) {
            $scope.modifiedStartDate = 0;
          }
          if ($scope.modifiedEndDate == undefined) {
            $scope.modifiedEndDate = new Date().getTime();
          }
          return (item.StartDateObject > $scope.modifiedStartDate && item.StartDateObject <
            $scope.modifiedEndDate)
        }
        */
      }

      $scope.distanceFilter = function(item) {
        if(!distanceFilterPresent)
        {
          return(item.Distance);
        }
        else{
          console.log(distanceRange['min'] + "is min distance");
          console.log(distanceRange['max'] + "is maximum distance");
          return(item.Distance > distanceRange['min'] && item.Distance < distanceRange['max'])
        }
        /*

        if ($scope.distanceCustom == "All lengths") {
          return (item.Distance)
        } else {
          if ($scope.modifiedMinDistance == undefined) {
            $scope.modifiedMinDistance = 0;
          }
          if ($scope.modifiedMaxDistance == undefined) {
            $scope.modifiedMaxDistance = Infinity;
          }
          return (item.Distance > $scope.modifiedMinDistance && item.Distance <
            $scope.modifiedMaxDistance)
        }*/

      }

      $scope.durationFilter = function(item)
      {
        if(!durationFilterPresent)
        {
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
            console.log("filtered");
            return(item.Vehicle);
          }
        }
      }

    $scope.remove = function(chip) {
      alert(chip);
      $scope.selected = chip;
    }

    $scope.removeChip = function(chip)
    {
          if(chip.name == "Distance")
          {
            $rootScope.filters[0][2] = false;
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
           console.log("removed")
    }
      function DialogController($scope, $mdDialog, $state, currenttrack) {
        console.log(currenttrack);
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
      $scope.Modified = "Modified";
      $scope.filterOptions = ["Start", "Distance", "Duration", "Name",
        "Vehicle", "TrackId", "Modified"
      ];
      if ($stateParams.user == "") {
        username = $rootScope.globals.currentUser.username;
      } else {
        username = $stateParams.user;
      }
      $scope.tracks = [];
      var url = 'https://envirocar.org/api/stable/users/' + username +
        '/tracks?limit=1000';
      $http.get(url).then(function(data) {
        //$scope.totalTracks = data.data.tracks.length;
        console.log("filterhttp")
        console.log(data.data);
        var tracks = [];
        for (var i = 0; i < data.data.tracks.length; i++) {
          var track_helper = {};
          track_helper['TrackId'] = data.data.tracks[i].id;
          track_helper['Name'] = data.data.tracks[i].name;
          track_helper['Start'] = data.data.tracks[i].begin;
          track_helper['StartDateObject'] = new Date(data.data.tracks[i].begin)
            .getTime();
          track_helper['Vehicle'] = data.data.tracks[i].sensor.properties
            .model;
            if(vehiclesList[ data.data.tracks[i].sensor.properties.model] == undefined)
            {
              vehiclesList[data.data.tracks[i].sensor.properties.model] = 1;
            }
          track_helper['manufacturer'] = data.data.tracks[i].sensor.properties
            .manufacturer;
          track_helper['Distance'] = Number(data.data.tracks[i]['length'].toFixed(
            2));
          track_helper['url'] =
            "https://envirocar.org/api/stable/tracks/" + data.data.tracks[
              i].id + "/preview";
          track_helper['Modified'] = data.data.tracks[i].modified;
          var seconds_passed = new Date(data.data.tracks[i]
              .end).getTime() -
            new Date(data.data.tracks[i]
              .begin).getTime();
          track_helper['Duration'] = seconds_passed;

          var seconds = seconds_passed / 1000;
          var timeoftravel = seconds / 60;
          track_helper['DurationInMinutes'] = timeoftravel;
          // time of travel is in minutes
          // convert to the right format. of hh:mm:ss;
          date_for_seconds = new Date(null);
          date_for_seconds.setSeconds(seconds);
          date_hh_mm_ss = date_for_seconds.toISOString().substr(
            11, 8)
          track_helper['DurationString'] = date_hh_mm_ss;
          tracks.push(track_helper);
        }
        $scope.tracks = tracks;
        $scope.onload = false;
      })
      $scope.$watch('filterSelected', function() {
        //  $scope.filterOrig = $scope.filterSelected;
        console.log("chnages");
      })

      $scope.changeFilter = function(d) {
        $scope.filterSelected = d;
        if (d == "Start" || d == "Modified") {
          d == "Start" ? $scope.filterOrig = "-Start" : $scope.filterOrig =
            "-Modified";
        } else
          $scope.filterOrig = d;
        console.log($scope.filterOrig);
      }
    }
  ]);
