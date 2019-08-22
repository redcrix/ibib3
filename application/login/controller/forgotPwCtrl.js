(function() {
    'use strict';


    projectCostByte.controller('forgotPwCtrl', forgotPwCtrl);
    forgotPwCtrl.$inject = ['$scope', '$state', '$http', 'Utils', 'CommonConstants','$ionicModal','$ionicSlideBoxDelegate','$timeout','$ionicPopup','$window'];

    function forgotPwCtrl($scope, $state, $http, Utils, CommonConstants,$ionicModal,$ionicSlideBoxDelegate,$timeout,$ionicPopup,$window) {

        console.log($ionicSlideBoxDelegate)

        $timeout(function() {
         return $ionicSlideBoxDelegate.enableSlide(false);
        }, 1);


      //  $scope.navBarTitle.showToggleButton = false;
        $scope.reset = {
            'userEmail': '',
            'code': '',
            'password': '',
            'confirmPassword': ''
        };
        $scope.sendCode = function(code) {
            localStorage.setItem("code",code)
            console.log($scope.userName)
            $scope.optCode =  code;

            $http({
                method: 'GET',
                 url: CommonConstants.REQUEST_BASE_URL_V1 + "validate_otp_forgot_password?user_name="+$scope.userName+"&&otp_value="+code,
            //    url: "https://subbu-dot-isb-alpha.appspot.com/_ah/api/pepr/v1/validate_otp_forgot_password?user_name="+$scope.userName+"&&otp_value="+code,
                /*data: {
                    "user_name": $scope.userName,
                    "otp_value": code,
                } */
            }).then(function successCallback(response) {
                console.log(response);
                console.log(response.data.status)
                if(response.data.status){
                    console.log('Valid OTP');
                    $state.go('setPassword');
                }
                else{
                    console.log('Invalid Otp');
                var myPopup = $ionicPopup.show({
                   title: 'Invalid OTP',
                    subTitle: 'Please Enter a Valid OTP',
                      scope: $scope,
                    buttons: [
                      {
                       text: '<b>Close</b>',
                         type: 'button-positive',
                         },
                             ]
                           });

                }
            })

            //$state.go('setPassword');
        }

        $scope.setPassword = function(password) {
            //console.log($scope.userName,$scope.optCode,password)
            console.log(localStorage.getItem("username"),localStorage.getItem("code"))

            $http({
                    method: 'POST',
                    url: CommonConstants.REQUEST_BASE_URL_V1 + "reset_password_forgot_password",
                   // url: "https://subbu-dot-isb-alpha.appspot.com/_ah/api/pepr/v1/reset_password_forgot_password",
                    data: {
                        "user_name": localStorage.getItem("username"),
                        "otp_value": localStorage.getItem("code"),
                        "new_pwd": password
                    }
                }).then(function successCallback(response) {
                   // console.log(response)
                      if(response.data.status){
                          console.log('password matched');
                         $state.go('login');
                      } else{
                          console.log('password did not match');
                          var myPopup = $ionicPopup.show({
                             title: 'password mismatch',
                              subTitle: 'Something wrong! Password not updated.',
                                scope: $scope,
                              buttons: [
                              {
                                 text: '<b>Close</b>',
                                 type: 'button-positive',
                                },
                                ]
                          });

                      }
                    }, function errorCallback(response) {
                        console.log("error login",response);
                });

        }



        $scope.matchPw = function(newPw, confirmPw) {
            console.log(newPw, confirmPw);
        }
        $scope.codePage = function(userName){
            localStorage.setItem("username",userName)
            $scope.userName = userName;
            console.log('codePage ------------------',userName);

            $http({
                    method: 'GET',
                url: CommonConstants.REQUEST_BASE_URL_V1 + "generate_otp_forgot_password?user_name="+(userName).toLowerCase(),
                   // url: "https://subbu-dot-isb-alpha.appspot.com/_ah/api/pepr/v1/generate_otp_forgot_password?user_name="+userName,
                    /*data: {
                        "username": $scope.data.uname,
                        "password": $scope.data.password
                    }*/
                }).then(function successCallback(response) {
                    // console.log(response);
                    console.log(response.data.status)
                    if (!response.data.status) {
                        console.log('enteredloop')
                         var myPopup = $ionicPopup.show({
                            title: 'E-mail Not Found',
                             subTitle: 'Please Contact Our Support Team',
                             scope: $scope,
                             buttons: [
                                 {
                                 text: '<b>Close</b>',
                                 type: 'button-positive',
                                },
                             ]
                           });
                 }
                 else{
                    // console.log('user is valid',response)
                    $scope.emailId = response.data.email_id;
                    console.log($scope.emailId)
                    $ionicSlideBoxDelegate.slide(1, 150);
                 }
                }, function errorCallback(response) {
                    console.log("error login");

                });
        }
       /* $scope.resetPassword = function(){
                  console.log('ResetPage ------------------')
                 $ionicSlideBoxDelegate.slide(1, 150);
        }*/

        /*$scope.forgotPwClickHandler = function (form) {

            //if (form.$valid) {
                $scope.data.uname = $scope.data.username ? $scope.data.username.toLowerCase() : '';
                $scope.progressing = true;
                $scope.login_name = "Logging in...";
            //}
        };*/
        $scope.validateCodeHandler = function (form) {
                if(form.$valid){
                //$scope.data.code = $scope.data.otp ?;

                //validate otp
                $http({
                method: 'POST',
                url: CommonConstants.REQUEST_BASE_URL_V1 + "generate"
                })

                }
        }
    }
    projectCostByte.directive('passwordConfirm', ['$parse', function($parse) {
        return {
            restrict: 'A',
            scope: {
                matchTarget: '=',
            },
            require: 'ngModel',
            link: function link(scope, elem, attrs, ctrl) {
                var validator = function(value) {
                    ctrl.$setValidity('match', value === scope.matchTarget);
                    return value;
                }

                ctrl.$parsers.unshift(validator);
                ctrl.$formatters.push(validator);

                // This is to force validator when the original password gets changed
                scope.$watch('matchTarget', function(newval, oldval) {
                    validator(ctrl.$viewValue);
                });

            }
        };
    }]);

    projectCostByte.directive('nxEqualEx', function() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.nxEqualEx) {
                console.error('nxEqualEx expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.nxEqualEx, function (value) {
                // Only compare values if the second ctrl has a value.
                if (model.$viewValue !== undefined && model.$viewValue !== '') {
                    model.$setValidity('nxEqualEx', value === model.$viewValue);
                }
            });
            model.$parsers.push(function (value) {
                // Mute the nxEqual error if the second ctrl is empty.
                if (value === undefined || value === '') {
                    model.$setValidity('nxEqualEx', true);
                    return value;
                }
                var isValid = value === scope.$eval(attrs.nxEqualEx);
                model.$setValidity('nxEqualEx', isValid);
                return isValid ? value : undefined;
            });
        }
    };
});


})();
