(function() {
  projectCostByte.controller('invoiceEntryCtrl', invoiceEntryCtrl);

  invoiceEntryCtrl.$inject = ['$q', '$http', '$ionicModal', '$scope', 'CommonService', '$timeout', '$ionicLoading', '$ionicFilterBar', '$ionicActionSheet', '$rootScope', 'supportToolService', '$ionicPopup', '$ionicHistory', '$window', 'CommonConstants'];

  function invoiceEntryCtrl($q, $http, $ionicModal , $scope, CommonService, $timeout, $ionicLoading, $ionicFilterBar, $ionicActionSheet, $rootScope, supportToolService, $ionicPopup, $ionicHistory, $window, CommonConstants) {


    

    $scope.spinnerHide = true;
    $scope.current_selected = [];
    $scope.current_selected_form = [];
    $scope.navBarTitle = true;
    $scope.tableshow = false;
    $scope.MinusShow = false;
    $scope.PlusShow = true;
    $scope.date;
    $scope.currentDate = new Date();
    $scope.inputs = [{},{},{},{},{},{},{},{}];
    $scope.unitPrice;
    $scope.extenPrice;
    $scope.Total_desc;
    $scope.Total_execution_Prices;
    $scope.summed_desc = 0;
    $scope.summed_TAX = 0;
    $scope.summed_DEPOSIT = 0;
    $scope.invoiceLevel_dis = "";
    $scope.Total_deposit;
    $scope.Total_Tax;
    $scope.itemQ;
    $scope.Table_Collection = [];
    $scope.Table_Collection2 = {};
    $scope.arr=[];
    $scope.extendedPrice;
    $scope.supplier_id_sel;
    $scope.buiss_id_sel;
    $scope.savedDRAFT;
    $scope.current_selected_form.NetUnit = $scope.current_selected_form.unitPrice ;
    $scope.current_selected_form.invoiceNo = '';
    $scope.datePickerCallback = function (val) {

      console.log('callback');

    if(typeof(val)==='undefined'){	
    console.log('Date not selected');
    }
    else
    {
    console.log('Selected date is : ', val);
    }
    };

  


    $scope.getTotal = function(value) {
     
      angular.forEach(value, function(value) { 
  
        return value.param6 * $scope.unitPrice;
      });

    }

    // $scope.getMySumW = function() {
     
    // };

    $scope.sumTotalDiscount = function(list) {
      var total=0;
      $scope.Total_desc = 0;
      angular.forEach(list , function(item){
        total+= item.param2;
      });

      $scope.Total_desc = total;
      return total;
     }


     $scope.sumTotalTax = function(list) {
      var total=0;
      $scope.Total_Tax = 0;
      angular.forEach(list , function(item){
        total+= item.param4;
      });

      $scope.Total_Tax = total;
      return total;
     }

     $scope.sumTotalEXC_PRICE = function(list) {
      $scope.Total_execution_Prices = 0;
      var total=0;
      angular.forEach(list , function(item){
        total+= item.exPricesN;
      });

      $scope.Total_execution_Prices = total;
      return total;
     }
     

    //  $scope.Summed_discount = function(list) {
    //   var total=0;
    //   total+= item.param2;

    //   $scope.Total_desc = total;
    //   return total;
    //  }

  // calculating discount, taxes, deposits, fuel
  
     $scope.Summed_discount = function (value) {
      $scope.summed_desc = 0;
      var a = Number(value || 0);
      var b = Number($scope.Total_desc || 0);
      $scope.summed_desc = a+b;

    }

    $scope.Summed_TAXES = function (value) {
      $scope.summed_TAX = 0;
      var a = Number(value || 0);
      var b = Number($scope.Total_Tax || 0);
      $scope.summed_TAX = a+b;

    }

    $scope.Summed_DEPOSITS = function (value) {
      $scope.summed_DEPOSIT = 0;
      var a = Number(value || 0);
      var b = Number($scope.Total_deposit || 0);
      $scope.summed_DEPOSIT = a+b;

    }




    // $scope.onChange = function(value){
    //   value.exPrice = parseInt(value.param1 - value.param2 + value.param3 + value.param4 + value.param5 );
    //   // console.log('DEBUGGER NOW = '+value.exPrice);
    //   getTotalN();
    // }


  
 

     $scope.sumTotalDeposit = function(list) {
      var total=0;
      angular.forEach(list , function(item){
        total+= item.param3;
      });

      $scope.Total_deposit = total;
      return total;
     }

     $scope.sumTotalTax = function(list) {
      var total=0;
      $scope.Total_Tax = '';
      angular.forEach(list , function(item){
        total+= item.param4;
      });
      
      $scope.Total_Tax = total;
      return total;
     }

     $scope.sumUnitPrice = function(list) {
      var total=0;
      angular.forEach(list , function(value){
        total += value.param1 - value.param2 + value.param3 + value.param4 + value.param5;
        $scope.unitPrice = total;

      });
      return total;
     }

     $scope.sumExtenPrice = function(list) {

      var total=0;
      angular.forEach(list , function(item){
        total+= item.param6;
      });

      $scope.extenPrice = total;
      return total;

     }


     $scope.onChange = function(value){
      value.exPrice = parseInt(value.param1 - value.param2 + value.param3 + value.param4 + value.param5 );
      // console.log('DEBUGGER NOW = '+value.exPrice);
      getTotalN();
    }

    function getTotalN(){
      var tot=0;
      for (var i = 0; i < $scope.inputs.length; i++) {
        tot = tot + $scope.inputs[i].exPrices;
      }
      // console.log('DEBUGGER AGAIN == = == = = '+tot);
    
    }

    $scope.onChangeNE = function(value){
      value.exPricesN = parseInt(value.param6*value.exPrice);
      // console.log('DEBUGGER NOW == = == = = '+value.exPricesN);
      getTotalNN();
    }

    function getTotalNN(){
      var tot=0;
      for (var i = 0; i < $scope.inputs.length; i++) {
        tot = tot + $scope.inputs[i].exPricesN;
      }
      // console.log('DEBUGGER 2nd time AGAIN == = == = = '+tot);
    
    }




    $scope.$watch('current_selected_form.orderDate', function (value) {
      try {
       liveDate = new Date(value);
      } catch(e) {}
   
      if (!liveDate) {
   
        $scope.error = "This is not a valid date";
      } else {
        $scope.error = false;
      }
    });

  

    $scope.addfield=function(){

      $scope.inputs.push({});
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModalNEW = function() {
      $scope.modal.hide();

      $timeout(function() {
         myPopup.close(); //close the popup after 3 seconds for some reason
      }, 3000);
    };
    // //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    $scope.ResetFields = function() {
      $scope.data = {}
    
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        title: 'Are you sure you want to clear all fileds withot saving?',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Reset</b>',
            type: 'button-bal',
            onTap: function(e) {
              $scope.current_selected_form = [];
              $scope.inputs = [{},{},{},{},{},{},{},{}];
            }
          }
        ]
      });
      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
      $timeout(function() {
         myPopup.close(); //close the popup after 3 seconds for some reason
      }, 3000);
     };

 



    $scope.saveDraft = function() {
      // console.log('text ===='+$scope.current_selected_form.invoiceNo);
      // console.log('number ===='+$scope.current_selected_form.totalinvoiceNo);
      // console.log('orderDate ===='+$scope.current_selected_form.orderDate);
      // console.log('deliveryDate ===='+$scope.current_selected_form.deliveryDate);
      // console.log('dueDate ===='+$scope.current_selected_form.dueDate);
      // console.log('bussNameSelected ===='+JSON.stringify($scope.current_selected.bussNameSelected));
      // console.log('supplierNameSelected ===='+JSON.stringify($scope.current_selected.supplierNameSelected));
      // console.log('pictureLink ===='+JSON.stringify($scope.current_selected_form.pictureLink));

      // console.log('UNIT PRICE ===='+$scope.unitPrice);


      // console.log('DEBUG 0 ===='+$scope.inputs);

      angular.forEach($scope.inputs, function(value) { 
        $scope.Table_Collection = [];
       
       for (var i = 0; i < $scope.inputs.length; i++) {

        console.log($scope.inputs[i].ItemUnit);
        console.log($scope.inputs[i].billingUnit);
       
        if ($scope.inputs[i].param2) { 
            $scope.Table_Collection.push({
              
           
              "bId" :"E3A5C2FD",
              "storeId" : $scope.buiss_id_sel,  // businessStoreId
              "date" : $scope.current_selected_form.orderDate, //order date
              "globalIngredientId" : '', // ''
              "supplierId" : $scope.supplier_id_sel, // supplier_id
              "supplierName" :$scope.current_selected.supplierNameSelected, // supplier_name/ 
              "supplierInvoiceId" : $scope.current_selected_form.invoiceNo, //invoice No(TEXT)
              "supplierItemId" : $scope.inputs[i].InvoiceNumber, //item_number

              // TXT
              "supplierItemName" : $scope.inputs[i].itemDescription,  // item_desc

              "itemMeasurementId" :$scope.inputs[i].ItemUnit,
              "itemBillingMeasurementId" : $scope.inputs[i].billingUnit,

              // all 3 same
              "supplierItemQuantity" : $scope.inputs[i].param6, //item_qty
              "supplierItemPackQuantity" : $scope.inputs[i].param6,  //item_qty
              "supplierItemPackSize" : $scope.inputs[i].param6,  //item_qty

              "supplierItemPrice" : $scope.inputs[i].param1, //unit_price
              "supplierItemExtendedPrice" : $scope.inputs[i].exPricesN , //same
              "discount" : $scope.inputs[i].param2,
              "deposit" : $scope.inputs[i].param3,
              "tax1" : $scope.inputs[i].param4,
              "tax2" :$scope.inputs[i].param5,
              "netUnitPrice" :$scope.inputs[i].exPrice, //netUnitPrice

              // verify
              "billingUnits" : $scope.inputs[i].billingUnit, // billing

              "invoiceLink" :$scope.current_selected_form.pictureLink, // 
            

      
            });
        }
    }

   
    // console.log('==DEBUG 1 == '+JSON.stringify($scope.Table_Collection));
    filtered = $scope.Table_Collection.filter(function (a) {
      var temp = Object.keys(a).map(function (k) { return a[k]; }),
          k = temp.join('|');

      if (!this[k] && temp.join('')) {
          this[k] = true;
          return true;
      }
  }, Object.create(null));

//   convertStr = {};

//   var convertStr = JSON.stringify(filtered);
// console.log('==DEBUG 2 == '+filtered);


// var newStr = $scope.Table_Collection2.substring(1, $scope.Table_Collection2 .length-1);
// newStr = $scope.Table_Collection2;

$scope.Table_Collection2 =filtered;


//$scope.Table_Collection2 = convertStr.toString().replace(/^\[([\s\S]*)]$/,'$1');
// console.log('NEW STRRR'+$scope.Table_Collection2);   
      });

      $scope.API_Call_Handler();

    };

    $scope.dataFr__DRAFT = {};
    $scope.Process_Name = "Save_TEMP";

    $scope.API_Call_Handler = function (form) {

      $scope.savedDRAFT=  {
        "invoicesdata": [{
          "invoiceInfo" : {
            "bId" : "E3A5C2FD",
            "storeId" : $scope.buiss_id_sel,
            "date": $scope.current_selected_form.orderDate, // order-Date
            "supplierId" : $scope.supplier_id_sel, 
            "salespersonID" : '', // ''
             "invoiceOrderNum" : $scope.current_selected_form.invoiceNo, //invoice_no
            "dueDate" : $scope.current_selected_form.dueDate, //due_date
            "periodInvoice" : '', // ''

            "totalTaxAmount" :  $scope.Total_Tax, // tax1+tax2

            "fuelCharge" : $scope.current_selected_form.invoiceLevel_FUEL,  //same
            "modeOfDeliveryTransport" : '', // ''
            "totalCost" : $scope.Total_execution_Prices, //  exc extended_price
            "overallDiscount" : $scope.Total_desc,  //exc Total_discount
            "countyTax" : 0.0, //0.0
            "cityTax" : 0.0, //0.0
            "salesTax" :0.0, //0.0
            "federalTax" : 0.0, //0.0
            "returnAmount" :0.0,  //0.0
            "paidOrNot" : false, //false
            "paidWithinDueDate" : false, //false
            "grossCost" : 0.0, // 0.0
            "invoiceLevelDiscount" : $scope.current_selected_form.invoiceLevel_dis  // UI
            },
            itemLeveData : $scope.Table_Collection2,
        }]
  }


  
  
  console.log('zdc'+JSON.stringify($scope.savedDRAFT))

      // alert(CommonConstants.REQUEST_BASE_URL_V1 + "post_invoice_data");
        // if (form.$valid) {
            // $scope.data.uname = $scope.data.username ? $scope.data.username.toLowerCase() : '';
  
            $scope.Process_Name = "Saving...";

            $http({
                method: 'POST',
                url: CommonConstants.REQUEST_BASE_URL_V1 + "post_invoice_data",
                data : $scope.savedDRAFT
            }).then(function successCallback(response) {
                console.log('RESPOO = = = '+JSON.stringify( response));
            }, function errorCallback(response) {
                console.log("error "+JSON.stringify( response));
         
               
            });
        // }
    };




    $scope.setInvoice_New = function() {
      console.log('text ===='+$scope.tableshow);
      $scope.tableshow = true;
      $scope.MinusShow = true;
      $scope.PlusShow = false;
  
    };

    $scope.Remove_setInvoice_New = function() {
      console.log('text ===='+$scope.tableshow);
      $scope.tableshow = false;
      $scope.PlusShow = true;
      $scope.MinusShow = false;
   
    };

    

    var toastMessage = function(message_text, duration) {
      if (typeof duration === 'undefined') duration = 2000;
      $ionicLoading.show({
        template: message_text,
        noBackdrop: true,
        duration: duration
      });
    };

    // go back
    $scope.myGoBack = function() {
      $ionicHistory.goBack();
      // $window.history.back();
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
      // $scope.loadData();
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
          } else if (!angular.isDefined($rootScope.globalSelectedPeriodNew)) {
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
      console.log("filterbuttonclick")
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
      console.log("calling filterbuttonclick year, period, index: ", $rootScope.globalSelectedPeriodNew, $rootScope.globalSelectedPeriodNewIndex);
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
        'name': 'ItemNumber'
      },
      {
        'name': 'ItemUnits'
      },
      {
        'name': 'Pack'
      },
      {
        'name': 'Size'
      },
      {
        'name': 'ItemDescription'
      },
      {
        'name': 'ItemQty'
      },
      {
        'name': 'BillingUnits'
      },
      {
        'name': 'UnitPrice'
      },
      {
        'name': 'Discount'
      },
      {
        'name': 'Deposit'
      },
      {
        'name': 'Tax1'
      },
      {
        'name': 'Tax2'
      },
      {
        'name': 'NetUnitPrice'
      },
      {
        'name': 'ExtendedPrice'
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
      },
      {
        'InvItemId': 'inv104',
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
      },
      {
        'InvItemId': 'inv105',
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
      },
      {
        'InvItemId': 'inv106',
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
      },
      {
        'InvItemId': 'inv107',
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
      },
      {
        'InvItemId': 'inv108',
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
      },
      {
        'InvItemId': 'inv109',
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
      },
      {
        'InvItemId': 'inv110',
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
      },
      {
        'InvItemId': 'inv111',
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
      },
    ];
    // // to catch business list response
    // function resBusiness(biz){
    //   console.log(biz);
    // }

    // set footer table headers
    $scope.footerTblHdr = [
      {
      'name': ''
    },{
      'name': 'Invoice Level'
    },{
      'name': 'Item Level'
    },{
      'name': 'Total'
    }]

    // set footer table content data
    // $scope.footerTblDatas = [{
    //     'name': 'Discounts',
    //     'invoice_level': '4.00',
    //     'item_level': '14.00',
    //     'total': '18',
    //   },
    //   {
    //     'name': 'Taxes',
    //     'invoice_level': '4.00',
    //     'item_level': '14.00',
    //     'total': '18',
    //   },
    //   {
    //     'name': 'Deposits',
    //     'invoice_level': '4.00',
    //     'item_level': '14.00',
    //     'total': '18',
    //   },
    //   {
    //     'name': 'Fuel Charges',
    //     'invoice_level': '4.00',
    //     'item_level': '14.00',
    //     'total': '18',
    //   }
    // ];


    // to get all business
    $scope.businessList = [];
    supportToolService.fetchAllBusiness($scope.loginData)
      .then(function(biz) {
        // console.log('DEBUG= 1'+JSON.stringify(biz));
        $scope.businessList = biz.items;
      });

    // to get all supplier
    $scope.supplierList = [];
    supportToolService.fetchAllSupplier($scope.loginData)
      .then(function(biz) {
        // console.log('DEBUG= 1'+JSON.stringify(biz));
       
        $scope.supplierList = biz.suppliers;
      });

    $scope.MeasurementList = [];
    supportToolService.fetchAllMeasurements($scope.loginData)
      .then(function(biz) {
        // console.log('DEBUG======== 2'+JSON.stringify(biz));
        $scope.MeasurementList = biz.measurements;
      });

    // to catch value of business drop-dropdown
    $scope.shoutLoud = function(newValue, oldValue) {
      
      $scope.buiss_id_sel = '';
      $scope.buiss_id_sel = newValue.businessId;

      $scope.current_selected.bussNameSelected = newValue.businessName;
     
    };

      // to catch value of supplier drop-dropdown
    $scope.shoutLoud2 = function(newValue, oldValue) {
      $scope.supplier_id_sel = '';
      $scope.supplier_id_sel = newValue.supplier_id;
      $scope.current_selected.supplierNameSelected = newValue.supplier_name;
    };

    // to open business drop-down
    $scope.setBusiness = function(item, type, index) {
      angular.element(document.querySelectorAll('#my_biz')).triggerHandler('click');
    }

     // to open suppliers drop-down
    $scope.setSupplier = function(item, type, index) {
      angular.element(document.querySelectorAll('#my_supp')).triggerHandler('click');
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
                }
                supportToolService.sendWeeklyPriceChangeData(datas)
                  .then(function(email) {
                    console.log(email);
                    if (email.success)
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
