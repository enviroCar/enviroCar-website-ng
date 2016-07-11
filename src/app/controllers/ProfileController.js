angular.module('app')
  .controller("ProfileController", ['$rootScope', '$scope', '$http',
    'factorysingletrack',

    function($rootScope, $scope, $http, factorysingletrack) {
      $http.defaults.headers.common = {
        'X-User': $rootScope.globals.currentUser.username,
        'X-Token': $rootScope.globals.currentUser.authdata
      };
      $scope.name = $rootScope.globals.currentUser.username;
      $scope.firstName;
      $scope.lastName;
      $scope.emailId;
      $scope.country;
      $scope.countrytext;
      $scope.birthday;
      $scope.gendertext;
      $scope.gender = undefined;
      $scope.lang = undefined;
      $scope.langtext;
      $scope.oldpassword;
      $scope.newpassword;
      $scope.newpasswordrepeat;
      $scope.created;
      $scope.modified;
      $scope.termsOfUseVersion;
      $scope.badges = [];
      $scope.badgesTrue = false;
      url = "https://envirocar.org/api/stable/users/" + $rootScope.globals.currentUser
        .username;
      factorysingletrack.get(url).then(function(data) {
        $scope.created = new Date(data.data.created).toLocaleString().split(
          ',')[0];
        $scope.modified = new Date(data.data.modified).toLocaleString().split(
          ',')[0];
        $scope.termsOfUseVersion = (new Date(data.data.acceptedTermsOfUseVersion)
          .toLocaleString().split(',')[0]);

        console.log(data.data);
        if (data.data.firstName != undefined) {
          $scope.firstName = data.data.firstName;
        }
        if (data.data.lastName != undefined) {
          $scope.lastName = data.data.lastName;
        }
        if (data.data.gender != undefined) {
          $scope.gender = data.data.gender;
          if ($scope.gender == "m") {
            $scope.gendertext = "Male"
          } else {
            $scope.gendertext = "Female"
          }
        } else {
          $scope.gendertext = "NA"
        }
        if (data.data.country != undefined) {
          $scope.country = data.data.country;
          $scope.countrytext = data.data.country;
        } else {
          $scope.countrytext = "NA";
        }
        if (data.data.language != undefined) {
          $scope.lang = data.data.language.split('-')[0];
          if ($scope.lang == "en") {
            $scope.langtext = "English";
          } else if ($scope.lang == "de") {
            $scope.langtext = "German";
          }
        } else {
          $scope.langtext = "NA";
        }

        if (data.data.mail != undefined) {
          $scope.emailId = data.data.mail;
        }
        if (data.data.dayOfBirth != undefined) {
          $scope.birthday = data.data.dayOfBirth;
        }
        $scope.profilepic = url + "/avatar";
        if (data.data.badges != undefined) {
          $scope.badgesTrue = true;
          for (var i = 0; i < data.data.badges.length; i++) {
            var helper_obj = {};
            helper_obj['title'] = data.data.badges[i];
            if (data.data.badges[i] == "developer") {
              helper_obj['url'] =
                "assets\\images\\ic_code_black_48dp.png";
            } else if (data.data.badges[i] == "contributor") {
              helper_obj['url'] =
                "assets\\images\\ic_person_add_black_48dp.png";
            }
            $scope.badges.push(helper_obj);
          }
        }
      })
      $scope.myDate = new Date();
    }
  ])
