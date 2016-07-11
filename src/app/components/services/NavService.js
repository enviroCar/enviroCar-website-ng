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
      console.log("came here to nav service");
    })
    var menuItems = [{
      name: 'Dashboard',
      icon: 'dashboard',
      sref: '.dashboard'
    }, {
      name: 'Tracks',
      icon: 'directions_car',
      sref: '.tracks'
    }, {
      name: 'Profile',
      icon: 'person',
      sref: '.table'
    }];
    console.log(menuItems);
    return {
      loadAllItems: function() {
        return $q.when(menuItems);
      }
    };
  }

})();
