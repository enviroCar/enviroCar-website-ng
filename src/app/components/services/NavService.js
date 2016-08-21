(function() {
  'use strict';

  angular.module('app')
    .service('navService', [
      '$q', '$translate',
      navService
    ]);

  function navService($q, $translate) {
    var dashboard;
    var tracks;
    var table;
    $translate(['DASHBOARD', 'TRACKS', 'TABLE']).then(function(translations) {
      dashboard = translations.DASHBAORD;
      tracks = translations.TRACKS;
      table = translations.TABLE;
    })
    //The menuitems that are populated on the side nav bar.
    var menuItems = [{
      name: 'Dashboard',
      icon: 'dashboard',
      sref: '#/dashboard/home'
    }, {
      name: 'Tracks',
      icon: 'directions_car',
      sref: '#/dashboard/tracks/'
    }, {
      name: 'Profile',
      icon: 'person',
      sref: '#/dashboard/table'
    }, {
      name: 'Segment',
      icon: 'pie_chart',
      sref:  '#/dashboard/segment'
    }];

    return {
      loadAllItems: function() {
        return $q.when(menuItems);
      }
    };
  }

})();
