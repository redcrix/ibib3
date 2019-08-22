(function() {
    var orderingSubmittedCtrl = function($q, $scope, $rootScope, $state, $timeout, $ionicTabsDelegate, $ionicPopup, $ionicActionSheet, $ionicListDelegate, orderingHomeSvc, ionicDatePicker, $ionicLoading) {
        $scope.showLoader = true;
        $scope.orderingEntries = {
            submitted: [],
            drafts: []
        };
        $scope.stores = [];
        $scope.selectedStore = {};
        $scope.init = function() {
            $scope.pageTitle = "Ordering";
            $timeout(function() {
                //                $ionicTabsDelegate.select(1);
                $ionicTabsDelegate.$getByHandle('orderingTabs').select(1);
            }, 0);

            var db = new PouchDB('ordering');

            // $scope array will always be kept up-to-date with PouchDB
            var docs , newDocs= [];

            var offlineOrdering = {};


            // basic methods


            $q.all([orderingHomeSvc.fetchStores(), orderingHomeSvc.getOrdering(), orderingHomeSvc.getTotalValue()]).then(function(data) {
                // console.log(data);
                $scope.orderingEntries = data[1];
                console.log($scope.orderingEntries);
                for (var i in $scope.orderingEntries.draft){
                    if ($scope.orderingEntries.draft[i].draft_id == data[2].draftId) {
                        $scope.orderingEntries.draft[i]['total_value_of_ordering'] = parseFloat(data[2].total_value).toFixed(2);
                    }
                }
                $scope.stores = data[0];
                $scope.selectedStore = $scope.stores[0];
                $scope.showLoader = false;

            });
            $scope.navBarTitle.showToggleButton = true;

            if ($rootScope.previousState == 'app.viewSubmittedOrdering') {
                $timeout(function() {
                    $ionicTabsDelegate.$getByHandle('orderingTabs').select(0)
                }, 0);
            } else if ($rootScope.previousState == 'app.composeOrdering') {
                $timeout(function() {
                    $ionicTabsDelegate.$getByHandle('orderingTabs').select(1)
                }, 0);
            }

        };
        var toastMessage = function(message_text, duration) {
              if (typeof duration === 'undefined') duration = 1500;
              $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration,
              });
            };
        $scope.deleteDraft = function(item) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Ordering',
                template: 'Do you want to delete the ordering?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $scope.showLoader = true;
                    orderingHomeSvc.deleteOrdering({
                        "draft_id": item.draft_id
                    }).then(function(data) {
                        return $q.all([orderingHomeSvc.fetchStores(), orderingHomeSvc.getOrdering()])
                    }).then(function(data) {
                        $scope.orderingEntries = data[1];
                        $scope.stores = data[0];
                        $scope.selectedStore = $scope.stores[0];
                        $scope.showLoader = false;
                    });
                } else {}
                $ionicListDelegate.closeOptionButtons();
            });
        };

        $scope.composeClicked = function(evt) {
            $timeout(function() {
                //                $ionicTabsDelegate.select(1);
                $ionicTabsDelegate.$getByHandle('orderingTabs').select(1);
            }, 0);
            $scope.showPopup();
        };
        $scope.onItemTap = function(item) {
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            d.setUTCSeconds(item.ordering_date);
            $scope.showLoader = true;
            $state.go('app.composeOrdering', {
                ordering: item.draft_id,
                ordering_name: item.name,
                date_of_creation: d
            });
        };

        $scope.onSubmittedItemTap = function(item) {
          console.log('************ onSubmittedItemTap **********');
            $scope.showLoader = true;
            $state.go('app.viewSubmittedOrdering', {
                ordering: item.draft_id,
                ordering_name: item.name
            });
        };


        $scope.showPopup = function() {
            $scope.data = {};
            $scope.data.datetimeValue = new Date();
            // An elaborate, custom popup
            $scope.openStoresSheet = function() {
                var hideSheet = $ionicActionSheet.show({
                    buttons: $scope.stores.map(function(ele) {
                        return {
                            text: ele.store_name
                        }
                    }),
                    titleText: 'Select store',
                    cancelText: 'Cancel',
                    cancel: function() {

                    },
                    buttonClicked: function(index) {
                        $scope.selectedStore = $scope.stores[index];
                        //hideSheet();
                        return true;
                    }
                });
            };

            $scope.openDatePicker = function() {
                var datepickerObject = {
                    callback: function(val) { //Mandatory
                        $scope.data.datetimeValue = new Date(val);
                    },
                    disabledDates: [],
                    from: new Date(2016, 6, 1), //Optional
                    to: new Date(), //Optional
                    inputDate: new Date(), //Optional
                    mondayFirst: true, //Optional
                    disableWeekdays: [], //Optional
                    closeOnSelect: false, //Optional
                    templateType: 'popup' //Opional
                }
                ionicDatePicker.openDatePicker(datepickerObject);
            }

            var myPopup = $ionicPopup.show({
                template: `<form name="newOrder">
                              <input placeholder="Order Name" type="text" name="orderName" ng-model="data.name" required/>
                              <p ng-show="newOrder.orderName.$error.required && newOrder.orderName.$touched" class="help-block error">Order Name is required.</p>

                              <div>Date:</div>
                              <div class="row inventory-text-left" ng-click= "ctrl.openDatePicker()" style="padding: 5px; background: lightgray;" >{{data.datetimeValue| date: "yyyy-MM-dd"}}</div>
                              <div ng-if="ctrl.stores.length>0" id="dropdown-container">
                                <div style="margin-top: 10px">Selected Store: </div>
                                  <div style="font-style:italic; padding: 5px; background: lightgray; text-align: center;">{{selectedStore.store_name}}</div>
                                </div>
                          </form>`,
                title: 'Add New Order',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Add</b>',
                    type: 'button-balanced',
                    onTap: function(e) {
                        if (!$scope.data.name) {
                           // e.preventDefault();
                           toastMessage('Order Name is required.', 2000);
                           e.preventDefault();
                       } else {
                         $scope.match = false;
                         _.find($scope.orderingEntries.draft, function(draftName) {
                             if((draftName.name).toUpperCase() == ($scope.data.name).toUpperCase()){
                               // if(((catName.ingredient_alias_name).toUpperCase() == ($scope.invItem.name).toUpperCase())){
                               $scope.match = true;
                             }
                         });
                         if ($scope.match) {
                             toastMessage('Order with same name already exists', 2000);
                             e.preventDefault();
                         } else if($scope.data.name.length > 10){
                            toastMessage('Order Name is too long.', 2000);
                            e.preventDefault();
                         }else {
                           return $scope.data;
                         }
                       }
                    }
                }]

            });

            setTimeout(function() {
                document.querySelector('#dropdown-container').addEventListener('click', function() {
                    $scope.$apply(function() {
                        $scope.openStoresSheet();
                    })
                });
            }, 50);
            myPopup.then(function(res) {
                //  console.log(res);
                if (!!res && !!res.name) {
                    var requestPayload = {
                        "name_given": res.name,
                        "date_of_creation": Math.floor(res.datetimeValue.getTime() / 1000).toString(),
                        store_id: $scope.selectedStore.store_id
                    };
                    //  console.log(requestPayload);
                    orderingHomeSvc.createOrdering(requestPayload).then(function(data) {
                        //  orderingHomeSvc.passOrderingDetails(requestPayload, data.draft_id);
                        $state.go("app.composeOrdering", {
                            ordering: data.draft_id,
                            store_id: $scope.selectedStore.store_id,
                            ordering_name: $scope.data.name,
                            date_of_creation: $scope.data.datetimeValue
                        });
                    });
                }

            });
        };

    };

    orderingSubmittedCtrl.$inject = ['$q', '$scope', '$rootScope', '$state', '$timeout', '$ionicTabsDelegate', '$ionicPopup', '$ionicActionSheet', '$ionicListDelegate', 'orderingHomeSvc', 'ionicDatePicker', '$ionicLoading'];
    projectCostByte.controller('orderingSubmittedCtrl', orderingSubmittedCtrl);
})();
