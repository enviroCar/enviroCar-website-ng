'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .directive('stats',function() {
    	return {
  		templateUrl:'scripts/directives/dashboard/stats/stats.html',
  		restrict:'E',
  		replace:true,
  		scope: false

  	}
  });
/*  angular.module('sbAdminApp')
  .controller('statsnumberoftracksController',['$scope','$rootScope','requesthomestats',function($scope,$rootScope,requesthomestats)
{
    $scope.number = 17;
    $scope.type = 'comments';
    $scope.comments = 'neworder';
    var url = "https://envirocar.org/api/stable/users/";
    url = url + $rootScope.globals.currentUser.username + "/tracks";
    requesthomestats.get(url).then(function(data){
      console.log(data.data);
    })

}]);

angular.module('sbAdminApp')
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
*/
