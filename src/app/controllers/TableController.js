'use strict';
/**
 * @ngdoc function
 * @name enviroCarApp.controller:ErrorController
 * @description
 * # ErrorCtrl
 * Controller of the enviroCarApp
 */
angular.module('app')
  .controller('TableController',['$scope','$stateParams',function($scope,$stateParams) {
    $scope.events = [{
      badgeClass: 'info',
      badgeIconClass: 'glyphicon-check',
      title: 'First heading',
      content: 'Some awesome \n content.fejwefebfefejfb \nejfejfje fjefe \njhf ef ejfefjwbfbywfbew uhifouwf'
    }, {
      badgeClass: 'warning',
      badgeIconClass: 'glyphicon-credit-card',
      title: 'Second heading',
      content: 'More awesome content.'
    },
    {
      badgeClass: 'info',
      badgeIconClass: 'glyphicon-check',
      title: 'First heading',
      content: 'Some awesome content.'
    },
    {
      badgeClass: 'info',
      badgeIconClass: 'glyphicon-check',
      title: 'First heading',
      content: 'Some awesome content.'
    },
    {
      badgeClass: 'info',
      badgeIconClass: 'glyphicon-check',
      title: 'First heading',
      content: 'Some awesome content.'
    }];
}]);
