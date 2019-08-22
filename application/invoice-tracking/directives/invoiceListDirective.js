(function () {
    'use strict';

    projectCostByte.directive('uploadeditems', uploadeditems);
    uploadeditems.inject = ["ionicModal", "ionicPopup", "DocumentSelectionService", "$ionicListDelegate", "Utils", "$rootScope"];
    function uploadeditems($ionicModal, $ionicPopup,  DocumentSelectionService, $ionicListDelegate, Utils, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'application/invoice-tracking/view/uploaded-items.html',
            scope: {
                invoices: '=',
                // gridModal: '=',
                filterbuttons: '=',
                // headerbarbuttons: '=',
                // supplier: '=',
            },
            link: function (scope, rootScope, element, attribute) {



                scope.getSortingClass = function () {
                    var sortingButtons = DocumentSelectionService.getButtons("SORT2");

                    var clickedButtonIndex = Utils.getIndexIfObjWithOwnAttr(sortingButtons, 'clicked', true);
                    var toggleState = "";

                    if (sortingButtons[clickedButtonIndex].toggleState) {
                        toggleState = "-";
                    }
                    // console.log(toggleState + sortingButtons[clickedButtonIndex].name);
                    return toggleState + sortingButtons[clickedButtonIndex].name;
                }

                // $rootScope.$on('MESSAGESHOW', function (event) {
                //     scope.msgShow = true;
                // });

                $ionicModal.fromTemplateUrl('image-modal.html', function (modal) {
                    scope.gridModal = modal;
                    // console.log(modal);
                }, {
                    scope: scope,
                    animation: 'slide-in-up'
                });

                scope.openModal = function (data) {
                    console.log("data: ",data);
                    scope.imgUrl =  data.status=='added' ?  data.image_url : 'img/syncing.jpg';
                    console.log(scope.imgUrl);
                    scope.gridModal.show();
                }

                scope.closeModal = function () {
                    scope.gridModal.hide();
                    scope.imgUrl = "";
                }

                var imgInvoiceResponseHandler = function(invoiceResp) {
                    console.log(invoiceResp);
                    $ionicListDelegate.closeOptionButtons();
                    // scope.$emit('UPDATEUPLOAD');
                };

                function confirmBox(callback){
                    var confirmPopup = $ionicPopup.confirm({
                      title: 'Delete',
                      template: 'Are you sure you want to delete this?'
                    });

                    confirmPopup.then(function(res) {
                      if(res)
                        callback(true);
                      else
                        callback(false);
                    });
                }


                scope.invoiceImageUpdate = function (index,inv) {
                    console.log(index);
                    confirmBox(function(sure){
                        if(sure){
                            // inv.splice(index, 1);
                          DocumentSelectionService.updateInvoiceImageStatus(imgInvoiceResponseHandler, inv.image_id);
                            scope.$emit('UPDATEUPLOAD');
                        }
                        else{
                          $ionicListDelegate.closeOptionButtons();
                        }

                    });
                };

                $rootScope.$on('UPDATEINVOICE1', function (event, data) {
                    scope.mysupplier = data;
                    // console.log("sup"+scope.mysupplier);
                    angular.forEach(scope.invoices, function(data){
                        if(scope.mysupplier == "All"){
                            data.visible = true;
                        }else if (scope.mysupplier == data.supplier_alias_name) {
                            data.visible = true;
                        } else {
                            data.visible = false;
                        }
                    });
                });


                scope.byFilterName= function () {
                    return function (item) {
                        // console.log(item.supplier_alias_name);
                        if(scope.mysupplier == "All"){
                            return true;
                        }else if (scope.mysupplier == item.supplier_alias_name) {
                            return true;
                        }
                        return false;
                    }
                };




            }
        };
    }

    projectCostByte.directive('invoicelist', invoicelist);
    invoicelist.inject = ["ionicModal", "$state", "$location", "DocumentSelectionService", "$ionicListDelegate","$ionicScrollDelegate", "Utils", "$rootScope", "$ionicPopover","ErrorReportingServiceOne",'$timeout'];
    function invoicelist($ionicModal, $state, $location, DocumentSelectionService, $ionicListDelegate, $ionicScrollDelegate,Utils, $rootScope, $ionicPopover, ErrorReportingServiceOne,$timeout) {
        return {
            restrict: 'E',
            templateUrl: 'application/invoice-tracking/view/invoice-list.html',
            scope: {
                invoices: '=',
                // gridModal: '=',
                filterbuttons: '=',
                // headerbarbuttons: '=',
                btns: '=',
                // supplier: '=',
                fetchingMore: '=',
            },
            link: function (scope, element, attribute) {
                var sortingButtons;
                var clickedButtonIndex;

                /* To set data according to selected filter */
                function setFilteredData(){
                    sortingButtons = DocumentSelectionService.getButtons("SORT1");
                    clickedButtonIndex = Utils.getIndexIfObjWithOwnAttr(sortingButtons, 'clicked', true);
                     if(sortingButtons[clickedButtonIndex].text == "By Default")
                        scope.defaultView = true;
                    else
                        scope.defaultView = false;
                    scope.$watch('invoices', function(value){
                        scope.groups = _.groupBy(scope.invoices, sortingButtons[clickedButtonIndex].name);
                        scope.groupedList = _.map(scope.groups , function (cat) {
                            return {
                                name: cat[0][sortingButtons[clickedButtonIndex].name],
                                invoices: cat,
                                type: sortingButtons[clickedButtonIndex].name
                            }
                        });
                        if(!scope.defaultView){
                          _.forEach(scope.groupedList, function(group) {
                            group.totalValue = group.invoices.filter(function (ele) {
                                return ele.total_cost !== undefined && ele.total_cost !== null;
                            }).map(function (ele) {
                                return ele.total_cost;
                            }).reduce(function (prev, cur) {
                                return prev + cur;
                            }, 0);
                          });
                        }
                    });
                }
                setFilteredData();

                scope.getSortingClass = function () {
                    // console.log(' ****** getSortingClass ***')
                    sortingButtons = DocumentSelectionService.getButtons("SORT1");
                    clickedButtonIndex = Utils.getIndexIfObjWithOwnAttr(sortingButtons, 'clicked', true);
                    if(sortingButtons[clickedButtonIndex].text == "By Default")
                        scope.defaultView = true;
                    else
                        scope.defaultView = false;


                    var toggleState = "";

                    if (sortingButtons[clickedButtonIndex].toggleState) {
                        toggleState = "-";
                    }
                    return toggleState + sortingButtons[clickedButtonIndex].name;
                }

                scope.swipeLeft = function(){
                  console.log("left");
                  scope.showBtn = true;
                }

                scope.swipeRight = function(){
                  console.log("right");
                  scope.showBtn = false;
                }

                var toggleInvoiceResponseHandler = function (toggle_response) {
                    $ionicListDelegate.closeOptionButtons();
                    scope.$emit('UPDATEINVOICE');
                };

                scope.toggleActionTaken = function (inv) {
                    inv.paid_or_not = !inv.paid_or_not;
                    var dueStatus;
                    if(inv.paid_or_not)
                        dueStatus = "paid"
                    else
                        dueStatus = "due"

                    DocumentSelectionService.updateInvoiceDueStatus(toggleInvoiceResponseHandler, inv.invoice_id, dueStatus);
                };

                $rootScope.$on('UPDATEINVOICE1', function (event, data) {
                    scope.mysupplier = data;
                    _.forEach(scope.invoices, function(data){
                        if(scope.mysupplier == "All" ){
                            data.visible = true;
                        }else if (scope.mysupplier == data.supplier_name) {
                            data.visible = true;
                        } else {
                            data.visible = false;
                        }
                    });

                    setTimeout(function(){
                        $ionicScrollDelegate.scrollTop();
                    }, 500);
                });


                scope.byFilterName= function () {
                    return function (item) {
                        if(angular.isUndefined(scope.mysupplier) || scope.mysupplier == "All"){
                            return true;
                        }else if (scope.mysupplier == item.supplier_name) {
                            return true;
                        }
                        return false;
                    }
                };




                scope.goToInvoiceDetail = function(item){
                    // console.log("Going to detail screen of invoice : "+ item.invoice_id);
                    var myElement = angular.element( document.querySelector( '#inv-list_'+item.invoice_id ) );
                    //console.log(myElement)
                   myElement.addClass('inventory-item-selected');
                    $state.go("app.invoices.detail", {'invoiceId': item.invoice_id,'supplier_id':item.supplier_id}).then(function(){
                        console.log("Reached invoice detail screen");
                    });
                }


                scope.errorReporting = function () {
                    scope.errorReportPopover.hide();
                    var item = scope.myClick;
                    // console.log(item);
                    ErrorReportingServiceOne.showErrorReportForm({
                        'page': 'invoice_tracking',
                        'component': item,
                        'modalName' : scope.errorReportPopover
                    }, {
                        'page': 'invoice_tracking',
                        'component': item
                    }) //TODO change component key to component_type in API
                        .then(function (result) {
                            //                                        console.log(result)
                        });


                }

                $ionicPopover.fromTemplateUrl('application/error-reporting/reportPopover.html', {
                    scope: scope
                })
                    .then(function (popover) {
                        scope.errorReportPopover = popover;
                    });

                scope.showReportPopover = function ($event,name) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.myClick = name;
                    scope.errorReportPopover.show($event)
                }
                let result = angular.element(document.getElementsByClassName("invoice-list-top"));
                $rootScope.$on('change-top', function (event) {
                    result[0].style.paddingTop = '0px';
                });
                $rootScope.$on('change-no-top', function (event) {
                    result[0].style.paddingTop = '70px';
                });

                scope.toggleGroup = function (group) {
                  $timeout(function () {
                    if(!group.isExpanded){
                      group.isExpanded = true;
                      group.spinnerShow = true;
                    } else {
                      group.isExpanded = !group.isExpanded;
                      group.spinnerShow = group.isExpanded;
                    }
                  })
                };
                // scope.$on('finishedInvoiceRender', function (ngRepeatFinishedEvent) {
                //   console.log("finishedInvoiceRender : ", ngRepeatFinishedEvent);
                //   var renderedIngredient = _.find(scope.invoices,function(item){
                //     return item.isExpanded == true;
                //   });
                //   renderedIngredient.spinnerShow = false;
                //   scope.spinnerShow = true;
                //   scope.invDataReceived=true;
                // });

                scope.$on('FILTERBUTTONCLICKED', function (event) {
                    // console.log('FILTERBUTTONCLICKED');
                    setFilteredData()
                });

            }
        };
    }


    projectCostByte.directive('summarydata', summarydata);
    summarydata.inject = ["ionicModal", "DocumentSelectionService", "$ionicListDelegate", "Utils", "$rootScope"];
    function summarydata($ionicModal, DocumentSelectionService, $ionicListDelegate, Utils, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'application/invoice-tracking/view/summary-data.html',
            scope: {
                invoices: '=',
                // gridModal: '=',
                filterbuttons: '=',
                // headerbarbuttons: '=',
                // supplier: '=',
            },
            link: function (scope, rootScope, element, attribute) {


                var toggleInvoiceResponseHandler = function (toggle_response) {
                    console.log(toggle_response);
                    $ionicListDelegate.closeOptionButtons();
                    scope.$emit('UPDATEINVOICE');
                };

                $rootScope.$on('UPDATEINVOICE1', function (event, data) {
                    scope.mysupplier = data;

                    angular.forEach(scope.invoices, function(data, index){
                        if(scope.mysupplier == "All"){
                            data.visible = true;
                        }else if (scope.mysupplier == data.supplier_name) {
                            data.visible = true;
                        } else {
                            data.visible = false;
                        }

                        if(index+1 === scope.invoices.length) {
                            var scroll = angular.element('#inv_0');
                            console.log(scroll);
                            scroll.scrollIntoView();
                        }
                    });
                });


                scope.getUrl = function(source){
                  return source.due_date ? '#/invoices/tracking/'+source.invoice_id : '#' ;
                }


                scope.byFilterName= function () {
                    return function (item) {
                        // console.log(item.supplier_name);
                        if(scope.mysupplier == "All"){
                            return true;
                        }else if (scope.mysupplier == item.supplier_name) {
                            return true;
                        }
                        return false;
                    }
                };


                scope.toggleActionTaken = function (inv) {
                    inv.paid_or_not = !inv.paid_or_not;
                    var dueStatus;
                    if(inv.paid_or_not)
                        dueStatus = "paid"
                    else
                        dueStatus = "due"

                    DocumentSelectionService.updateInvoiceDueStatus(toggleInvoiceResponseHandler, inv.invoice_id, dueStatus);
                };

            }
        };
    }

    projectCostByte.directive('onFinishRender', onFinishRender);
       onFinishRender.inject = ["$timeout"];
       function onFinishRender($timeout) {
         return {
           restrict: 'A',
           link: function (scope, element, attr) {
             //  console.log("here");
               if (scope.$last === true) {
                     $timeout(function () {
                         scope.$emit(attr.onFinishRender);
                     });
               }
           }
         }
       }

    projectCostByte.directive('hideTabs', hideTabs);
    hideTabs.inject = ["$rootScope"];
    function hideTabs($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = value;
                });

                scope.$on('$destroy', function() {
                    $rootScope.hideTabs = false;
                });
            }
        };
    };

})();
