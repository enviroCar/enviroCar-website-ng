/*
    ProfileController: Handles all operations related to updating profile page.
    1) Displays user details
    2) Fills up form with old details of user
    3) Updates profile information after validations.
*/
angular.module('app')
  .controller("ProfileController", ['$rootScope', '$timeout', '$scope', '$http',
    'factorysingletrack',

    function($rootScope, $timeout, $scope, $http, factorysingletrack) {
      var passwordold;
      $scope.submissionSuccess = false;
      // Error message to be thrown when the submission is a failure
      $scope.submissionErrorMessage = "";
      $scope.submissionFailure = false;
      $scope.updateUserDetails = function() {
        $scope.submissionSuccess = false;
        $scope.submissionErrorMessage = "";
        $scope.submissionFailure = false;

        // The validation flags are used to keep track of the right error reason.
        var validationflag = true;
        var validationerror = 0;

        if ($scope.oldpassword != undefined && $scope.oldpassword != "") {
          if ($scope.newpassword == undefined || $scope.newpassword == "") {
            validationflag = false;
            validationerror = 0;
            // New password cannot be empty
          }
        }

        // validate if password and reentered password are same
        if ($scope.newpassword != undefined && $scope.newpassword != "") {
          if ($scope.oldpassword == undefined || $scope.oldpassword == "") {
            validationflag = false;
            validationerror = 1;
            // Old password field was empty but new password is trying to be set.
          }
          if ($scope.newpassword != $scope.newpasswordrepeat) {
            validationflag = false
            validationerror = 2;
            // New password is not matching with reentered newpassword.
          }
        }

        var dataput = {};

        if ($scope.firstName != undefined) {
          dataput['firstName'] = $scope.firstName;
        }
        if ($scope.emailId != undefined) {
          dataput['mail'] = $scope.emailId;
        }
        if ($scope.lastName != undefined) {
          dataput['lastName'] = $scope.lastName;
        }
        if ($scope.country != undefined) {
          dataput['country'] = $scope.country;
        }
        if ($scope.dateBirthdayPicker != undefined) {
          var stringDate = $scope.dateBirthdayPicker.getFullYear().toString() + '-' + ($scope.dateBirthdayPicker.getMonth()+1).toString() + '-' + $scope.dateBirthdayPicker.getDate().toString();
          console.log(stringDate);
          dataput['dayOfBirth'] = stringDate;
        }
        if ($scope.gender != undefined) {
          dataput['gender'] = $scope.gender;
        }
        if ($scope.newpassword != undefined && $scope.newpassword != "") {
          dataput['token'] = $scope.newpassword;
        }
        if ($scope.oldpassword != undefined) {
          passwordold = $scope.oldpassword;
        }
        if ($scope.langfull != undefined) {
          dataput['language'] = $scope.langfull;
        }
        var req = {
          method: 'PUT',
          url: "https://envirocar.org/api/stable/users/" + $rootScope.globals.currentUser.username,
          data: dataput
        }
        if (passwordold != undefined) {
          $http.defaults.headers.common = {
            'X-User': $rootScope.globals.currentUser.username,
            'X-Token': passwordold
          };
        }
        if (validationflag == true) {
          // If no client side validations failed.
          $http(req).then(function(resp) {
            $scope.submissionSuccess = true
            $timeout(function() {
              $scope.submissionSuccess = false;
            }, 2000);
            // Successfully changed profile.
            if ($scope.newpassword != undefined && $scope.newpassword != "") {
              $rootScope.globals.currentUser.authdata = $scope.newpassword;
            }
            getdata()
          }, function(err) {
            $scope.submissionErrorMessage = "Could not update profile";
            // Could not update profile.
            if (err.status == 403) {
              // please enter your exisiting password correctly.
              $scope.submissionErrorMessage = "Please enter the correct existing password"
            }
            $scope.submissionFailure = true;
          })
        } else {
          // If any of the client side validations failed
          if (validationerror == 1) {
            console.log("type in old password please")
            $scope.submissionErrorMessage =
              "Please enter your current password"
              // type in old password please
          } else if (validationerror == 2) {
            $scope.submissionErrorMessage =
              "Please re-enter your new password correctly."
              // reenter new password correctly.
          } else if (validationerror == 0) {
            $scope.submissionErrorMessage = "New password cannot be empty";
          }
          $scope.submissionFailure = true;

        }
      }
      $scope.ifpassword = false;

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
      $scope.langfull;
      $scope.langtext;
      $scope.oldpassword;
      $scope.newpassword;
      $scope.newpasswordrepeat;
      $scope.created;
      $scope.modified;
      $scope.termsOfUseVersion;
      $scope.badges = [];
      $scope.badgesTrue = false;
      $scope.dateBirthdayPicker = undefined;
      function getdata() {
        url = "https://envirocar.org/api/stable/users/" + $rootScope.globals.currentUser.username;
        factorysingletrack.get(url).then(function(data) {
          $scope.created = new Date(data.data.created).toLocaleString().split(',')[0];
          $scope.modified = new Date(data.data.modified).toLocaleString().split(',')[0];
          $scope.termsOfUseVersion = (new Date(data.data.acceptedTermsOfUseVersion).toLocaleString().split(',')[0]);

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
            $scope.langfull = data.data.language;
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
            // if date is defined, we process the date to select the appropriate date in the datepicker calendar
            $scope.birthday = data.data.dayOfBirth;
            var dateParse = data.data.dayOfBirth.split('-');
            $scope.dateBirthdayPicker = new Date(dateParse[0],dateParse[1]-1,dateParse[2]);
          }
          $scope.profilepic = url + "/avatar";
          if (data.data.badges != undefined) {
            // If the user has badges 
            $scope.badgesTrue = true;
            for (var i = 0; i < data.data.badges.length; i++) {
              var helper_obj = {};
              helper_obj['title'] = data.data.badges[i];
              if (data.data.badges[i] == "developer") {
                helper_obj['url'] = "assets\\images\\ic_code_black_48dp.png";
              } else if (data.data.badges[i] == "contributor") {
                helper_obj['url'] = "assets\\images\\ic_person_add_black_48dp.png";
              }
              $scope.badges.push(helper_obj);
            }
          }
        })
      }
      getdata();
      $scope.myDate = new Date();
    }
  ])
