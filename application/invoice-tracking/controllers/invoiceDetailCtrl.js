(function () {
    'use strict'
    projectCostByte.controller('InvoiceDetailCtrl', InvoiceDetailCtrl);

    InvoiceDetailCtrl.$inject = ['$q', '$scope', '$state', '$location', '$ionicSideMenuDelegate',
        '$rootScope', 'CommonService', 'CommonConstants', 'Utils', '$cordovaCamera', '$cordovaFileTransfer',
        'DocumentSelectionService', '$ionicLoading', '$ionicActionSheet', '$ionicModal','$ionicScrollDelegate','PlTrackerService','$timeout','$cordovaInAppBrowser'

    ];

    function InvoiceDetailCtrl($q, $scope, $state, $location, $ionicSideMenuDelegate, $rootScope,
        CommonService, CommonConstants, Utils, $cordovaCamera, $cordovaFileTransfer,
        DocumentSelectionService, $ionicLoading, $ionicActionSheet, $ionicModal,$ionicScrollDelegate,PlTrackerService,$timeout,$cordovaInAppBrowser) {
        $scope.showIds = false;
        $scope.$on('BUSY', function (event) {
            $scope.spinnerShow = true;
        });


        $scope.$on('FREE', function (event) {
            $scope.spinnerShow = false;
        });

        $scope.$on('$ionicView.enter', function(){
            $ionicSideMenuDelegate.canDragContent(false);
        });
        $scope.$on('$ionicView.leave', function(){
            $ionicSideMenuDelegate.canDragContent(true);
        });
        var options = {
          location: 'yes',
          clearcache: 'yes',
          toolbar: 'no'
       };
       if (ionic.Platform.platform() != 'android' && ionic.Platform.platform() != 'ios') $scope.showIds = true;
        $scope.openBrowser = function(url) {
          url=url.toString()
          $cordovaInAppBrowser.open(url, '_blank', options)
        
          .then(function(event) {
             // success
          })
        
          .catch(function(event) {
             // error
          });
       }
   
        $scope.openWebpage = function(url) {
        console.log(url)
        url=url.toString()
        
        var ref = cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=yes');

        // Opening a URL and returning an InAppBrowserObject
        // const browser = this.inAppBrowser.create(url, '_self', options);

       // Inject scripts, css and more with browser.X
      }

        $scope.showFile = function(FileUrl) {
          var file = FileUrl;
          console.log(file);
          var ref = cordova.InAppBrowser.open(FileUrl, '_blank', 'location=yes');
        }

        $scope.show_tabs = false;
        $scope.rowSize = {
            name: 48,
            price: 15,
            qty: 20,
            // units :10,
            value: 15,
        };


        $scope.initializeView = function () {
            $scope.navBarTitle.showToggleButton = false;
            $scope.invoicesData = [];
            console.log("Invoice " + $state.params.invoiceId);
            //buttons-left header-item14px
            //buttons-right
            //title-center
           //buttons-below
             var result = angular.element(document.getElementsByClassName("button-small button-bal"));
            _.forEach(result, function(value) {
              // console.log(value);
             value.style.display = 'none';
            });


           var result = angular.element(document.getElementsByClassName("buttons-left header-item"));
            _.forEach(result, function(value) {
              //console.log(value);
              value.style.display = 'none';
            });

            var result = angular.element(document.getElementsByClassName("buttons-right header-item"));
            _.forEach(result, function(value) {
              //console.log(value);
              value.style.display = 'none';
            });

            var result = angular.element(document.getElementsByClassName("title-center header-item"));
            _.forEach(result, function(value) {
              //console.log(value);
              value.style.border = 'none';
            });
            fetchSheetData();
        }

        // gets invoices from server . run only once on init
        var fetchSheetData = function () {
             $scope.$broadcast('BUSY');
            DocumentSelectionService.fetchInvoice(fetchInvoiceResponseHandler, $state.params.invoiceId,$state.params.supplier_id);
        }

        $scope.checkSave = function(supplierArray) {
            // console.log("all supplierArray : ", supplierArray);
        }

        // $scope.orginalSupInvItems = angular.copy($scope.invoicesData.supplier_invoice_items);

        var toastMessage = function(message_text, duration) {
          if (typeof duration === 'undefined') duration = 1500;
          $ionicLoading.show({
            template: message_text,
            noBackdrop: true,
            duration: duration,
          });
        };


        $scope.onTextClick = function (index, $event) {
            $scope.isActive = [];
            _.each($scope.invoicesData.supplier_invoice_items, function(i, item) {
                if(i === index) {
                    $scope.isActive[index] = false;
                } else {
                    $scope.isActive[index] = true;
                }
            });
            event.target.style.textOverflow = "clip";
        };

        $scope.onTextBlur = function ($event) {
            event.target.style.textOverflow = "ellipsis";
        };
        $scope.saveInvoice = function(formObject, tableData,invoice) {
          // console.log("invoice",invoice,$scope.testData);
            var postInvoiceResponse = function(responseData) {
                // console.log("responseData : ", responseData);
                if(responseData.data.response === true) {
                    // $scope.invoicesData = responseData.config.data;
                    $scope.$broadcast('BUSY');
                    DocumentSelectionService.fetchInvoice(fetchInvoiceResponseHandler, $state.params.invoiceId,$state.params.supplier_id);
                    toastMessage("Invoice data saved successfully", 1500);
                }else{
                    toastMessage("Invoice data Not saved ", 1500);
                }
            }

            $scope.invoicesData.fuel_charge=invoice.fuel_charge;
            $scope.invoicesData.invoice_level_discount=invoice.invoice_level_discount;
            $scope.invoicesData.supplier_invoice_items = tableData;
            // let sendData = $scope.invoicesData;
            $scope.sendData = angular.copy($scope.invoicesData);
            // console.log($scope.sendData);
            let updatedItem = _.forEach([$scope.sendData],  function(filtered){
              delete filtered["minorCategories"]
              delete filtered["p_l_categories"]
              filtered.supplier_invoice_items = _.filter(filtered.supplier_invoice_items,  function(supInvItems){
                  delete supInvItems["units_options"]
                  return supInvItems.isUpdated;
              });
              // console.log(filtered.supplier_invoice_items);
              return filtered;
            });
            // console.log(updatedItem[0].supplier_invoice_items);
            // console.log(updatedItem[0].supplier_invoice_items.length);
            // console.log(updatedItem[0]);
            var form = document.getElementById("inputData");

              form.addEventListener("input", function () {
                  $scope.formValue=true;
              });

            // if($scope.invoicesData.fuel_charge!=$scope.testData.fuel_charge||$scope.invoicesData.invoice_level_discount!=$scope.testData.invoice_level_discount||$scope.formValue==true){
            //   DocumentSelectionService.postInvoiceDetails(postInvoiceResponse, updatedItem[0]);
            // }else{
            //   toastMessage("Oops! nothing to do ",3000);
            // }
            if(updatedItem[0].supplier_invoice_items.length){
              DocumentSelectionService.postInvoiceDetails(postInvoiceResponse, updatedItem[0]);
            }else{
              toastMessage("Oops! nothing to do ",3000);
            }

        }


        var fetchInvoiceResponseHandler = function (invoice) {
            // $scope.$broadcast('FREE');
            //console.log(invoice.supplier_invoice_items[0].supplier_item_name);
            /*if(invoice.supplier_invoice_items== undefined)
             {
               invoice.supplier_invoice_items[0].supplier_item_name = "Invoice Data Not Available"
             }*/

             // console.log(invoice);

             $scope.testData=angular.copy(invoice);
            $scope.invoicesData = invoice;


            $scope.invoicesDataToSave = {
              "fuel_charge"            :invoice.fuel_charge,
              "total_discoun"          :invoice.total_discount ,
              "total_tax"              :invoice.total_tax,
              "total_value"            :invoice.total_value ,
              "supplier_id"            :invoice.supplier_id ,
              "supplier_name"          :invoice.supplier_name ,
              "invoice_id"             :invoice.invoice_id,
              "due_date"               :invoice.due_date,
              "delivery_date"          :invoice.delivery_date ,
              "invoice_level_discount" :invoice.invoice_level_discount,
            };
            $scope.invoicesDataToSave.supplier_invoice_items=[];
            $scope.invoicesDataToSave.supplier_invoice_items=invoice.supplier_invoice_items;

            // console.log("invoice", invoice);
            _.each($scope.invoicesData.supplier_invoice_items,function(item){
              // console.log(item);
              // selectedOption
              // console.log(item.minorCategory);p_n_l_ctegory
              item.isExpanded = false;
              let myVal = (item.supplier_item_price ? item.supplier_item_price : 0) * (item.supplier_item_qty ? item.supplier_item_qty : 0);
              item.convertedVal = parseFloat(myVal.toFixed(2));
              if(item.minorCategory == '' || item.minorCategory == 'NONE')
                item.selectedOption = 'NONE';
              else
                item.selectedOption = (item.p_n_l_ctegory).toUpperCase()+'::'+(item.minorCategory).toUpperCase();

                item.isUpdated = false;
                if(item.p_n_l_ctegory==''|| item.minorCategory==''){
                    item.p_n_l_ctegory="NONE";
                    item.minorCategory="NONE";
                }
            })
            // console.log(invoice);
            // console.log($scope.invoicesData);
            // if(invoice.supplier_invoice_items)
            //   $scope.invoicesData.p_n_l_ctegory = invoice.supplier_invoice_items.p_n_l_ctegory;
            $scope.$broadcast('FREE');
            // console.log(invoice);
            $scope.setPnlAndMinorCat(invoice);
            if($scope.summary)
              showSummary();
        }
        $scope.getCatColor=function(item){
            if(item=="FOOD"){
                return "backGround-color-1"
            }else if(item=="WINE"){
                return "backGround-color-2"
            }else if(item=="BEER"){
                return "backGround-color-3"
            }else if(item=="SPIRITS"){
                return "backGround-color-4"
            }else if(item=="BEVERAGE"){
                return "backGround-color-5"
            }else if(item=="SUPPLIES"){
                return "backGround-color-6"
            }else {
                return "backGround-color-7"
            }
        }
        $scope.showCategory=function(index, item) {
            $scope.selectedItemIndex = index;
            $scope.selectedItem = item;
            $scope.PnLOptionClick(item.p_n_l_ctegory)
            $ionicModal.fromTemplateUrl('application/invoice-tracking/view/change_category.html', {
                scope: $scope,
                animation: 'slide-in-up',
                backdropClickToClose: false
            }).then(function(modal) {
                $scope.categoryModal = modal;
                $scope.categoryModal.show();
                //ionicSlideBoxDelegate.enableSlide(false);
            });
        }

                $scope.closeCategoryModal = function(model) {
                  // console.log('closeUnitPopup2Modal')
                  $scope.locationAccepted = true;
                  $scope.categoryModal.hide();
                };

                $scope.pAndLItems =[
                  {"id":1,"name":"FOOD","selected":false,"buttonStyle":"button-out"},
                  {"id":2,"name":"BEVERAGE","selected":false,"buttonStyle":"button-out"},
                  {"id":3,"name":"SUPPLIES","selected":false,"buttonStyle":"button-out"},
                  {"id":4,"name":"BEER","selected":false,"buttonStyle":"button-out"},
                  {"id":5,"name":"SPIRITS","selected":false,"buttonStyle":"button-out"},
                  {"id":6,"name":"WINE","selected":false,"buttonStyle":"button-out"}
              ];
              var chunkLength = 3;
              $scope.PnLOptionsChunks = _.chunk($scope.pAndLItems, chunkLength);
            $scope.PnLOptionClick = function (itemName) {
                _.each($scope.pAndLItems, function(item) {
                    if(item.name == itemName) {
                        item.selected = true
                        item.buttonStyle = "button-bal"
                        $scope.pnlCategory = item.name;
                    } else {
                        item.selected = false
                        item.buttonStyle = "button-out"
                    }
                })
            };
              $scope.updateCategory = function(){
                _.each($scope.invoicesDataToSave.supplier_invoice_items, function(item, index) {
                    if(index == $scope.selectedItemIndex) {
                      $scope.resData=[];
                      $scope.resData.push({
                        "supplier_item_id"                     :item.supplier_item_id ,
                        "supplier_item_name"                   :item.supplier_item_name ,
                        "supplier_item_pack_qty"               :item.supplier_item_pack_qty,
                        "supplier_item_extended_price"         :item.supplier_item_extended_price,
                        "supplier_item_qty"                    :item.supplier_item_qty,
                        "supplier_item_pack_size"              :item.supplier_item_pack_size,
                        "supplier_item_extended_price"         :item.supplier_item_extended_price ,
                        "suplier_item_measurement_id"          :item.suplier_item_measurement_id ,
                        "item_billing_measurement_id"          :item.item_billing_measurement_id,
                        "discount"                             :item.discount,
                        "deposit"                              :item.deposit,
                        "tax"                                  :item.tax,
                        "net_unit_price"                       :item.net_unit_price,
                        "billing_units "                       :item.billing_units ,
                        "p_n_l_ctegory"                        :$scope.pnlCategory,
                        "minor_category"                       :item.minorCategory
                      })
                      // console.log("$scope.resData",$scope.resData);
                      item=$scope.resData;
                        // item.p_n_l_ctegory = $scope.pnlCategory;
                      // console.log("item",item);

                    }
                })
                $scope.invoicesDataToSave.supplier_invoice_items=$scope.resData;
                // console.log("changedPnlcategory : ",$scope.invoicesData, $scope.invoicesDataToSave.supplier_invoice_items);
                var postPnlcategory = function(responseData) {
                    // console.log("responseData : ", responseData);
                    if(responseData.data.response === true) {
                        $scope.invoicesData = responseData.config.data;
                        toastMessage("PnL category changed successfully", 1500);
                        $scope.$broadcast('BUSY');
                        DocumentSelectionService.fetchInvoice(fetchInvoiceResponseHandler, $state.params.invoiceId,$state.params.supplier_id);
                    }else{
                        toastMessage("PnL category not changed", 1500);
                    }
                }
                DocumentSelectionService.postInvoiceDetails(postPnlcategory, $scope.invoicesDataToSave);
                $scope.categoryModal.hide();
                // console.log("$scope.invoicesDataToSave",$scope.invoicesDataToSave);
            }
            $scope.pnLGroups = [];
            $scope.pnLGroupedList = [];
            $scope.minorGroups = [];
            $scope.minorGroupedList = [];
            function showSummary() {
              // $scope.$broadcast('BUSY');

              // console.log('showSummary',$scope.pnLGroups);
              if(!$scope.pnLGroups.length){
                $scope.pnLGroups = _.groupBy($scope.invoicesData.supplier_invoice_items, 'p_n_l_ctegory');
                // console.log($scope.pnLGroups);
                $scope.pnLGroupedList = _.map($scope.pnLGroups , function (cat) {
                  if(cat[0]['p_n_l_ctegory'] == "NONE"){
                    return {
                        name: "Unmapped",
                        categories: cat,
                        style: 'font-weight:none'
                    }
                  }else {
                    return {
                        name: cat[0]['p_n_l_ctegory'],
                        categories: cat,
                        style: 'font-weight:none'
                    }
                  }
                });
                // console.log($scope.pnLGroupedList);
                  $scope.finalPnlTotal = 0;
                  _.forEach($scope.pnLGroupedList, function(group,i) {
                    group.totalValue = group.categories.filter(function (ele) {
                        return ele.supplier_item_extended_price !== undefined && ele.supplier_item_extended_price !== null;
                    }).map(function (ele) {

                        return ele.supplier_item_extended_price;
                    }).reduce(function (prev, cur) {
                        return prev + cur;
                    }, 0);
                    $scope.finalPnlTotal +=  group.totalValue;
                    // console.log($scope.finalPnlTotal);
                    if($scope.pnLGroupedList.length == i+1){
                      $scope.pnLGroupedList.push({
                          name: 'Total Value',
                          categories: '',
                          totalValue:$scope.finalPnlTotal,
                          style: 'font-weight:bold'
                      })
                    }
                  });
                  $scope.$broadcast('FREE');
                // console.log($scope.pnLGroupedList);
              }else {
                $scope.$broadcast('FREE');
              }

              if(!$scope.minorGroups.length){
                $scope.minorGroups = _.groupBy($scope.invoicesData.supplier_invoice_items, 'minorCategory');
                // console.log($scope.minorGroups);
                $scope.minorGroupedList = _.map($scope.minorGroups , function (cat) {
                  if(cat[0]['p_n_l_ctegory'] == "NONE"){
                    return {
                        name: "Unmapped",
                        categories: cat,
                        style: 'font-weight:none'
                    }
                  }else {
                    return {
                        name: cat[0]['minorCategory'],
                        categories: cat,
                        style: 'font-weight:none'
                    }
                  }
                });
                // console.log($scope.minorGroupedList);
                  $scope.finalMinorTotal = 0;
                  _.forEach($scope.minorGroupedList, function(group,i) {
                    group.totalValue = group.categories.filter(function (ele) {
                        return ele.supplier_item_extended_price !== undefined && ele.supplier_item_extended_price !== null;
                    }).map(function (ele) {

                        return ele.supplier_item_extended_price;
                    }).reduce(function (prev, cur) {
                        return prev + cur;
                    }, 0);
                    // console.log(group.totalValue);
                    $scope.finalMinorTotal +=  group.totalValue;
                    // console.log($scope.finalMinorTotal);
                    if($scope.minorGroupedList.length == i+1){
                      $scope.minorGroupedList.push({
                          name: 'Total Value',
                          categories: '',
                          totalValue:$scope.finalMinorTotal,
                          style: 'font-weight:bold'
                      })
                    }
                  });
                  $scope.$broadcast('FREE');
                // console.log($scope.minorGroupedList);
              }else {
                $scope.$broadcast('FREE');
              }
            }

            $scope.summary = false;
            $scope.switchTab = function(type) {
              console.log('switchTab: ',type);
              $scope.$broadcast('BUSY');

                if(type == 'Summary'){
                  $scope.Header_Title="Invoice Details - Summary"
                  $scope.summary = true;
                  // console.log($scope.invoicesData.supplier_invoice_items);
                  if($scope.invoicesData.supplier_invoice_items)
                    showSummary();
                } else {
                  $scope.summary = false;
                  $scope.Header_Title="Invoice Details"
                  if($scope.invoicesData.supplier_invoice_items)
                    $scope.$broadcast('FREE');
                }
            }


            $scope.setPnlAndMinorCat = function(getSupItems){
              // console.log(getSupItems);
                $scope.spinnerShow=false;
                $scope.supplierItems = [];
                $scope.minorCategories=[];
                $scope.minorCategories=getSupItems.minorCategories;
                $scope.optVal=[];
                $scope.groupedList = [];

                _.forEach($scope.minorCategories, function(value,i) {
                  $scope.groupedList.push({
                    "name": i,
                    "optionList": value
                  })
                });
                // console.log($scope.minorCategories);
                // console.log(getSupItems.supItems);
                // _.each(getSupItems.supItems,function(supData){
                //       var pushData = _.find($scope.supplierItems, function(o) {
                //           if(o.inventory_item_id == supData.inventory_item_id){
                //             return true;
                //           }
                //       });
                //
                //       if(!pushData){
                //         $scope.supplierItems.push(supData);
                //       }
                //   });
                //   _.each($scope.supplierItems,function(data){
		            //     // let options =[
		            //     //   	{"id":0,"name":"FOOD","selected":false,"buttonStyle":"button-out"},
		            //     //   	{"id":1,"name":"BEVERAGE","selected":false,"buttonStyle":"button-out"},
		            //     //   	{"id":2,"name":"SUPPLIES","selected":false,"buttonStyle":"button-out"},
		            //     //   	{"id":3,"name":"BEER","selected":false,"buttonStyle":"button-out"},
		            //     //   	{"id":4,"name":"SPIRITS","selected":false,"buttonStyle":"button-out"},
		            //     //   	{"id":5,"name":"WINE","selected":false,"buttonStyle":"button-out"}
		            //     // ];
                //     console.log(data);
                //
  		          //       data.selectedOption = "";
                //       data.selectedOption = (data.minorCategory).toUpperCase()+'::'+(data.profitAndLossCategory).toUpperCase();
                //
	              //       // let index = _.findIndex(options, function(opt) {
	              //       //   return opt.name === data.selectedOption.name;
	              //       // });
                //
	              //   });

          }

          // PlTrackerService.fetchPnlInvItems().then(function (data) {
          //     $scope.supplierDataInvItemResponseHandler(data);
          // });
          $scope.setInvoiceCat = function(invoiceItem){
            // console.log('********',invoiceItem)
            var CatValue=invoiceItem.selectedOption.split("::");
            $rootScope.current_selected = invoiceItem;
            $rootScope.current_selected.selectedOption = invoiceItem.selectedOption;
            $rootScope.current_selected.minorCategory= CatValue[0];
            $rootScope.current_selected.p_n_l_ctegory = CatValue[1];
            $rootScope.current_selected.isUpdated = true;
          }
          $scope.setInventory = function(inv, type, index){
               $scope.current_selected = inv;
             let btn = angular.element(document.querySelectorAll('#PnLCatInv'));
             console.log(btn);
             // let btnObj = btn[1]
             // console.log(btnObj);
              $timeout(function(){
                 angular.element(btn).triggerHandler('click');
              },200);


          }

          $scope.shoutLoud = function(newValue , oldValue){
            var CatValue=newValue.split("::");
            // console.log(CatValue);
            $scope.current_selected.selectedOption = newValue;
            $scope.current_selected.minorCategory= CatValue[0];
            $scope.current_selected.p_n_l_ctegory = CatValue[1];
            $scope.current_selected.isUpdated = true;
            // console.log($scope.current_selected);

          };

          $scope.itemEdited = function(item){
            item.isUpdated = true;
          }

          $scope.toggleGroup = function (group) {
                // if(!group.isExpanded){
                //   scope.showItemsLoading = true;
                // }
                //
                  group.isExpanded = !group.isExpanded;
                  // scope.showItemsLoading = false; // search fixed


          };
    }

})();
