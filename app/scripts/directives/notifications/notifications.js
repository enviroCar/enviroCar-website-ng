'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('enviroCarApp')
	.directive('notifications',function(){
		return {
        templateUrl:'scripts/directives/notifications/notifications.html',
        restrict: 'E',
        replace: true,
    	}
	});


