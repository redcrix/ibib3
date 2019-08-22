(function() {
    var OrderingHomeCtrl = function($q, $scope, $rootScope, $state, $timeout, $ionicTabsDelegate, $ionicPopup, $ionicActionSheet, $ionicListDelegate, orderingHomeSvc, ionicDatePicker, $ionicLoading) {
        var that = this;
        this.showLoader = true;
        this.orderingEntries = {
            submitted: [],
            drafts: []
        };
        this.stores = [];
        $scope.selectedStore = {};
        this.init = function() {
            $scope.pageTitle = "Ordering";
            $timeout(function() {
                //                $ionicTabsDelegate.select(1);
                $ionicTabsDelegate.$getByHandle('orderingTabs').select(1);
            }, 0);

            var db = new PouchDB('ordering');

            // this array will always be kept up-to-date with PouchDB
            var docs , newDocs= [];

            var offlineOrdering = {};



            // document.addEventListener("online", onOnline, false);

            // function onOnline() {
            //     // Handle the online event
            //     alert('online');
            // }
            // document.addEventListener("offline", onOffline, false);

            // function onOffline() {
            //     // Handle the online event
            //     alert('offline');
            // }

            // Need to change to this later  https://github.com/angular-pouchdb/angular-pouchdb
            // It Wraps Pouch's methods with $q


            // basic methods

            function binarySearch(arr, docId) {
              var low = 0, high = arr.length, mid;
              while (low < high) {
                mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
                arr[mid]._id < docId ? low = mid + 1 : high = mid
              }
              return low;
            }

            function onDeleted(id) {
              var index = binarySearch(docs, id);
              var doc = docs[index];
              if (doc && doc._id === id) {
                docs.splice(index, 1);
              }
            }

            function onUpdatedOrInserted(newDoc) {
              var index = binarySearch(docs, newDoc._id);
              var doc = docs[index];
              if (doc && doc._id === newDoc._id) { // update
                console.log('updating');
                docs[index] = newDoc;
              } else { // insert
                console.log('inserting');
                docs.splice(index, 0, newDoc);
              }
            }


            $q.all([orderingHomeSvc.fetchStores(), orderingHomeSvc.getOrdering(), orderingHomeSvc.getTotalValue()]).then(function(data) {
                // console.log(data);
                that.orderingEntries = data[1];
                for (var i in that.orderingEntries.draft){
                    if (that.orderingEntries.draft[i].draft_id == data[2].draftId) {
                        that.orderingEntries.draft[i]['total_value_of_ordering'] = parseFloat(data[2].total_value).toFixed(2);
                    }
                }
                that.stores = data[0];
                $scope.selectedStore = that.stores[0];
                that.showLoader = false;

                // function fetchInitialDocs(){
                //   return db.allDocs({include_docs: true}).then(function (res) {
                //     docs = res.rows.map(function (row) {
                //       return row.doc;
                //     });
                //     if(docs.length == 0){
                //       angular.forEach(that.orderingEntries.draft, function(datas, index){
                //           offlineOrdering = datas;
                //           // offlineOrdering._id = datas.draft_id;
                //           offlineOrdering._id = "draftOrdering_"+datas.draft_id;
                //
                //           newDocs.push(offlineOrdering);
                //           // console.log(index, datas);
                //
                //           if(index+1 == that.orderingEntries.draft.length){
                //             //Inserting Documents
                //             // console.log(that.orderingEntries);
                //             db.bulkDocs(newDocs, function(err, response) {
                //                if (err) {
                //                   return console.log(err);
                //                } else {
                //                   console.log("Documents created Successfully");
                //                   db.allDocs({include_docs: true}).then(function (res) {
                //                     docs = res.rows.map(function (row) {
                //                      return row.doc;
                //                     });
                //                   });
                //                }
                //             });
                //           }
                //       });
                //     }
                //     // console.log(docs);
                //     renderDocs();
                //   });
                // }

                // function reactToChanges() {
                //   db.changes({live: true, since: 'now', include_docs: true}).on('change', function (change) {
                //     console.log("changes");
                //     console.log(change);
                //     if (change.deleted) {
                //       // change.id holds the deleted id
                //       onDeleted(change.id);
                //     } else { // updated/inserted
                //       // change.doc holds the new doc
                //       onUpdatedOrInserted(change.doc);
                //     }
                //
                //     //  if (change.deleted) {
                //     //    deleteListener(change);
                //     //  } else if (change.changes.length === 1 &&
                //     //             /^1-/.test(change.changes[0].rev)) {
                //     //    createListener(change);
                //     //  } else {
                //     //    updateListener(change);
                //     //  }
                //     renderDocs();
                //   }).on('error', console.log.bind(console));
                // }

                // function renderDocs() {
                //     console.log(docs);
                //     that.orderingEntries.draft = docs;
                //     $scope.$apply();
                // }
                //
                // function insertRandomDoc() {
                //     db.put({_id: Date.now().toString(),'name':'pdbtest'}).catch(console.log.bind(console));
                // }


                // function updateRandomDoc() {
                //   if (!docs.length) {
                //     return;
                //   }
                //   var randomDoc = docs[Math.floor(Math.random() * docs.length)];
                //   db.get(randomDoc._id).then(function (doc) {
                //     if (!doc.updatedCount) {
                //       doc.updatedCount = 0;
                //     }
                //     doc.updatedCount++;
                //     return db.put(doc);
                //   }).catch(console.log.bind(console));
                // }

                // function deleteRandomDoc() {
                //   if (!docs.length) {
                //     return;
                //   }
                //   var randomDoc = docs[Math.floor(Math.random() * docs.length)];
                //   db.get(randomDoc._id).then(function (doc) {
                //     return db.remove(doc);
                //   }).catch(console.log.bind(console));
                // }


                // $rootScope.$on('isOnline', function(event, data) {
                //     console.log('device', data);
                //     if(!data)
                // fetchInitialDocs().then(reactToChanges).catch(console.log.bind(console));
                // });


                // for (var i in that.orderingEntries.draft) {
                //     if (that.orderingEntries.draft[i].draft_id == data[2].draftId) {
                //         that.orderingEntries.draft[i]['total_value_of_ordering'] = data[2].total_value.toFixed(2);
                //     }
                // }
                // that.stores = data[0];
                // $scope.selectedStore = that.stores[0];
                // that.showLoader = false;
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
        this.deleteDraft = function(item) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Ordering',
                template: 'Do you want to delete the ordering?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    that.showLoader = true;
                    orderingHomeSvc.deleteOrdering({
                        "draft_id": item.draft_id
                    }).then(function(data) {
                        return $q.all([orderingHomeSvc.fetchStores(), orderingHomeSvc.getOrdering()])
                    }).then(function(data) {
                        that.orderingEntries = data[1];
                        that.stores = data[0];
                        $scope.selectedStore = that.stores[0];
                        that.showLoader = false;
                    });
                } else {}
                $ionicListDelegate.closeOptionButtons();
            });
        };

        this.composeClicked = function(evt) {
            $timeout(function() {
                //                $ionicTabsDelegate.select(1);
                $ionicTabsDelegate.$getByHandle('orderingTabs').select(1);
            }, 0);
            that.showPopup();
        };
        this.onItemTap = function(item) {
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            d.setUTCSeconds(item.ordering_date);
            // that.showLoader = true;

            console.log('Item tapped.....');
            // $state.go('app.composeOrdering', {
            //     ordering: item.draft_id,
            //     ordering_name: item.name,
            //     date_of_creation: d
            // });
            console.log(item.draft_id,item.name);
            $state.go('app.draftTabs', {
                ordering: item.draft_id,
                ordering_name: item.name,
                date_of_creation: d
            });
            //
        };

        this.onSubmittedItemTap = function(item) {
            that.showLoader = true;
            $state.go('app.viewSubmittedOrdering', {
                ordering: item.draft_id,
                ordering_name: item.name
            });
        };
        this.draftTabsClick = function(){
            $scope.config = true;
            console.log('draftTabs click')
            $state.go('app.ordering.draftTabs');
        }
        this.submittedClick = function(){
            $scope.config = true;
            console.log('submittedClick click')
            $state.go('app.ordering.submitted');
        }

        this.showPopup = function() {
            $scope.data = {};
            $scope.data.datetimeValue = new Date();
            // An elaborate, custom popup
            that.openStoresSheet = function() {
                var hideSheet = $ionicActionSheet.show({
                    buttons: that.stores.map(function(ele) {
                        return {
                            text: ele.store_name
                        }
                    }),
                    titleText: 'Select store',
                    cancelText: 'Cancel',
                    cancel: function() {

                    },
                    buttonClicked: function(index) {
                        $scope.selectedStore = that.stores[index];
                        //hideSheet();
                        return true;
                    }
                });
            };

            this.openDatePicker = function() {
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
                         _.find(that.orderingEntries.draft, function(draftName) {
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
                        that.openStoresSheet();
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
                        // $state.go("app.composeOrdering", {
                        //     ordering: data.draft_id,
                        //     store_id: $scope.selectedStore.store_id,
                        //     ordering_name: $scope.data.name,
                        //     date_of_creation: $scope.data.datetimeValue
                        // });
                        $state.go('app.draftTabs', {
                            ordering: data.draft_id,
                            ordering_name: $scope.data.name,
                            store_id: $scope.selectedStore.store_id,
                            date_of_creation: $scope.data.datetimeValue
                        });
                    });
                }

            });
        };

    };

    OrderingHomeCtrl.$inject = ['$q', '$scope', '$rootScope', '$state', '$timeout', '$ionicTabsDelegate', '$ionicPopup', '$ionicActionSheet', '$ionicListDelegate', 'orderingHomeSvc', 'ionicDatePicker', '$ionicLoading'];
    projectCostByte.controller('OrderingHomeCtrl', OrderingHomeCtrl);
})();
