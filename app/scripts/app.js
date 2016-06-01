'use strict';
/**
 * @ngdoc overview
 * @name enviroCarApp
 * @description
 * # enviroCarApp
 *
 * Main module of the application.
 */

angular
  .module('enviroCarApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngCookies',
    'nvd3',
    'leaflet-directive'
  ])
  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider','$cookieStoreProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider,$cookieStoreProvider) {

    $ocLazyLoadProvider.config({
      debug:true,
      events:true        });

    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'views/dashboard/main.html',
        authenticate: true,
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
                    name:'enviroCarApp',
                    files:[
                    'scripts/directives/header/header.js',
                    'scripts/directives/header/header-notification/header-notification.js',
                    'scripts/directives/sidebar/sidebar.js',
                    'bower_components/d3/d3.js',
                      'bower_components/nvd3/build/nv.d3.js',
                      'bower_components/nvd3/build/nv.d3.css',
                      'bower_components/angular-nvd3/dist/angular-nvd3.js',
                      'bower_components/leaflet/dist/leaflet.js',
                      'bower_components/leaflet/dist/leaflet.css',
                      'bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.js'
                    ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                }),
                $ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:['bower_components/angular-cookies/angular-cookies.js']
                }),
                $ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:['bower_components/angular-resource/angular-resource.js']
                }),
                $ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:['bower_components/angular-sanitize/angular-sanitize.js']
                }),
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:['bower_components/angular-touch/angular-touch.js']
                })


            }
        }
    })
      .state('dashboard.home',{
        url:'/home',
        controller: 'MainCtrl',
        templateUrl:'views/dashboard/home.html',
        authenticate: true,
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'enviroCarApp',
              files:[
              'scripts/controllers/main.js',
              'scripts/directives/timeline/timeline.js',
              'scripts/directives/notifications/notifications.js',
              'scripts/directives/chat/chat.js',
              'scripts/directives/dashboard/stats/stats.js'

              ]
            })
          }
        }
      })
      .state('dashboard.form',{
        templateUrl:'views/form.html',
        url:'/form'
    })
      .state('dashboard.blank',{
        templateUrl:'views/pages/blank.html',
        url:'/blank'
    })
      .state('login',{
        templateUrl:'views/pages/login.html',
        url:'/login',
        controller:'LoginCtrl',
        authenticate: false,
          resolve: {
            loadMyFile:function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name:'enviroCarApp',
                files:['scripts/controllers/LoginController.js']
              }),
              $ocLazyLoad.load(
              {
                 name:'toggle-switch',
                 files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                        "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                    ]
              }),
              $ocLazyLoad.load(
              {
                name:'ngAnimate',
                files:['bower_components/angular-animate/angular-animate.js']
              }),
              $ocLazyLoad.load(
              {
                name:'ngCookies',
                files:['bower_components/angular-cookies/angular-cookies.js']
              }),
              $ocLazyLoad.load(
              {
                name:'ngResource',
                files:['bower_components/angular-resource/angular-resource.js']
              }),
              $ocLazyLoad.load(
              {
                name:'ngSanitize',
                files:['bower_components/angular-sanitize/angular-sanitize.js']
              }),
              $ocLazyLoad.load(
              {
                name:'ngTouch',
                files:['bower_components/angular-touch/angular-touch.js']
              })
            }
          }

    })
      .state('dashboard.chart',{
      //  templateUrl:'views/chart.html',
        templateUrl:(stateParams) => {
        return 'views/chart.html?path='+stateParams.trackid},
        authenticate: true,
        url:'/chart/:trackid',
        controller:'ChartCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'enviroCarApp',
                files:['scripts/controllers/chartContoller.js']
            })
          }
        }
    })
      .state('dashboard.table',{
        templateUrl:'views/table.html',
        url:'/table'
    })
      .state('dashboard.panels-wells',{
          templateUrl:'views/pages/panels-wells.html',
          url:'/panels-wells'
      })
      .state('dashboard.buttons',{
        templateUrl:'views/ui-elements/buttons.html',
        url:'/buttons'
    })
      .state('dashboard.notifications',{
        templateUrl:'views/ui-elements/notifications.html',
        url:'/notifications'
    })
      .state('dashboard.typography',{
       templateUrl:'views/ui-elements/typography.html',
       url:'/typography'
   })
      .state('dashboard.icons',{
       templateUrl:'views/ui-elements/icons.html',
       url:'/icons'
   })
      .state('dashboard.error',{
       templateUrl:(stateParams) => {
       return 'views/error.html?path='+stateParams.path+'&status='+stateParams.status},
       url:'/errorpage/:path/:status',
       controller:'ErrorCtrl',
       resolve: {
         loadMyFile:function($ocLazyLoad) {
           return $ocLazyLoad.load({
               name:'enviroCarApp',
               files:['scripts/controllers/ErrorController.js']
           })
         }
       }
   })
  }])


    .run(['$rootScope', '$location','$state','$cookieStore','$http',function ($rootScope,$location,$state,$cookieStore,$http)
    {
      console.log("came in")
      $rootScope.globals = $cookieStore.get('globals') || {};
      if($rootScope.globals.currentUser)
      {
        $http.defaults.headers.common = {'X-User': $rootScope.globals.currentUser.username, 'X-Token': $rootScope.globals.currentUser.authdata};
      }
      $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        console.log("Came to scopechange");
        if(toState.authenticate && !$rootScope.globals.currentUser)
        {
          console.log("checking here");
          $state.transitionTo("login");
          event.preventDefault();
        }
      });
    }])
