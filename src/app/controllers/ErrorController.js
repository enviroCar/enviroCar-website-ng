'use strict';
/**
 * @ngdoc function
 * @name enviroCarApp.controller:ErrorController
 * @description
 * # ErrorCtrl
 * Controller of the enviroCarApp
 */
angular.module('app')
  .controller('ErrorController',['$scope','$stateParams',function($scope,$stateParams) {
    $scope.params = $stateParams.path;
    console.log($stateParams.status + " IN ERROR CONTROLLER" );
    $scope.errorcodeparams = "The server returned a "+$stateParams.status + " error.";
    console.log($stateParams.path)
}]);
