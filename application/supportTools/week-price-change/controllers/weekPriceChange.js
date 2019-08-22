(function() {
  projectCostByte.controller('weekPriceChangeCtrl', weekPriceChangeCtrl);

  weekPriceChangeCtrl.$inject = ['$q', '$scope', 'CommonService', '$timeout', '$ionicLoading', '$ionicFilterBar', '$ionicActionSheet', '$rootScope', 'supportToolService', '$ionicPopup'];

  function weekPriceChangeCtrl($q, $scope, CommonService, $timeout, $ionicLoading, $ionicFilterBar, $ionicActionSheet, $rootScope, supportToolService, $ionicPopup) {

    $scope.spinnerHide = false;
    $scope.current_selected = [];




    var toastMessage = function(message_text, duration) {
      if (typeof duration === 'undefined') duration = 2000;
      $ionicLoading.show({
        template: message_text,
        noBackdrop: true,
        duration: duration
      });
    };

    // get logged in user's email
    function getUserEmailId() {
      return $q(function(resolve, reject) {
        CommonService.getUserDefaullEmailId(function(emailIdData) {
          resolve(emailIdData.data.emailId);
        })
      })
    }
    getUserEmailId().then(function(userEmailId) {
      $scope.userEmailId = userEmailId;
    });


    // get login datas
    $scope.loginData = JSON.parse(localStorage.getItem('login'));
    // console.log($scope.loginData);
    $scope.current_selected = $scope.loginData;
    // console.log("$scope.current_selected",$scope.current_selected)
    // $scope.current_selected.businessName = $scope.loginData.businessName;

    // to catch response of api
    $scope.periodList = [];

    function periosResHandler(datas) {
      _.forEach(datas.periodList, function(period) {
        _.forEach(period.periodWeeks, function(tag) {
          if (tag.periodWeekTag.includes("WEEK"))
            $scope.periodList.push({
              'text': tag.periodWeekTag
            });
        });
      });
      // console.log($scope.periodList);
      $scope.loadData();
    }

    // service to fetch period list
    CommonService.pandLfetchPeriodWeeksWithData(periosResHandler);


    $scope.periodDetailSelection = function() {
      if (angular.isDefined($scope.periodList)) {
        var selectedPeriod = {};
        _.each($scope.periodList, function(p, pIndex) {
          // console.log(angular.isDefined($rootScope.globalSelectedPeriodNew),p);
          if (angular.isDefined($rootScope.globalSelectedPeriodNew) && p.text == $rootScope.globalSelectedPeriodNew.text) {
            p = $rootScope.globalSelectedPeriodNew;
            selectedPeriod = p;
          }
          else if (!angular.isDefined($rootScope.globalSelectedPeriodNew)) {
          // else {
            if ($scope.periodList.length == pIndex + 1) {
              p.selected = true
              $rootScope.globalSelectedPeriodNew = p;
              selectedPeriod = p;
            }
          }
        })
        // console.log('selectedPeriod: ',selectedPeriod);
        return selectedPeriod.text;
      }
      return ""
    }

    // to get selected tag from drop-down date range(period)
    $scope.filterbuttonclick = function(filterbuttonindex) {
      // console.log("filterbuttonclick")
      // $rootScope.invoiceData.searchText = '';
      // $scope.spinnerHide = false;
      _.each($scope.filterButtons, function(button, index) {
        if (index === filterbuttonindex) {
          $rootScope.globalSelectedPeriodNewIndex = index;
          button.selected = true;
        } else {
          button.selected = false;
        }
      });
      // console.log("calling filterbuttonclick year, period, index: ", $rootScope.globalSelectedPeriodNew, $rootScope.globalSelectedPeriodNewIndex);
      // scope.$emit('GETINVOICEFORPERIOD', scope.filterButtons[filterbuttonindex].periodWeekTag)
      // scope.$emit('GETINVOICEFORPERIODConfigSummary', scope.filterButtons[filterbuttonindex].periodWeekTag)
    };

    // get label to display selected date range
    var setWeeksFilterButtons = function(periodItem) {
      return $q(function(resolve, reject) {
        // console.log("scope.periodList in setWeeksFilterButtons is : ", scope.periodList);
        if (angular.isDefined($scope.periodList)) {
          let periodItem = _.find($scope.periodList, ['selected', true]);
          let buttons = _.transform(periodItem.periodWeeks, function(result, periodWeek, index) {
            periodWeek.style = '';
            result.push(periodWeek)
          });
          let selectedWeekButton = _.findIndex(buttons, ['selected', true]);
          // console.log("$rootScope.globalSelectedPeriodNewIndex in setWeeksFilterButtons : ", $rootScope.globalSelectedPeriodNewIndex);
          if (angular.isDefined($rootScope.globalSelectedPeriodNewIndex)) {
            selectedWeekButton = $rootScope.globalSelectedPeriodNewIndex
          } else if (selectedWeekButton === -1) {
            selectedWeekButton = 0;
            $rootScope.globalSelectedPeriodNewIndex = selectedWeekButton;
          }
          $scope.filterButtons = buttons;
          // console.log("scope.filterButtons in setWeeksFilterButtons is : ", scope.filterButtons);
          $scope.filterbuttonclick(selectedWeekButton);
          resolve(true)
        }

      })

    };

    //  to get list of periods for date range drop-down
    $scope.showPeriod = function() {
      // if ($scope.periodSelection === 'Period') {
      var hideSheet = $ionicActionSheet.show({
        buttons: $scope.periodList,
        titleText: '<h4><center>Select Period</center></h4>',
        cancelText: 'Cancel',
        cancel: function() {},
        buttonClicked: function(index) {
          _.each($scope.periodList, function(p, pIndex) {
            if (index === pIndex) {
              p.selected = true;
              $rootScope.globalSelectedPeriodNew = p;
              $rootScope.globalSelectedPeriodNewIndex = undefined;
              $timeout(setWeeksFilterButtons, 1);
            } else {
              p.selected = false;
            }
          });
          return true;
        }
      });
      // }
      var myEl = angular.element(document.querySelector('.action-sheet-group'));
      myEl.css('overflow-y', 'scroll');
      myEl.css('max-height', (window.innerHeight - 95) + 'px');
      // myEl.css('max-width', (window.innerWidth - 120) + 'px');
    };

    // set table header datas
    $scope.tblHeader = [{
        'name': 'InvItemId'
      },
      {
        'name': 'InvItemName'
      },
      {
        'name': 'PriceChange'
      },
      {
        'name': 'DollarImpact'
      },
      {
        'name': '30DayUsage'
      },
      {
        'name': 'ReportingUnit'
      },
      {
        'name': 'ReportingPrice'
      },
      {
        'name': 'InvPrice_PW'
      },
      {
        'name': 'InvUnit_PW'
      },
      {
        'name': 'InvDate_PW'
      },
      {
        'name': 'SuppName_PW'
      },
      {
        'name': 'InvPrice_CW'
      },
      {
        'name': 'InvUnit_CW'
      },
      {
        'name': 'InvDate_CW'
      },
      {
        'name': 'SuppName_CW'
      },
    ];


    // set table row datas
    $scope.tblDatas = [{
        'InvItemId': 'inv101',
        'InvItemName': 'testAbc',
        'PriceChange': '2',
        'DollarImpact': '1',
        'usage': '5',
        'ReportingUnit': 'abc',
        'ReportingPrice': '3',
        'InvPrice_PW': '5',
        'InvUnit_PW': 'yudd',
        'InvDate_PW': '1323',
        'SuppName_PW': 'sdfdsf',
        'InvPrice_CW': '45',
        'InvUnit_CW': 'gdgg',
        'InvDate_CW': '34335435',
        'SuppName_CW': 'rthrth',
      },
      {
        'InvItemId': 'inv102',
        'InvItemName': 'testAbc',
        'PriceChange': '2',
        'DollarImpact': '1',
        'usage': '5',
        'ReportingUnit': 'abc',
        'ReportingPrice': '3',
        'InvPrice_PW': '5',
        'InvUnit_PW': 'yudd',
        'InvDate_PW': '1323',
        'SuppName_PW': 'sdfdsf',
        'InvPrice_CW': '45',
        'InvUnit_CW': 'gdgg',
        'InvDate_CW': '34335435',
        'SuppName_CW': 'rthrth',
      },
      {
        'InvItemId': 'inv103',
        'InvItemName': 'testAbc',
        'PriceChange': '2',
        'DollarImpact': '1',
        'usage': '5',
        'ReportingUnit': 'abc',
        'ReportingPrice': '3',
        'InvPrice_PW': '5',
        'InvUnit_PW': 'yudd',
        'InvDate_PW': '1323',
        'SuppName_PW': 'sdfdsf',
        'InvPrice_CW': '45',
        'InvUnit_CW': 'gdgg',
        'InvDate_CW': '34335435',
        'SuppName_CW': 'rthrth',
      },
    ];
    // // to catch business list response
    // function resBusiness(biz){
    //   console.log(biz);
    // }


    // to get all business
    $scope.businessList = [];
    supportToolService.fetchAllBusiness($scope.loginData)
      .then(function(biz) {
        $scope.businessList = biz.items;
      });


    // to catch value of business drop-dropdown
    $scope.shoutLoud = function(newValue, oldValue) {
      $scope.current_selected = newValue;
    };

    // to open business drop-down
    $scope.setBusiness = function(item, type, index) {
      angular.element(document.querySelectorAll('#my_biz')).triggerHandler('click');
    }

    // get datas for selected business and period
    $scope.loadData = function() {
      $scope.spinnerHide = false;
      let sendDatas = {
        'dateRange_1': $scope.periodDetailSelection(),
        'businessId': $scope.current_selected.businessId,
        'storeId': $scope.current_selected.businessStoreId ? $scope.current_selected.businessStoreId : 0
      }
      supportToolService.fetchPriceTrackData(sendDatas)
        .then(function(datas) {
          $scope.spinnerHide = true;
          $scope.tblDatas = datas.items.items[0];
        });
    }


    // open export popup
    $scope.openPrompt = function() {

      $scope.emailData = {};
      $scope.emailData.userEmailId = $scope.userEmailId;
      $scope.emailData.userEmailIdNew = "";
      $scope.confirmPopup = $ionicPopup.show({
        scope: $scope,
        template: `<form name="nw" novalidate><div class="smaller">
                                  <input type="email" name="email" placeholder="{{ emailData.userEmailId }}" ng-model="emailData.userEmailIdNew" required/>
                               <p ng-if="showError" class="errror" style="color:red">Please enter a Valid E-mail id.</p>
                              <span style="color:red" ng-show="nw.email.$dirty && nw.email.$invalid">
                              <span ng-show="nw.email.$error.email">Invalid email address.</span>
                               </span>
                               </div>
                               </form>`,
        title: 'Export data',
        subTitle: 'Enter alternate email id',
        cssClass: 'text-center popup-export',
        attr: 'ng-disabled="!emailData.userEmailIdNew"',
        buttons: [{
            text: 'Cancel'
          },
          {
            text: '<b>Send</b>',
            type: 'button-bal',
            onTap: function(e) {
              var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
              $scope.emailData.userEmailId = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : $scope.emailData.userEmailIdNew;
              $scope.emailData.userEmailIdNew = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : $scope.emailData.userEmailIdNew;
              $scope.emailData.userEmailId = !$scope.emailData.userEmailIdNew ? $scope.emailData.userEmailId : (pattern.test($scope.emailData.userEmailIdNew) ? $scope.emailData.userEmailIdNew : $scope.emailData.userEmailId);
              $scope.emailData.userEmailIdNew = $scope.emailData.userEmailId;
              if (!$scope.emailData.userEmailId) {
                toastMessage("Email is required");
              } else if (!pattern.test($scope.emailData.userEmailId)) {
                toastMessage("Please Enter Valid Email");
              } else {
                // console.log($scope.emailData.userEmailId);
                //
                let datas = {
                  'dateRange': $scope.periodDetailSelection(),
                  'email': $scope.emailData.userEmailId,
                  'bId' : $scope.current_selected.businessId,
                  'storeId' : $scope.current_selected.businessStoreId
                }
                supportToolService.sendWeeklyPriceChangeData(datas)
                  .then(function(email) {
                    // console.log(email);
                    if(email.success)
                      toastMessage("<span style='position: relative;bottom: 20px;'>Weekly Price Change export request sent! </br> You will be receiving email shortly.</span>");
                    // $scope.businessList = biz.items;
                  });
                // CommonService.exportInvoice($scope.exportInvoiceRes, $scope.dateRange, $scope.emailData.userEmailId);
              }

            }
          }
        ]
      });
    };


  }
})();
