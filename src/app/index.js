'use strict';

angular.module('angularMaterialAdmin', ['ngAnimate', 'ngCookies',
  'ngSanitize', 'ui.router', 'ngMaterial', 'nvd3', 'pascalprecht.translate',
  'angular-timeline', 'infinite-scroll',
  'angularUtils.directives.dirPagination', 'angular-loading-bar',
  'leaflet-directive', 'angular.img', 'app'
])

.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider,
  $mdIconProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/views/login.html',
      controller: 'LoginController',
      data: {
        title: 'Login'
      },
      authenticate: false
    })
    .state('home', {
      url: '/dashboard',
      templateUrl: 'app/views/main.html',
      controller: 'MainController',
      controllerAs: 'vm',
      abstract: true,
      authenticate: true,
    })
    .state('home.dashboard', {
      url: '/home',
      templateUrl: 'app/views/dashboard.html',
      //  controller: 'DashboardController',
      data: {
        title: 'Dashboard'
      },
      authenticate: true
    })
    .state('home.tracks', {
      url: '/tracks',
      templateUrl: 'app/views/tracks.html',
      data: {
        title: 'Tracks'
      },
      authenticate: true
    })
    .state('home.table', {
      url: '/table',
      templateUrl: 'app/views/table.html',
      data: {
        title: 'Table'
      },
      authenticate: true
    })
    .state('home.chart', {
      url: '/chart/:trackid',
      //controller: 'ChartController',
      templateUrl: function(stateParams) {
        return 'app/views/chart.html?path=' + stateParams.trackid
      },
      authenticate: false,
      data: {
        title: 'Chart'
      }
    })
    .state('home.error', {
      templateUrl: function(stateParams) {
        return 'app/views/error.html?path=' + stateParams.path +
          '&status=' + stateParams.status
      },
      url: '/errorpage/:path/:status',
      authenticate: true,
    })

  $urlRouterProvider.otherwise('/dashboard/home');

  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue-grey', {
      'default': '800'
    })
    .accentPalette('green', {
      'default': '500'
    })
    .warnPalette('defaultPrimary');

  $mdThemingProvider.theme('dark', 'default')
    .primaryPalette('defaultPrimary')
    .dark();

  $mdThemingProvider.theme('blue', 'default')
    .primaryPalette('blue');

  $mdThemingProvider.theme('custom', 'default')
    .primaryPalette('defaultPrimary', {
      'hue-1': '50'
    });


  $mdThemingProvider.definePalette('defaultPrimary', {
    '50': '#FFFFFF',
    '100': 'rgb(255, 198, 197)',
    '200': '#E75753',
    '300': '#E75753',
    '400': '#E75753',
    '500': '#E75753',
    '600': '#E75753',
    '700': '#E75753',
    '800': '#084B8A',
    '900': '#E75753',
    'A100': '#E75753',
    'A200': '#E75753',
    'A400': '#E75753',
    'A700': '#E75753'
  });

  $mdIconProvider.icon('user', 'assets/images/user.svg', 64);
})

.run(['$rootScope', '$location', '$state', '$cookieStore', '$http', function(
  $rootScope, $location, $state, $cookieStore, $http) {
  console.log("came in")
  $rootScope.globals = $cookieStore.get('globals') || {};
  if ($rootScope.globals.currentUser) {
    $http.defaults.headers.common = {
      'X-User': $rootScope.globals.currentUser.username,
      'X-Token': $rootScope.globals.currentUser.authdata
    };
  }
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams,
    fromState, fromParams) {
    console.log("Came to scopechange");
    if (toState.authenticate && !$rootScope.globals.currentUser) {
      console.log("checking here");
      $state.transitionTo("login");
      event.preventDefault();
    }
  });
}])
