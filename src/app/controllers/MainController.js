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
    console.log("In main Controller");
    var vm = this;
    vm.lockLeft = false;

    $scope.showMobileMainHeader = true;
    $scope.openSideNavPanel = function() {
      $mdSidenav('left').open();
    };
    $scope.closeSideNavPanel = function() {
      console.log("event fired for closing");
      $mdSidenav('left').toggle();
    };
    if (typeof $rootScope.globals.currentUser == 'undefined') {
      $rootScope.showlogout = false;
      //do nothing
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
          console.log("came here too");
          var blob = new Blob(
            [response.data], {
              type: response.headers('Content-Type')
            }
          );
          vm.profilepic = URL.createObjectURL(blob);
          console.log(vm.profilepic);
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
      console.log("fired here");
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function() {
        $mdSidenav('left').toggle();
      });
    }

    function selectItem(item) {
      vm.title = item.name;
    //  vm.toggleItemsList();
      vm.showSimpleToast(vm.title);
    }
/*
    function showActions($event) {
      $mdBottomSheet.show({
        parent: angular.element(document.getElementById('content')),
        templateUrl: 'app/views/partials/bottomSheet.html',
        controller: ['$mdBottomSheet', SheetController],
        controllerAs: "vm",
        bindToController: true,
        targetEvent: $event
      }).then(function(clickedItem) {
        clickedItem && $log.debug(clickedItem.name + ' clicked!');
      });

      function SheetController($mdBottomSheet) {
        var vm = this;

        vm.actions = [{
          name: 'Share',
          icon: 'share',
          url: 'https://twitter.com/intent/tweet?text=Angular%20Material%20Dashboard%20https://github.com/flatlogic/angular-material-dashboard%20via%20@flatlogicinc'
        }, {
          name: 'Star',
          icon: 'star',
          url: 'https://github.com/flatlogic/angular-material-dashboard/stargazers'
        }];

        vm.performAction = function(action) {
          $mdBottomSheet.hide(action);
        };
      }
    }*/

    function showSimpleToast(title) {
      console.log(title + "got shown");
      $mdToast.show(
        $mdToast.simple()
        .content(title)
        .hideDelay(2000)
        .position('bottom right')
      );
    }
  }

})();
