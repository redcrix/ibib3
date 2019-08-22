(function () {
    'use strict';
    projectCostByte.controller('LoginCtrl', loginCtrl);
    loginCtrl.$inject = ['$scope', '$state', '$http', '$window', 'Utils', 'CommonConstants','$ionicPlatform'];

    function loginCtrl($scope, $state, $http, $window,  Utils, CommonConstants,$ionicPlatform) {
        $scope.data = {};
        $scope.login_name = "Login";

        $scope.loginButtonClickHandler = function (form) {
          // alert('login btn clicked..')
            if (form.$valid) {
                $scope.data.uname = $scope.data.username ? $scope.data.username.toLowerCase() : '';
                $scope.progressing = true;
                $scope.login_name = "Logging in...";

                //  new login
                $http({
                    method: 'POST',
                    url: CommonConstants.REQUEST_BASE_URL_V1 + "loginv2",
                    data: {
                        "username": $scope.data.uname,
                        "password": $scope.data.password
                    }
                }).then(function successCallback(response) {
                    $scope.progressing = false;
                    localStorage.setItem('login',JSON.stringify($scope.data));
                    onLoginSuccess(response.data, Utils, $scope, $state);
                }, function errorCallback(response) {
                    console.log("error login");
                    $scope.progressing = false;
                    $scope.login_name = "Login";
                });
            }
        };

        $scope.hasLostInternetConnection = function () {
            if (window.Connection) {
                return navigator.connection.type == Connection.NONE;
            }
            return false;
        };

        $scope.forgotPw = function () {
            $state.go('forgotPw');
        };

        if (!$scope.hasLostInternetConnection()) {
            // alert(typeof Utils.getLocalValue('sessionId') !== 'undefined');
            // alert(Utils.getLocalValue('sessionId') !== undefined);
            // alert(Utils.getLocalValue('sessionId'));

            if (typeof Utils.getLocalValue('sessionId') === 'undefined') {
                if(Utils.getLocalValue('reload') === 1) {
                    $window.location.reload(true);
                    Utils.setLocalValue('reload',0);
                }
            } else {
              //  $state.go('app.dashboard.summary');
              if(devicePlatform !== 'unknown'){
                    $state.go('app.dashboard.summary');
               }else{
                    //show this for web view
                    $state.go('app.orgDashboard');
                }

            }
        }

        function onLoginSuccess(loginResponse, Utils, $scope, $state) {
            console.log('Inside login success');
            if (loginResponse["meta"].success === true) {
            //    checkForLatestBuildInPlayStore();
                saveSessionId(loginResponse, Utils);
                if(devicePlatform !== 'unknown'){
                    requestAndRegisterForPushNotifications(Utils);
                    $state.go('app.dashboard.summary');
                }else{
                    //show this for web view
                    $state.go('app.orgDashboard');
                }


            } else {
                $scope.loginError = true;
                $scope.login_name = "Login";
            }
        }
    }

    var isIPad = ionic.Platform.isIPad();
    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    var devicePlatform = isIPad || isIOS ? 'ios' : isAndroid ? 'android' : 'unknown';
    console.log("Device platform " + devicePlatform);
    console.log(window.location.hostname);
    // console.log(ionic.Platform);



    function checkForLatestBuildInPlayStore(){
        cordova.getAppVersion.getVersionNumber().then(function (version) {
            var local_version = version.split('.').join("");
           // var cloud_version = fetchVersionFromFireBase();

        });

    }

    function saveSessionId(loginResponse, Utils) {
        var userSession = _.find(loginResponse.businesses, ["selected", true]);
        Utils.setLocalValue('sessionId', userSession.session_id);

        // _.forEach(loginResponse.businesses,function(b,i){
        //     b.name = b.business_name;
        //     if(i+1 == loginResponse.businesses.length)
        //       Utils.setLocalValue('businesses', JSON.stringify(loginResponse.businesses));
        // });
        Utils.setLocalValue('businesses', JSON.stringify(loginResponse.businesses));
        console.log("Logged in");
    }

    function requestAndRegisterForPushNotifications(Utils) {
        console.log('Inside requestAndRegisterForPushNotifications');
        // requestForPushNotificationRegistration(Utils);
        registerForPushNotifications(Utils);
    }

    function requestForPushNotificationRegistration(Utils) {

        console.log(window);
        // window.FirebasePlugin.hasPermission(function (data) {
        //     console.log('FCM is enabled : ' + data.isEnabled);
        //     if (!data.isEnabled) {
        //         window.FirebasePlugin.grantPermission();
        //     }
        //
        //     saveFCMPushStatus(data.isEnabled === true);
        // });
        //
        // window.FirebasePlugin.getToken(function (token) {
        //     saveFCMToken(token, devicePlatform, Utils);
        // }, function (error) {
        //     console.error(error);
        // });
        //
        // window.FirebasePlugin.onTokenRefresh(function(token) {
        //     saveFCMToken(token, devicePlatform, Utils);
        // }, function(error) {
        //     console.error(error);
        // });

    }

    function registerForPushNotifications(Utils) {
        // window.FirebasePlugin.onNotificationOpen(function (notification) {
        //     console.log("Received push notification :: " + JSON.stringify(notification));
        //   //  $state.go('app.dashboard.summary');
        //     if(devicePlatform !== 'unknown'){
        //         $state.go('app.dashboard.summary');
        //     }else{
        //         //show this for web view
        //         $state.go('app.orgDashboard');
        //     }
        // }, function (error) {
        //     console.error(error);
        // });
    }

    function saveFCMToken(fcmToken, platform, Utils) {
        var oldFcmToken = Utils.getLocalValue('fcmToken');
        if(oldFcmToken !== fcmToken){
            console.log("Inside saveFCMToken. Updating fcmToken");
            Utils.setLocalValue('fcmToken', fcmToken);

            var deviceData = {
                "registrationId": fcmToken,
                "platform": platform
            };

            if (typeof oldFcmToken !== 'undefined' && oldFcmToken != '') {
                deviceData['oldRegistrationId'] = oldFcmToken;
            }

            var requestHeaders = {"isb-session-id": Utils.getLocalValue('sessionId')};
            var onSuccess = function (resp) {
                console.log("Inside saveFCMToken. Successfully saved token to server.");
                console.log(resp);
            };
            Utils.executeCostBytePostWebService('push_notification_register', deviceData, 'POST', onSuccess, requestHeaders);
        }
    }

    function saveFCMPushStatus(isFCMPushEnabled, Utils) {
        var fcmToken = Utils.getLocalValue('fcmToken');
        if (typeof fcmToken === 'undefined' || fcmToken === '') {
            return;
        }

        var isFCMPushEnabledStr = isFCMPushEnabled + '';
        console.log("isFCMPushEnabled :: " + isFCMPushEnabled);
        if(Utils.getLocalValue('isFCMPushEnabled') !== isFCMPushEnabledStr){
            Utils.setLocalValue('isFCMPushEnabled', isFCMPushEnabledStr);

            var data = {
                "registrationId": fcmToken,
                "isActive": isFCMPushEnabled
            };
            var requestHeaders = {"isb-session-id": Utils.getLocalValue('sessionId')};
            var onSuccess = function (resp) {
                console.log("Inside saveFCMPushStatus. Successfully saved registration status to server.");
                console.log(resp);
            };
            Utils.executeCostBytePostWebService('push_notification_update_registration_status', data, 'POST', onSuccess, requestHeaders);
        }
    }
})();
