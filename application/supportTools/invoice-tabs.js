(function () {

// projectCostByte.controller('firstCtrl', function($scope) {});
// projectCostByte.controller('secondCtrl', function($scope) {});
// projectCostByte.controller('thirdCtrl', function($scope) {});

var invoiceTabsCtrl = function ($q, $scope, $rootScope, $state, $timeout, $ionicTabsDelegate, $ionicPopup, $ionicActionSheet, $ionicListDelegate, inventoryHomeSvc, ionicDatePicker,$ionicLoading, DocumentSelectionService, Utils, $window, inventoryItemsSvc) {
    $scope.showLoader = false;
    $scope.noInvDiv = false;
    $scope.invoiceEntries = {
        submitted: [],
        draft: []
    };

    $scope.stores = [];
    $scope.selectedStore = {};
    $scope.init = function () {
        $scope.navBarTitle.showToggleButton = true;
         console.log('init inventory home')
         $state.go('app.invoiceManager.drafts');


        $timeout(function () {
            $ionicTabsDelegate.$getByHandle('invoiceTabs').select(1);
        }, 0);

        $scope.invoiceEntries.draft = [{
          'supplier_name': 'SYSCO',
          'supplierId': '2856200198',
          'date': 'Sun - Feb 24, 2019',
          'totalAmount': '128.00',
          'totalItems': '2 items'
        },{
          'supplier_name': 'BREAKTHRU',
          'supplierId': '2856200198',
          'date': 'Sun - Feb 24, 2019',
          'totalAmount': '128.00',
          'totalItems': '2 items'
        },{
          'supplier_name': 'ARAMARK',
          'supplierId': '2856200198',
          'date': 'Sun - Feb 24, 2019',
          'totalAmount': '128.00',
          'totalItems': '2 items'
        },{
          'supplier_name': 'Gordon Food Services',
          'supplierId': '2856200198',
          'date': 'Sun - Feb 24, 2019',
          'totalAmount': '128.00',
          'totalItems': '2 items'
        }]

        $scope.invoiceEntries.submitted = [{
          'supplier_name': 'SYSCO',
          'supplierId': '2856200198',
          'date': 'Sun - Feb 24, 2019',
          'totalAmount': '128.00',
          'totalItems': '2 items'
        },{
          'supplier_name': 'BREAKTHRU',
          'supplierId': '2856200198',
          'date': 'Sun - Feb 24, 2019',
          'totalAmount': '128.00',
          'totalItems': '2 items'
        },{
          'supplier_name': 'ARAMARK',
          'supplierId': '2856200198',
          'date': 'Sun - Feb 24, 2019',
          'totalAmount': '128.00',
          'totalItems': '2 items'
        },{
          'supplier_name': 'Gordon Food Services',
          'supplierId': '2856200198',
          'date': 'Sun - Feb 24, 2019',
          'totalAmount': '128.00',
          'totalItems': '2 items'
        }]

        $scope.getInvDatas = function(){

            $q.all([inventoryHomeSvc.fetchStores(), inventoryHomeSvc.getInventories(),  inventoryHomeSvc.getTotalValue()]).then(function (data) {

                // that.inventoryEntries = data[1];
                // if(that.inventoryEntries.status == 200){
                //   for (var i in that.inventoryEntries.draft){
                //       if (that.inventoryEntries.draft[i].draft_id == data[2].draftId) {
                //           that.inventoryEntries.draft[i]['total_value_of_inventory'] = data[2].total_value;
                //       }
                //   }
                //
                //   that.stores = data[0];
                //   $scope.selectedStore = that.stores[0];
                //   that.showLoader = false;
                //   that.noInvDiv = true;
                // }else {
                //   toastMessage("Something went wrong!", 2000);
                //   that.showLoader = false;
                // }

            });
        }
        // $scope.getInvDatas();

        // inventoryHomeSvc.fetchInventoryItems().then(function (data) {
        //     $scope.invItems = data;
        // });


        // if($rootScope.previousState == 'app.viewSubmittedInventory'){
        //     $timeout(function () {$ionicTabsDelegate.$getByHandle('inventoryTabs').select(0)},0);
        // }else if($rootScope.previousState == 'app.composeInventory'){
        //     $timeout(function () {$ionicTabsDelegate.$getByHandle('inventoryTabs').select(1)},0);
        // }
        $scope.footer = true;

    };
    $scope.deleteDraft = function (item) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Inventory',
            template: 'Do you want to delete the inventory?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                that.showLoader = true;
                inventoryHomeSvc.deleteInventory({"draft_id": item.draft_id}).then(function (data) {
                    return $q.all([inventoryHomeSvc.fetchStores(), inventoryHomeSvc.getInventories()])
                }).then(function (data) {
                    that.inventoryEntries = data[1];
                    that.stores = data[0];
                    $scope.selectedStore = that.stores[0];
                    that.showLoader = false;
                });
            } else {
            }
            $ionicListDelegate.closeOptionButtons();
        });
    };
//------------------------------------------------------------------/
    function responseHandler(draft_data){
        console.log(draft_data)
        if(draft_data.success){
            console.log('if****')
            that.showLoader= false;
            //that.inventory_status = 'draft';
            console.log(that.editedItem)
            that.editedItem.inventory_status = "draft";
            toastMessage("Please Switch to drafts ",4000);
        }
    }
    $scope.allowEdit = function(item){
        $scope.editedItem = item;
        //console.log($scope.editedItem)
        $scope.showLoader= true;
        //console.log('allowEdit: ',item)
        //console.log(item.draft_id)
        inventoryItemsSvc.fetchDraftID(item.draft_id, responseHandler);
    }

   // function fetchDraftID(draft_id, responseHandler);
//-----------------------------------------------------
$scope.viewHistory = function (item){
    console.log("inside view history");
    var draftId = item.draft_id;
    console.log(Utils);
    console.log(Utils.getLocalValue('current_store', '0'));
    console.log(Utils.getLocalValue('disable_confirmation_popup_tasks', false));
    Utils.getDocumentFromPouchDb('inventory_draft_storage', draftId).then((result) => {
        console.log("final get");
        console.log(Object.keys(JSON.parse(result.data)));
        var docData = JSON.parse(result.data);
        var timeStampKeys = Object.keys(docData);
        console.log("time stamp keys");
        console.log(timeStampKeys);
        var buttonList = [];

        timeStampKeys.forEach(function(value){
            var ts = new Date(parseInt(value*1000));
            ts = ts.toLocaleString();
            var _temp = {
                text: ts,
                clicked: false,
                toggleState: false

            }
            buttonList.push(_temp);

        });

        var action_sheet_definition = {
            buttons: buttonList, //         destructiveText: 'Delete',
            titleText: '<h4>Inventory Draft History</h4>',
            // destructiveText: 'Delete',
            cancelText: 'Cancel',
            cancel: function () {
                //                    console.log('CANCELLED');
            },
            buttonClicked: function (index) {
                console.log(docData[timeStampKeys[index]]);
                var draftHistData = docData[timeStampKeys[index]];
                that.onItemTap(item, true, draftHistData);
                //load draft data
                hideSheet();
            }
        }

        //        DocumentSelectionService.setButtonClicked("SORT", index);
        var hideSheet = $ionicActionSheet.show(action_sheet_definition);
        var myEl = angular.element(document.querySelector('.action-sheet-group'));
         // console.log(myEl);
         myEl.css('overflow-y', 'scroll');
         console.log("innerheight");
         console.log($window.innerHeight)
         myEl.css('max-height', ($window.innerHeight - 50) + 'px');
        });
    };
    var toastMessage = function (message_text, duration) {
        if (typeof duration === 'undefined') duration = 1500;
        $ionicLoading.show({
            template: message_text,
            noBackdrop: true,
            duration: duration
        });
    };
    $scope.composeClicked = function (evt) {
        $timeout(function () {
                //                $ionicTabsDelegate.select(1);
            $ionicTabsDelegate.$getByHandle('inventoryTabs').select(1);
        }, 0);
        $state.go('app.invoiceEntry');
        // that.showPopup();
    };
    $scope.onItemTap = function (item, is_history = false, key) {
      console.log('select inv******');
    //  inventoryService.setSelectedGroupBy("ingredient_category");
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(item.inventory_date);
        // that.showLoader = true;
        item.loading = true;

        var myElement = angular.element( document.querySelector( '#inv-list_'+item.draft_id ) );
        console.log(myElement)
        myElement.addClass('inventory-item-selected');
        $timeout(function () {
            $state.go('app.invoiceEntry').then(function(){
                item.loading = false;
            });
        }, 100);
    };
    console.log($ionicTabsDelegate.selectedIndex());
    $scope.submittedClick = function(){
        console.log('submittedClick')
        $scope.config = false;
        // $state.go('app.inventoryManager.submitted');
    }
    $scope.draftClick = function(){
        console.log('draft click')
        $scope.config = false;
        // $scope.getInvDatas();
        // $state.go('app.inventoryManager.draft');
    }
    $scope.trendsClick = function(){
        $scope.config = false;
    }
    $scope.configClick = function(){
        $scope.config = true;
        console.log('config click')
        $state.go('app.inventoryManager.config');
    }
    $scope.saveMappedData = function(){
        console.log('save');
    }


    // $scope.onConfigTap = function(){
    //     $scope.footer = false;
    // }

    $scope.onSubmittedItemTap = function (item) {
        item.loading = true;
        $scope.footer = true;
        var myElement = angular.element( document.querySelectorAll( '#inv-submitted-list_'+item.draft_id ) );
        // console.log(myElement)
        myElement.addClass('inventory-item-selected');

        $timeout(function () {
            $state.go('app.viewSubmittedInventory', {
              inventory: item.draft_id,
              inventory_name: item.name,
              group_by_field : item.group_by_field,
            }).then(function(){
                item.loading = false;
            });
        }, 100);
    };


    $scope.showPopup = function () {
        $scope.data = {};
        $scope.validity = false;
        $scope.data.datetimeValue = new Date();
        // An elaborate, custom popup
        that.openStoresSheet = function () {
            var hideSheet = $ionicActionSheet.show({
                buttons: that.stores.map(function (ele) {
                    return {text: ele.store_name}
                }),
                titleText: 'Select store',
                cancelText: 'Cancel',
                cancel: function () {

                },
                buttonClicked: function (index) {
                    $scope.selectedStore = that.stores[index];
                    //hideSheet();
                    return true;
                }
            });
        };

        $scope.openDatePicker = function(){
          var datepickerObject = {
            callback: function (val) {  //Mandatory
            $scope.data.datetimeValue = new Date(val);
            },
            disabledDates:[],
            from: new Date(2016, 6, 1), //Optional
            to: new Date(), //Optional
            inputDate: new Date(),      //Optional
            mondayFirst: true,          //Optional
            disableWeekdays: [],       //Optional
            closeOnSelect: false,       //Optional
            templateType: 'popup'       //Opional
          }
          ionicDatePicker.openDatePicker(datepickerObject);
        }

        $scope.data.groupByButtons = [{ 'label': 'Ingredient Category' ,
                                        'clicked' : true,
                                        'key' : "PRODUCT_CATEGORY"
                                      },
                                      { 'label': 'Location' ,
                                        'clicked' : false,
                                        'key' : "LOCATION"
                                      },
        ]

        $scope.data.prePostButtons = [{ 'label': 'Pre' ,
                                        'clicked' : true,
                                        'key' : "PRE"
                                      },
                                      { 'label': 'Post' ,
                                        'clicked' : false,
                                        'key' : "POST"
                                      },
        ]

        $scope.groupByButtonClick = function(buttonIndex){
            for (var i = $scope.data.groupByButtons.length; i--; ) {
                        if (i == buttonIndex) {
                            $scope.data.groupByButtons[i].clicked = true;
                        } else {
                            $scope.data.groupByButtons[i].clicked = false;
                        }
            }
        }

        $scope.prePostButtonClick = function(buttonIndex){
            for (var i = $scope.data.prePostButtons.length; i--; ) {
                        if (i == buttonIndex) {
                            $scope.data.prePostButtons[i].clicked = true;
                        } else {
                            $scope.data.prePostButtons[i].clicked = false;
                        }
            }
        }
        $scope.setValidity = function(status) {
          $scope.validity = status;
          // console.log(status, $scope.validity);
        }

        var myPopup = $ionicPopup.show({
            template:`<form name="createInv">
                        <div class="row inventory-unset-padding">
                            <input placeholder="Inventory Name"
                                   name="invName" type="text"
                                   ng-model="data.name"
                                   ng-pattern="/^[A-z a-z 0-9]+$/i"
                                   ng-change="setValidity(createInv.invName.$valid)"
                                   style="height: 30px;"
                                   class="inventory-text-left"/>
                        </div>
                        <div class="row">Date:</div>
                        <div class="row inventory-text-left" ng-click="ctrl.openDatePicker()" style="padding: 5px; background: lightgray;" >
                            {{data.datetimeValue| date: "yyyy-MM-dd"}}
                        </div>
                        </div>
                        <div>
                        <div class="row">Pre/Post Inventory:</div>
                        <div style="margin-top:-5px;" class="button-bar">
                            <a ng-repeat="prePostButton in data.prePostButtons track by $index"
                               style="text-overflow: inherit;"
                               class="button button-bal button-small no-horizontal-padding"
                               ng-class="prePostButton.clicked ? '' : 'button-out'"
                               ng-click="prePostButtonClick($index)">
                               <span class='x-smaller inventory-text-center'>{{ prePostButton.label }}</span></a>
                        </div>
                        </div>

                        <div ng-if="ctrl.stores.length>0">
                        <div class="row">Selected Location: </div>
                        <div id="dropdown-container"  class="row inventory-text-left" style="font-style:italic; padding: 5px; background: lightgray;">
                            {{selectedStore.store_name}}
                        </div>
                        </div>
                      </form>
                        `,
            title: 'Add New Inventory',
            subTitle: '',
            scope: $scope,
            buttons: [
                {text: 'Cancel'},
                {
                    text: '<b>Add</b>',
                    type: 'button-bal myClass',
                    onTap: function (e) {

                      console.log('input is valid? ' + $scope.validity);
                      // console.log(e, $scope.model, $scope.createInv.input.$valid);
                        // if (!$scope.data.name) {
                        //     toastMessage("Inventory Name is required.", 2000);
                        //     e.preventDefault();
                        // } else
                        if(!$scope.validity){
                          toastMessage("Invalid inventory name", 2000);
                        }else {
                            // // console.log($scope.data.name.length)
                            if($scope.data.name.length > 30){
                                toastMessage("Inventory Name is too long.", 2000);
                                e.preventDefault();
                            }else{
                                return $scope.data;
                            }
                        }
                    }
                }
            ]
        });

        setTimeout(function () {
            document.querySelector('#dropdown-container').addEventListener('click', function () {
                $scope.$apply(function () {
                    that.openStoresSheet();
                })
            });
        }, 50);



        myPopup.then(function (res) {
        //  console.log(res);
            if (!!res && !!res.name) {
                var requestPayload = {
                    "name_given": res.name,
                    "date_of_creation": Math.floor(res.datetimeValue.getTime() / 1000).toString(),
                    store_id: $scope.selectedStore.store_id,
                    group_by_field: _.get(_.find($scope.data.groupByButtons, 'clicked'), 'key'),
                    pre_post: _.get(_.find($scope.data.prePostButtons, 'clicked'), 'key'),
                };
              //  console.log(requestPayload);
                inventoryHomeSvc.createInventory(requestPayload).then(function (data) {
                //  inventoryHomeSvc.passInventoryDetails(requestPayload, data.draft_id);
                  if(data.status == 200){
                    toastMessage("Inventory has been sucessfully added.", 2000);
                    $state.go("app.composeInventory", {
                        inventory: data.data.draft_id,
                        store_id: $scope.selectedStore.store_id,
                        inventory_name: $scope.data.name,
                        date_of_creation: $scope.data.datetimeValue,
                        group_by_field: _.get(_.find($scope.data.groupByButtons, 'clicked'), 'key'),

                    });
                  } else {
                    toastMessage("Something went wrong!", 2000);
                  }
                });
            }

        });
    };

};

invoiceTabsCtrl.$inject = ['$q', '$scope', '$rootScope','$state', '$timeout', '$ionicTabsDelegate', '$ionicPopup', '$ionicActionSheet', '$ionicListDelegate', 'inventoryHomeSvc', 'ionicDatePicker','$ionicLoading', 'DocumentSelectionService', 'Utils','$window', 'inventoryItemsSvc'];
projectCostByte.controller('invoiceTabsCtrl', invoiceTabsCtrl);

})();
