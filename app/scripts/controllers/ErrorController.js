'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('ErrorCtrl',['$scope','$stateParams',function($scope,$stateParams) {
    $scope.params = $stateParams.path;
    console.log($stateParams.status + " IN ERROR CONTROLLER" );
    $scope.errorcodeparams = "The server returned a "+$stateParams.status + " error.";
    console.log($stateParams.path)
}]);
