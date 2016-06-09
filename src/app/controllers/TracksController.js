angular.module('app')
.controller('TracksController',['$scope','$http','$rootScope','factorytrackslist', function($scope,$http,$rootScope,factorytrackslist){
    $http.defaults.headers.common = {'X-User': $rootScope.globals.currentUser.username, 'X-Token': $rootScope.globals.currentUser.authdata};
    // setting the headers for the request.
    $scope.urlredirect= '#/dashboard/chart/',
    $scope.total_count = 0;
    $scope.pageno = 1;
    $scope.itemsPerPage = 5;
    $scope.trackslist = [];
    $scope.show = true;
    url = "https://envirocar.org/api/stable/users/naveen-gsoc/tracks?";
    $scope.getData = function(pageno)
    {
      $scope.show = false;
      $scope.trackslist = [];
      $http.get(url + 'limit=' + $scope.itemsPerPage + '&' + 'page=' + pageno).success(function(data,status,headers,config){
        $scope.trackslist = data.tracks;
        for(var i = 0 ; i < $scope.trackslist.length ; i++)
        {
         $scope.trackslist[i]['urlredirect'] = $scope.urlredirect + $scope.trackslist[i]['id'];
         console.log();
        }
        console.log($scope.trackslist);
        var length = headers('Content-Range').split("/");
        $scope.total_count = Number(length[1]);
        console.log($scope.total_count);
      })
      $scope.show = true;
    }
    $scope.getData($scope.pageno);
}])

.factory('factorytrackslist', function($http){
  var get = function(url)
  {
    return $http.get(url)
    .success(function(data,status,headers,config){
      console.log(data);
      console.log(headers('Content-Range'));
      console.log(headers('Link'));
      var head = headers('Content-Range')
      head = String(head);
      console.log(head);
      return (data,status,head,config);
    })
    .error(function(data){
      console.log(data);
      return data;
    })
  }
  return {
    get: get
  }})
