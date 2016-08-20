(function() {

  angular
    .module('app')
    .controller('MainController', [
      'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state',
      '$mdToast', '$http', '$rootScope', '$translate', '$scope',
      MainController
    ]);

  function MainController(navService, $mdSidenav, $mdBottomSheet, $log, $q,
    $state, $mdToast, $http, $rootScope, $translate, $scope) {
    var vm = this;
    vm.lockLeft = false;

    $scope.showMobileMainHeader = true;
    $scope.openSideNavPanel = function() {
      $mdSidenav('left').open();
    };
    $scope.closeSideNavPanel = function() {
      $mdSidenav('left').toggle();
    };
    if (typeof $rootScope.globals.currentUser == 'undefined') {
      $rootScope.showlogout = false;
    } else {
      $rootScope.showlogout = true;
      $http.defaults.headers.common = {
        'X-User': $rootScope.globals.currentUser.username,
        'X-Token': $rootScope.globals.currentUser.authdata
      };
      vm.profilename = $rootScope.globals.currentUser.username;
      vm.url = "https://envirocar.org/api/stable/users/" + $rootScope.globals.currentUser.username + "/avatar";
      vm.about = "https://envirocar.org/api/stable/users/" + $rootScope.globals.currentUser.username;
      $http.get(vm.about).then(function(response) {
        // Get the email ID of the user.
        vm.email = response.data.mail;
      })
      $http.get(vm.url, {
        // Blob method which attempts to bypass the CORS issue faced by the http module. Still runs into CORS issue at the moment.$event
          responseType: 'arraybuffer'
        })
        .then(function(response) {
          var blob = new Blob(
            [response.data], {
              type: response.headers('Content-Type')
            }
          );
          vm.profilepic = URL.createObjectURL(blob);
        });

    }
    //Array of menu items.
    vm.menuItems = [];
    vm.selectItem = selectItem;
    vm.toggleItemsList = toggleItemsList;
    //vm.showActions = showActions;
    vm.title = $state.current.data.title;
    vm.showSimpleToast = showSimpleToast;
    vm.toggleRightSidebar = toggleRightSidebar;

    navService
      .loadAllItems()
      .then(function(menuItems) {
        //
        vm.menuItems = [].concat(menuItems);
        var dashboard;
        var tracks;
        var table;
        var segment;
        $translate(['DASHBOARD', 'TRACKS', 'TABLE', 'SPEEDARRAY','SEGMENT']).then(
          function(
            translations) {
            dashboard = translations.DASHBOARD;
            tracks = translations.TRACKS;
            table = translations.TABLE;
            segment  = translations.SEGMENT;
            // Translation for the menu items on the left side navigation bar.
            vm.menuItems[0]['name'] = dashboard;
            vm.menuItems[1]['name'] = tracks;
            vm.menuItems[2]['name'] = table;
            vm.menuItems[3]['name'] = segment;
          })
      });

    function toggleRightSidebar() {
      $mdSidenav('right').toggle();
    }

    function toggleItemsList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function() {
        $mdSidenav('left').toggle();
      });
    }

    function selectItem(item) {
      // A simple toast showing the page that has been clicked
      vm.title = item.name;
      vm.showSimpleToast(vm.title);
    }

    function showSimpleToast(title) {
      $mdToast.show(
        $mdToast.simple()
        .content(title)
        .hideDelay(2000)
        .position('bottom right')
      );
    }
  }

})();
