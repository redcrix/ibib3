var projectCostByte = angular.module('costbyte', ['ionic', '720kb.datepicker', 'chart.js', 'ionic-datepicker',  'jett.ionic.filter.bar', 'ngCordova', //                                                    'costbyte.copcontrollers',//costing optimizer controllers
    //                                                    'costbyte.copdirectives', //costing optimizer services
    //                                                    'costbyte.copfilters',//costing optimizer filters
    'costbyte.tmcontrollers', //task-manager controllers
    'costbyte.tmservices', //task-manager services
    //                                                    'checklist-model'
    'ionic-modal-select',
    // 'ion-gallery',
    // 'angular-stripe',
    'ion-floating-menu',
    'angularMoment',
    'ngMessages',
    // 'ionMdInput',
    'ngTouch',
    'chart.js',
   
  ])


  .config(function($ionicConfigProvider, Key, ChartJsProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.backButton.previousTitleText(false).text('');
    $ionicConfigProvider.scrolling.jsScrolling(true);
    // stripeProvider.setPublishableKey(Key.STRIPE_KEY);
    ChartJsProvider.setOptions({
      //   chartColors: ['#84D4EB', '#FF8A80', '#80b6ff', '#c980ff'],
      responsive: true
    });

  })

  .run(function($ionicPlatform, $ionicPopup, $timeout, $window, $interval, $ionicLoading, $state, $cordovaAppVersion, Utils) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      document.addEventListener("offline", onOffline, false);
      document.addEventListener("online", onOnline, false);
      var flag = 1;

      if (window.StatusBar) {
        StatusBar.hide();
        ionic.Platform.fullScreen();

      }

      // $rootScope.$watch(function() {
      //   return $cordovaKeyboard.isVisible();
      // }, function(value) {
      //   $rootScope.keyboardOpen = value;
      // });

      function onOnline() {
        //           console.log(flag);
        $ionicLoading.hide();
        if (flag === 0) {
          showMessage("<p class='connect'><span>Connected! Awesome</span></p>", "YES")
          //$timeout(function() { $window.location.reload(true) }, 2500);
          flag = 1;
        }
      }

      function onOffline() {
        if (!$state.includes('app.composeInventory')) {
          showMessage("<p class='disconnect'><span id='disconnect-text'>Oops! No Internet connection</span><ion-spinner icon='dots' class='spinner-light'></ion-spinner></p>", "NO");
          flag = 0;
        }

      }

      function showMessage(temp, addDuration) {
        var loadTemp = {
          template: temp,
          animation: "fade-in",
          showBackDrop: true
        }
        if (addDuration === "YES") {
          loadTemp.showDelay = 2000;
          loadTemp.duration = 2000;
        }
        $ionicLoading.show(loadTemp)
      }

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }


      // set if initial app run after update and destroy PouchDB of invoice uploads
      var clearPouchDbOnAppUpdatedRun = function() {
        $cordovaAppVersion.getVersionNumber().then(function(current_version) {
          var prev_version = $window.localStorage["appPreviousVersion"] || ""
          if (current_version != prev_version) {
            console.log('App version has changed or new install')
            var cameraDb = new PouchDB('invoice_camera').destroy().then(function(response) {
              // success
              console.log('destroyed invoice_camera pouchdb')
            }).catch(function(err) {
              console.log(err);
            });


          } else {
            console.log('App version has not changed. Not destroying pouchdb')
          }
          $window.localStorage["appPreviousVersion"] = current_version;
        })
      }
      // if(Utils.getLocalValue('platform'))
      clearPouchDbOnAppUpdatedRun();

    });
  })
