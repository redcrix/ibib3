(function () {
    'use strict';
    projectCostByte.controller('InvoiceTrackingCtrl', invoiceTrackingCtrl);
    projectCostByte.directive('transformInvoicePrice', function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {

          if (ngModel) {

            ngModel.$formatters.push(function (value) {
                // console.log(value.supplier_item_price,value.supplier_item_qty)
                if(value){
                    let myVal = (value.supplier_item_price ? value.supplier_item_price : 0) * (value.supplier_item_qty ? value.supplier_item_qty : 0);
                    return parseFloat(myVal.toFixed(2));
                }
            });

            // ngModel.$parsers.push(function(value) {
            //   console.log(value.supplier_item_price,value.supplier_item_qty);
            //   return (value.supplier_item_price||0) * (value.supplier_item_qty||0);
            // });



          }
        }
      };
    });

    invoiceTrackingCtrl.$inject = ['$q', '$scope', '$state', '$window', '$location', '$ionicSideMenuDelegate',
        '$rootScope', 'CommonService', 'CommonConstants', 'Utils', '$cordovaCamera', '$cordovaFileTransfer',
        'DocumentSelectionService', '$ionicLoading', '$ionicPopup', '$ionicActionSheet', '$ionicModal', '$timeout',
        '$cordovaImagePicker', '$ionicBackdrop', '$ionicPopover', 'ErrorReportingServiceOne', '$ionicScrollDelegate','$ionicFilterBar'

    ];

    function invoiceTrackingCtrl($q, $scope, $state, $window, $location, $ionicSideMenuDelegate, $rootScope,
                                 CommonService, CommonConstants, Utils, $cordovaCamera, $cordovaFileTransfer,
                                 DocumentSelectionService, $ionicLoading, $ionicPopup, $ionicActionSheet, $ionicModal,
                                 $timeout, $cordovaImagePicker, $ionicBackdrop, $ionicPopover, ErrorReportingServiceOne,
                                 $ionicScrollDelegate,$ionicFilterBar) {

        var cameraDb = new PouchDB('invoice_camera');

        $rootScope.invoiceData ={
            searchText : ""
        }
        $scope.title ="Invoices";
        $rootScope.showSearchBtn = true;
        $scope.showSearchData = false;
        var filterBarInstance;

        $scope.$on('BUSY', function (event) {
            $scope.spinnerShow = true;
        });

        $scope.$on('FREE', function (event) {
            $scope.spinnerShow = false;
        });

        $scope.$on('UPLOAD', function (event) {
            $scope.uploadSpinnerShow = true;
        });

        $scope.$on('SUCCESS', function (event) {
            $scope.uploadSpinnerShow = false;
        });

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            //you also get the actual event object
            //do stuff, execute functions -- whatever...
            // console.log("load finish");
            $scope.msgShow = true;
        });

        var result = angular.element(document.getElementsByClassName("buttons-left header-item"));
            _.forEach(result, function(value) {
              //console.log(value);
              value.style.display = 'block';
            });

            var result = angular.element(document.getElementsByClassName("buttons-right header-item"));
            _.forEach(result, function(value) {
              //console.log(value);
              value.style.display = 'block';
            });

        // to get Unique id for pouchdb
        function generateUUID(sendUid) {
            var u = '',
                i = 0;
            while (i++ < 36) {
                var c = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' [i - 1],
                    r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                u += (c == '-' || c == '4') ? c : v.toString(16)
            }
            // return u;
            // console.log('UNIQUE: '+u);
            sendUid(u);
        }

        $scope.selectedPeriod = "";

        // err-click
        // console.log(document.getElementById('err-click'));

        $scope.initializeView = function () {
            $scope.$broadcast('BUSY');
            $scope.navBarTitle.showToggleButton = true;
            $scope.inventorySheetType = "inventory_sheet";
            $scope.invoiceType = "invoice";
            $scope.data = {};
            $scope.data.invoicesList = [];

            $ionicModal.fromTemplateUrl('application/invoice-tracking/view/supplier-modal.html', {
                scope: $scope,
                animation: 'slide-in-up',
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.supplier_modal = modal;
                $scope.buttonName = "myPromptCameras";
            });

            $rootScope.$broadcast('suppliersPageUpdate');
            $scope.$on('GETINVOICEFORPERIOD', function (event, data) {
                $scope.dateRange=data;
                // console.log("data",data);
                fetchSheetData(data);
            });
            getUserEmailId().then(function(userEmailId) {
              $scope.userEmailId = userEmailId;
            });
            // console.log("called init",$rootScope.checkForDisable)
        };

        $scope.data = {
            showDelete: false
        };
        $scope.regenrateRes = function(data){
            // console.log("data",data)
            if(data.response) {
                toastMessage("Summary updated successfully",3000);
                if ($scope.dataInvoice === undefined) {
                    $scope.dataNotReceived = true;
                }
                $scope.spinnerShow = false;
                _.forEach($rootScope.checkForDisable,function(item,index) {
                    if($scope.dateRange == item.periodWeek){
                        $rootScope.checkForDisable[index].isDisable = true;
                    }
                })
            }else {
                $scope.spinnerShow = false;
                if ($scope.dataInvoice === undefined) {
                    $scope.dataNotReceived = true;
                }
            }
        }
        $scope.regenerateSummaryChanges = function() {
            $scope.spinnerShow = true;
            $scope.dataNotReceived = false;
            CommonService.getRegenerateSummaryChanges($scope.regenrateRes,$scope.dateRange)

            // console.log("called",$rootScope.checkForDisable)
        }
        function getUserEmailId() {
              return $q(function(resolve, reject) {
                CommonService.getUserDefaullEmailId(function(emailIdData) {
                  resolve(emailIdData.data.emailId);
                })
              })
              }
           $scope.openPrompt = function() {

            $scope.emailData = {};
            $scope.emailData.userEmailId = $scope.userEmailId;
            $scope.emailData.userEmailIdNew ="";
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
              title: 'Export Invoice Summary',
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
                     if (!$scope.emailData.userEmailId ) {
                          toastMessage("Email is required");
                        } else if (!pattern.test($scope.emailData.userEmailId)) {
                          toastMessage("Please Enter Valid Email");
                        }
                     else {
                        // console.log($scope.emailData.userEmailId);
                        CommonService.exportInvoice($scope.exportInvoiceRes,$scope.dateRange, $scope.emailData.userEmailId);

                      }

                  }
                }
              ]
            });
          };

        $scope.exportInvoiceRes= function(data) {

                          // confirmPopup.close();////
            if(data.status == 200){
                if (data.data.response === true) {
                    toastMessage("<span style='position: relative;bottom: 20px;'>Invoice export request sent! </br> You will be receiving email shortly.</span>");
                    $scope.confirmPopup.close();
                }
            } else if (data.status == 503){
            }
        }


        $scope.showReportPopover = function ($event,name) {
            $event.preventDefault();
            $event.stopPropagation();
             $scope.myClick = name;
             $scope.errorReportPopover.show($event)
        }



        $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
            scope: $scope
        })
            .then(function (popover) {
                $scope.errorReportPopover = popover;
                $scope.errorReporting = function () {
                    $scope.errorReportPopover.hide();
                    var item = $scope.myClick;
                    // console.log(item);
                    ErrorReportingServiceOne.showErrorReportForm(
                        {
                            'page': 'dashboard-top5',
                            'component': item,
                            'modalName' : scope.errorReportPopover
                        },
                        {
                            'page': 'dashboard-top5',
                            'component': 'sales item'
                        }) //TODO change component key to component_type in API
                        .then(function (result) {
                            //                                        console.log(result)
                        });
                }
            });

        // gets invoices from server . run only once on init
        var fetchSheetData = function (selectedPeriod) {
            $scope.dataNotReceived=false;
            $scope.$broadcast('BUSY');
            // gets invoices from server . run only once on init
            var promises = [
                DocumentSelectionService.fetchSupplierInvoices(selectedPeriod),
                // DocumentSelectionService.fetchSuppliers()
            ];
            $q.all(promises).then((values) => {
                // console.log("*******response : ", values[0])

                fetchInvoicesResponseHandler(values[0]);
                // fetchSuppliersResponseHandler(values[1]);

            });
        };








        $scope.$watch('invoiceData.searchText', function(newVal) {
                // console.log('searchText items....',newVal)
                $rootScope.$broadcast('search_invoice_list')

        }, true);
        $scope.closeSearch = function(){
            $rootScope.searchItem = false;
            $rootScope.showSearchBtn = true;
            $rootScope.invoiceData.searchText = '';
        }
        $scope.showSearchBar = function(){
            $rootScope.searchItem = true;
            $rootScope.showSearchBtn = false;

        }
        $scope.dataReceived=true;
        var fetchInvoicesResponseHandler = function (invoices) {
            $scope.dataInvoice = invoices;
            // console.log('fetchInvoicesResponseHandler: '+JSON.stringify(invoices));
            if (invoices === undefined) {
                $scope.data.invoicesList=[];
                $scope.$broadcast('FREE');
                $scope.dataNotReceived=true;
            } else {
                $scope.dataNotReceived=false;
                invoices.visible = true;
                var datas = invoices.filter(function (inv) {
                    return inv.supplier_name !== "VOID";
                });
                datas.visible = true;
                // console.log('***** fetch ***')
                $scope.data.invoicesList=[];
                $scope.data.invoicesList = datas;
                $scope.noSearchData = datas;
                $scope.invoiceDataList = $scope.data.invoicesList;
                $scope.dataReceived=false;
                // console.log($scope.data.invoicesList)
                $scope.$broadcast('FREE');
                // $ionicLoading.hide();
            }
        };

        $scope.showFilterBar = function() {
              // console.log('********** showFilterBar calling ********');
              //console.log("that.item in filter : ", that.items);
              var search_fields = ['supplier_name','invoice_id','total_cost'];

              filterBarInstance = $ionicFilterBar.show({
                items: $scope.invoiceDataList,
                debounce: true,
                update: function(filteredItems, filterText) {
                  if (angular.isDefined(filterText) && filterText.length > 0) {
                    _.forEach(filteredItems, function(invoiceData) { 
                        var keepIngredient = false;
                        _.forEach(search_fields, function(search_field) {
                          var textToSearch = _.get(invoiceData, search_field, "");
                          if (textToSearch != "") {
                            if (textToSearch.toString().toLowerCase().indexOf(filterText.toLowerCase()) != -1) {
                              keepIngredient = true
                            }
                          }
                          if (keepIngredient) {
                            invoiceData.searchHidden = false;
                          } else {
                            invoiceData.searchHidden = true;
                          }
                        })

                    })

                    $scope.data.invoicesList = filteredItems
                    // console.log("filtered ",filteredItems)
                    // console.log("that.items",that.items)
                  } else {
                    //console.log("else part : ", $scope.updatedItems);
                    $scope.data.invoicesList = $scope.invoiceDataList;
                    if (removeSearchStatus) {
                      removeSearchStatus = false;
                      return
                    }
                    _.forEach(filteredItems, function(invoiceData) {
                        invoiceData.searchHidden = false;

                    })
                  }
                },
                cancel: function() {
                  //console.log("cancel is called : ", $scope.updatedItems);
                  $scope.data.invoicesList = $scope.invoiceDataList;
                }
              });
            };

            var removeSearchStatus = false;
            var removeSearch = function() {
              removeSearchStatus = true;
              //console.log("removeSearch : ", !angular.isUndefined(filterBarInstance));
              if (!angular.isUndefined(filterBarInstance)) {
                filterBarInstance()
                _.forEach(that.items, function(inventoryGroup) {
                  _.forEach(inventoryGroup.ingredients, function(ingredient) {
                    ingredient.searchHidden = false;

                  })
                })


              }

            }

        // $scope.showFilterBar = function() {
        //     console.log('showFilterBar')
        //     $rootScope.$broadcast('change-top');
        //     $scope.showSearchData = true;
        //     var search_fields = ['invoice_id'];

        //       filterBarInstance = $ionicFilterBar.show({
        //         items: $scope.invoiceDataList,
        //         debounce: true,
        //         delay: 2000,
        //         update: function(filteredItems, filterText) {

        //             if(angular.isDefined(filterText) && filterText){
        //                 // console.log(filterText)
        //                 var invoiceList = function (invoices) {
        //                     // console.log(invoices)
        //                     $scope.$broadcast('FREE');
        //                     $scope.showSearchData = true;
        //                     $rootScope.$broadcast('change-top');
        //                     $scope.data.invoicesList = []
        //                     // console.log(invoices.data.invoice_tracking)
        //                     _.forEach(invoices.data.invoice_tracking, function(invoiceGroup,i) {
        //                         $scope.data.invoicesList.push(invoiceGroup)
        //                     });

        //                 }
        //                 $scope.$broadcast('BUSY');
        //                 $timeout(function() {
        //                     CommonService.searchInvoiceDetails(invoiceList, filterText);
        //                 }, 10);
        //             } else{
        //                 console.log('*** cancelled *******',filterText)
        //                 // if(filterText == ''){
        //                 //     $scope.showSearchData = true;
        //                 //     $rootScope.$broadcast('change-top');
        //                 // } else
        //                 if(filterText == undefined){
        //                     $scope.showSearchData = false;
        //                     $rootScope.$broadcast('change-no-top');
        //                 }

        //                 $scope.$broadcast('FREE');
        //                 $scope.data.invoicesList = $scope.noSearchData;

        //             }

        //         }
        //       });
        // };

        var fetchSuppliersResponseHandler = function (suppliers) {
            $scope.data.suppliers = suppliers.filter(function (sup) {
                return sup.supplier_alias_name !== "VOID" && sup.supplier_alias_name !== "";
            });

            $scope.data.suppliers.push({
                'supplier_alias_name': "New Supplier",
                'supplier_id': "unknownsupplier",
                'supplier_name': "New Supplier"
            })
            //            console.log($scope.data.suppliers);
            // DocumentSelectionService.fetchSupplierInvoices(fetchInvoicesResponseHandler);
        };



        // var confirmPopup;
        $scope.updatedItem = function (newValuea, oldValue) {
            // alert("changed from " + JSON.stringify(oldValue) + " to " + JSON.stringify(newValuea));
            console.log("select");
            // console.log(newValuea, oldValue);
            $scope.mySupplier = newValuea;
            $scope.supplier_modal.show();
        };


        $scope.invoiceButtons = [{
            'label': 'Camera',
            'name': 'myCameras',
            'icon': 'ion-camera',
        },
            /*{
                'label': 'Gallery',
                'name': 'myGallerys',
                'icon': 'ion-image',
            }*/
        ];


        function confirmBox(supplier, callback) {
            console.log("confirmBox");
            $scope.mySupplier = supplier;


            //  $scope.openModal = function() {
            $scope.supplier_modal.show();
            console.log("openModal");
            //  };
            $scope.closeModal = function (type) {
                $scope.supplier_modal.hide();
                // $scope.supplier_modal.remove();
                console.log(type);
                if (!type) {
                    callback(false, $scope.mySupplier);
                } else {
                    callback(true, $scope.mySupplier);
                }
            };


            //   //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.supplier_modal.remove();
                console.log("destroy");
            });
            //
            //   // Execute action on hide modal
            $scope.$on('modal.hidden', function () {
                // Execute action
                console.log("hidden");
            });
            //
            //   // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
                console.log("removed");
            });
            // confirmPopup.then(function(res) {
            //     console.log('Tapped!', res);
            // });
        }




        $scope.showSortingActionsheet = function () {
            $ionicActionSheet.show({
                titleText: '<h3>Sorting</h3>',
                buttons: DocumentSelectionService.getButtons("SORT1"),
                cancelText: 'Cancel',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    DocumentSelectionService.setButtonClicked("SORT1", index);
                    return true;
                },
                // destructiveButtonClicked: function() {
                //     return true;
                // }
            });
        };

        $scope.showSortingFiltersheet = function () {
            $ionicActionSheet.show({
                titleText: 'Select grouping',
                buttons: DocumentSelectionService.getButtons("SORT1"),
                cancelText: 'Cancel',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    DocumentSelectionService.setButtonClicked("SORT1", index);
                    $scope.$broadcast('FILTERBUTTONCLICKED')
                    return true;
                },
                // destructiveButtonClicked: function() {
                //     return true;
                // }
            });
        };
        //


        $scope.$on('UPDATEINVOICE', function (event) {
            console.log('UPDATEINVOICE *******')
            //console.log("UPDATEINVOICE");
            DocumentSelectionService.fetchSupplierInvoices(fetchInvoicesResponseHandler);
            $scope.dataNotReceived=false;
        });


        $scope.checkScroll = function () {
            $timeout(function () {
                let currentTop = $ionicScrollDelegate.$getByHandle('scroller').getScrollPosition().top;
                let x = $ionicScrollDelegate.$getByHandle('scroller').getScrollView();
                let maxTop = x.options.getContentHeight() +
                    x.__clientHeight - window.screen.height;
                // testScrollPos()
                if (currentTop >= maxTop - 450) {
                    // hit the bottom
                    // console.log('bottom of scroll');
                    $scope.$broadcast('INVOICETRACKINGREACHEDSCROLLBOTTOM')
                }
            }, 100)

        };


        var fetchingMoreInvoices = false;
        $scope.isFetchingMore = function () {
            return fetchingMoreInvoices;
        };

        var fetchMoreInvoicesResponseHandler = function (invoices) {
            // console.log("Got more invoices: " + invoices.length)
            console.log("invoices",invoices);
            // testScrollPos()
            let preScrollPos = $ionicScrollDelegate.$getByHandle('scroller').getScrollPosition().top;

            // console.log('fetchInvoicesResponseHandler: '+JSON.stringify(invoices));
            if (invoices === undefined) {
                $timeout(function () {
                    // toastMessage("No more invoices")
                });
                $scope.$broadcast('FREE');
            } else {
                // invoices.visible = true;
                let datas = invoices.filter(function (inv) {
                    return inv.supplier_name !== "VOID";
                });
                // console.log(datas.length)
                // datas.visible = true;


                $timeout(function () {
                    console.log('*********** more inv ********')
                    $scope.data.invoicesList = _.concat($scope.data.invoicesList, datas);
                    // $scope.data.invoicesList = _.uniq(_.concat($scope.data.invoicesList, datas));
                    $ionicScrollDelegate.$getByHandle('scroller').scrollTo(0, preScrollPos, false);
                    $timeout(function () {
                        fetchingMoreInvoices = false;
                    }, 1500)
                });

                $scope.$broadcast('FREE');
                // $ionicLoading.hide();
            }
        };

        var testScrollPos = function () {
            $timeout(function () {
                let currentTop = $ionicScrollDelegate.$getByHandle('scroller').getScrollPosition().top;
                let x = $ionicScrollDelegate.$getByHandle('scroller').getScrollView();
                let maxTop = x.options.getContentHeight() +
                    x.__clientHeight - window.screen.height;
                // console.log(x, maxTop, currentTop)
            })
        };

        $scope.$on('INVOICETRACKINGREACHEDSCROLLBOTTOM', function (event) {

            if (!fetchingMoreInvoices) {
                // console.log("fetching more")
                fetchingMoreInvoices = true;
                // $ionicScrollDelegate.$getByHandle('scroller').resize()
                // console.log('Caught reached bottom scroll')
                $timeout(function () {
                    // toastMessage("Fetching more invoices...");
                    $ionicScrollDelegate.$getByHandle('scroller').freezeScroll(true)
                });
                //console.log("INVOICETRACKINGREACHEDSCROLLBOTTOM");
                DocumentSelectionService.fetchSupplierInvoices($scope.data.invoicesList.length)
                    .then(fetchMoreInvoicesResponseHandler);
            }
        });

        var toastMessage = function (message_text, duration) {
            if (typeof duration === 'undefined') duration = 2000;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        }
        // $scope.summaryClickHandler =function()
        // {
        //     toastMessage("summaryClickHandler showing");
        // }
    }

})();
