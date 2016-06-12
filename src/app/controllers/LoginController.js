 angular.module('app')
   .factory('Auth', ['$http', '$cookieStore', '$rootScope', function($http,
     $cookieStore, $rootScope) {
     var service = {};
     service.login = function(username, password, callback) {
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
         console.log("something postiive"); //first function "success"
         callback(responsetrue);
       }, function(err) { //second function "error"
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
         'X-User': " ",
         'X-Token': " "
       };
       console.log("current user" + $rootScope.globals.currentUser)
     };
     return service;
   }]);


 angular.module('app')
   .controller('LoginController', ['$scope', '$rootScope', '$location', 'Auth',
     function($scope, $rootScope, $location, Auth) {
       // clear credentials or tokens to reset the login status.
       console.log("Controller fired")
       console.log("refresh page is called")
       Auth.ClearCredentials();

       $scope.login = function() {
         $scope.dataLoading = true;
         Auth.login($scope.username, $scope.password, function(response) {
           if (response.success == true) {
             console.log("response is true")
             Auth.SetCredentials($scope.username, $scope.password);
             $location.path('/dashboard/home');
           } else {
             $scope.error = "Invalid Login Credentials";
             $scope.dataLoading = false;
           }
         });
       };
     }
   ]);
