 angular.module('app')
   .factory('Auth', ['$http', '$cookieStore', '$rootScope', function($http,
     $cookieStore, $rootScope) {
     var service = {};
     service.login = function(username, password, callback) {
       // There is no separate endpoint to check whether the user's credentials are valid or not.
       // We use a call to statistics endpoint with the credentials to see if the user is authenticated ot not.
       var url = "https://envirocar.org/api/stable/users/";
       url = url + username + "/statistics";
       var responsetrue = {
         success: true
       };
       var responsefalse = {
         success: false
       }
       $http.defaults.headers.common = {
         'X-User': username,
         'X-Token': password
       };

       $http({
         url: url
       }).then(function(res) {
         // The user has been authenticated by the server
         callback(responsetrue);
       }, function(err) {
         // The user has not been authenticated by the server
         callback(responsefalse);
       });
     }
     service.SetCredentials = function(username, password) {
       $rootScope.globals = {
         currentUser: {
           username: username,
           authdata: password
         }
       };
       delete $http.defaults.headers.common["X-User"];
       delete $http.defaults.headers.common["X-Token"];
       $cookieStore.put('globals', $rootScope.globals);
     }

     service.ClearCredentials = function() {
       $rootScope.globals = {};
       $cookieStore.remove('globals');
       $http.defaults.headers.common = {
         'X-User': undefined,
         'X-Token': undefined
       };
     };
     return service;
   }]);


 angular.module('app')
   .controller('LoginController', ['$scope', '$rootScope', '$location', 'Auth',
     function($scope, $rootScope, $location, Auth) {
       // clear credentials or tokens to reset the login status.
       Auth.ClearCredentials();

       $scope.login = function() {
         $scope.dataLoading = true;
         Auth.login($scope.username, $scope.password, function(response) {
           if (response.success == true) {
             // When the right credentials are provided.
             Auth.SetCredentials($scope.username, $scope.password);
             if (typeof $rootScope.url_redirect_on_login != "undefined") {
               // Used to redirect the user to the single track page.
               // When a unlogged user accesses the single track page anonymously and then
               // goes through our login flow, the user will be redirected back to the single track page
               $location.path($rootScope.url_redirect_on_login);
             } else {
               // If the user logged in straight without visiting the single track page anonymously, then redirect to home.
               $location.path('/dashboard/home');
             }
           } else {
             // If wrong credentials are procided
             $scope.error = "Invalid Login Credentials";
             $scope.dataLoading = false;
           }
         });
       };
     }
   ]);
