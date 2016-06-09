angular.module('app')
.controller('FriendActivityController',['$scope','$http','$rootScope','$state',function($scope,$http,$rootScope,$state){

  console.log("Friend activity Fired");
  $scope.events = [];
  var eventshelper = []
  $scope.busy = false;
  $scope.page = 0;
  $scope.page_size = 5;
  $http.defaults.headers.common = {'X-User': $rootScope.globals.currentUser.username, 'X-Token': $rootScope.globals.currentUser.authdata};
  $scope.nextpage = function (){
    if($scope.page == 6) return;
    if($scope.busy) return;
    $scope.page++;
    $scope.busy = true;
    var url = "https://envirocar.org/api/stable/users/"+$rootScope.globals.currentUser.username+"/friendActivities?";
    $http.get(url+"limit="+$scope.page_size+"&page="+$scope.page).success(function(data,status,headers,config){
      for(var i = 0 ;i<data.activities.length ; i ++)
      {
        var helper = {};
        helper['time'] = data.activities[i].time;
        helper['name'] = data.activities[i].user.name;
        helper['profileurl'] = "https://envirocar.org/api/stable/users/"+helper['name']+"/avatar";
        console.log(helper['profileurl']);
        helper['date'] = new Date(data.activities[i].time).toLocaleString();
        console.log(i);
        console.log(data.activities[i]);

        if(data.activities[i].type == "FRIENDED_USER")
        {
          helper['type'] = 0;
          helper['topic'] = "New Friend Activity";
          if($rootScope.globals.currentUser.username != data.activities[i].other.name)
            helper['name'] = data.activities[i].user.name + " is now friends with "+ data.activities[i].other.name
          else
          helper['name'] = data.activities[i].user.name + " is now friends with you";
          helper['trackidlink'] = "";
        }
        else
        {
          helper['type'] = 1;
          console.log("came here");

          helper['topic'] = "New Track Upload";
          helper['trackidlink'] = data.activities[i].track.id
        }
        eventshelper.push(helper);
        console.log(helper);
      }
      console.log($scope.events);
      $scope.events = eventshelper
   })
    $scope.busy = false;
  }
  $scope.nextpage($scope.page);
  $scope.goToActivity = function (activity,trackid){
    if (activity == 1)
    {
      console.log(trackid);
      //redirect to the track analytics page.
      $state.go('home.chart',{'trackid':trackid});
    }
    console.log("fired");
  }
}])
