(function() {

  angular
    .module('app')
    .controller('MainController', [
      'navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state',
      '$mdToast', '$http', '$rootScope',
      MainController
    ]);

  function MainController(navService, $mdSidenav, $mdBottomSheet, $log, $q,
    $state, $mdToast, $http, $rootScope) {
    var vm = this;
    if (typeof $rootScope.globals.currentUser == 'undefined') {
      console.log("the wrong place firing off on if");
      //do nothing
    } else {
      $http.defaults.headers.common = {
        'X-User': $rootScope.globals.currentUser.username,
        'X-Token': $rootScope.globals.currentUser.authdata
      };
      vm.profilename = $rootScope.globals.currentUser.username;
      vm.url = "https://envirocar.org/api/stable/users/" + $rootScope.globals
        .currentUser.username + "/avatar"
      console.log("came here");
      /*  $http.get(vm.url).success(function (response, location){
        console.log("got the second link");
        console.log(location);
        console.log(response);
      })
  */
      $http.get(vm.url, {
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
    vm.menuItems = [];
    vm.selectItem = selectItem;
    vm.toggleItemsList = toggleItemsList;
    vm.showActions = showActions;
    vm.title = $state.current.data.title;
    vm.showSimpleToast = showSimpleToast;
    vm.toggleRightSidebar = toggleRightSidebar;

    navService
      .loadAllItems()
      .then(function(menuItems) {
        vm.menuItems = [].concat(menuItems);
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
      vm.title = item.name;
      vm.toggleItemsList();
      vm.showSimpleToast(vm.title);
    }

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
