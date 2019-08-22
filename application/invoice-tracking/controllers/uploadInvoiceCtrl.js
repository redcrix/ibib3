(function () {
    'use strict'
    projectCostByte.controller('InvoiceUploadsCtrl', invoiceUploadsCtrl);

    invoiceUploadsCtrl.$inject = ['$q', '$scope', '$state', '$window', '$location', '$ionicSideMenuDelegate',
            '$rootScope', 'CommonService', 'CommonConstants', 'Utils', '$cordovaCamera', '$cordovaFileTransfer',
        'DocumentSelectionService', '$ionicLoading', '$ionicPopup', '$ionicActionSheet', '$ionicModal', '$timeout', '$cordovaImagePicker',
'$interval','$filter'
        ];

    function invoiceUploadsCtrl($q, $scope, $state, $window, $location, $ionicSideMenuDelegate, $rootScope,
        CommonService, CommonConstants, Utils, $cordovaCamera, $cordovaFileTransfer,
        DocumentSelectionService, $ionicLoading, $ionicPopup, $ionicActionSheet, $ionicModal, $timeout, $cordovaImagePicker, $interval,$filter) {

        var cameraDb = new PouchDB('invoice_camera');
        var checkForUploadFailuresTimer = '';
        $scope.cameraDone = false;

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
        var supplierListData;
        $rootScope.$on('suppliersPageUpdate', function(event) {
          if (supplierListData)
            fetchSuppliersResponseHandlerSup(supplierListData);
        });
        function getSupplierList() {
          DocumentSelectionService.fetchSuppliers().then(function(suppliers) {
            //DocumentSelectionService.fetchSuppliers(function(suppliers){
            //   console.log(suppliers);
            supplierListData = suppliers;
            // console.log("suppliers",suppliers);

            fetchSuppliersResponseHandlerSup(suppliers);
            // $rootScope.$broadcast('suppliers', $scope.supplierList);
          });
        }
         function fetchSuppliersResponseHandlerSup(supplierList) {
          var customSupplier = [];

          angular.forEach(supplierList, function(datas, index) {
            if (index == 0) {
              customSupplier.push({
                "supplier_alias_name": "All",
                "supplier_name": "All",
                "selected": true
              })
            }
            if (datas.supplier_alias_name !== "VOID" && datas.supplier_alias_name !== "" && datas.supplier_name !== "") {
              datas.selected = false;
              customSupplier.push(datas);
            }
          });

          var selectedIndex = Utils.getIndexIfObjWithOwnAttr(customSupplier, 'selected', true);

          $scope.selectedSupplierName = $rootScope.filteredSup ? $rootScope.filteredSup : customSupplier[selectedIndex]["supplier_alias_name"];
          $scope.selectedSupplierAliasName = $rootScope.filteredSup ? $rootScope.filteredSup : customSupplier[selectedIndex]["supplier_alias_name"];

          // console.log('$scope.selectedSupplierName2: ',$scope.selectedSupplierName);
          // if($scope.filteredSup)
          //   $rootScope.$emit('UPDATEINVOICE1', $scope.selectedSupplierName)
          // console.log($scope.filteredSup);
          //console.log(scope.selectedSupplierName);
          //scope.$emit('SUPPLIER',scope.selectedSupplierName);
          // $timeout(function() {
          //   $rootScope.$emit('UPDATEINVOICE1', $scope.selectedSupplierName)
          // });

          $scope.showMenus = function() {
            console.log("showMenus function called" )
            $scope.menu_click = true;
            var suppliers = customSupplier;
            var action_sheet_definition = {
              buttons: [], //         destructiveText: 'Delete',
              titleText: '<h4>Select Supplier</h4>',
              cancelText: 'Cancel',
              cancel: function() {
                $scope.menu_click = false;
              },
              buttonClicked: function(index) {
                // change menu here

                $scope.selectedSupplierName = customSupplier[index].supplier_name;
                $scope.selectedSupplierAliasName = customSupplier[index].supplier_alias_name;
                $rootScope.filteredSup = customSupplier[index].supplier_alias_name;
                // console.log('$scope.selectedSupplierName1: ',$scope.selectedSupplierName);
                // console.log('$scope.filteredSup: ',$scope.filteredSup);
                $timeout(function() {
                  $rootScope.$emit('UPDATEINVOICE1', $scope.selectedSupplierAliasName)
                });
                $scope.menu_click = false;
                customSupplier[selectedIndex]["selected"] = false;
                // }

                hideSheet();
              }
            }
            for (var i = 0; i < suppliers.length; i++) {
              if(suppliers[i]["supplier_name"]){
                action_sheet_definition.buttons.push({
                  // 'text': $filter('titleCase')(suppliers[i]["supplier_alias_name"])
                  'text': $filter('titleCase')(suppliers[i]["supplier_name"])
                  //                                                    +'('+  menus[i]['date']+')'
                })
              }
            }
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show(action_sheet_definition);
            var myEl = angular.element(document.querySelector('.action-sheet-group'));
            // console.log(myEl);
            myEl.css('overflow-y', 'scroll');
            myEl.css('max-height', ($window.innerHeight - 50) + 'px');
          }

        }
         $timeout(getSupplierList, 0);

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            //you also get the actual event object
            //do stuff, execute functions -- whatever...
            //            console.log("load finish");
            $scope.msgShow = true;
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
            sendUid(u);
        }

        function checkForUploadFailures() {
            //  start interval and assign it to global variable checkForUploadFailuresTimer
            $interval.cancel(checkForUploadFailuresTimer);
            console.log('Check Failure')
            checkForUploadFailuresTimer = $interval(function () {
                //            console.log('@@@time interval@@@');
                DocumentSelectionService.checkFailureNew(function (failureStatus) {
                    console.log('failureStatus :' + failureStatus);
                    $scope.doRefresh(failureStatus);
                });
            }, 3000, 50);
        }

        $scope.initializeUploadView = function () {
            $scope.msgShow = false;
            $scope.navBarTitle.showToggleButton = true;
            $scope.inventorySheetType = "inventory_sheet";
            $scope.invoiceType = "invoice";
            // $scope.suppliers = [];


            $scope.data = {};
            $scope.data.invoicesList = [];
            $scope.data.suppliers = [];


            $ionicModal.fromTemplateUrl('application/invoice-tracking/view/supplier-modal.html', {
                scope: $scope,
                animation: 'slide-in-up',
                backdropClickToClose: false
            }).then(function (modal) {
                $scope.supplier_modal = modal;
                $scope.buttonName = "myPromptCamera";
            });

            $rootScope.$broadcast('suppliersPageUpdate');
            fetchSheetData();

            // $rootScope.checkImageSync = setInterval(function(){
            //   DocumentSelectionService.insertCamImg(function(job){
            //       console.log("job done: "+job);
            //       // alert("job "+job);
            //       $scope.doRefresh();
            //   });
            //   // DocumentSelectionService.checkGalleryFailure();
            // }, 7000);


            // console.log(moment().unix());
        }

        // gets invoices from server . run only once on init
        var fetchSheetData = function () {
            $scope.$broadcast('BUSY');

            var promises = [DocumentSelectionService.fetchSuppliers(), DocumentSelectionService.fetchUploadedInvoices()];

            $q.all(promises).then((values) => {

                $q.all([fetchSuppliersResponseHandler(values[0]),
                        fetchInvoicesResponseHandler(values[1])])
                .then(function(res){
                    $scope.$broadcast('FREE');
                    checkForUploadFailures();
                })


            });
        }

        // $scope.items = ['Item 1', 'Item 2', 'Item 3'];
        $scope.doRefresh = function (startFailureCheck) {
            console.log('Refreshing!',$scope.selectedSupplierName);

            $scope.cameraDone = false;
            var promises = [DocumentSelectionService.fetchForceUploadedInvoices()];

            $q.all(promises).then((values) => {
                fetchInvoicesResponseHandler(values[0]).then(function(res){
                    $timeout(function () {
                        $scope.$broadcast('scroll.refreshComplete');
                        // DocumentSelectionService.checkFailureNew(function(status){
                        //     console.log("uploading failed images"+ status);
                        //     console.log("done uploading");
                        // });
                        if (startFailureCheck) {
                            checkForUploadFailures();
                        }

                    }, 500);
                })
            });

        };

        var statusToDisplay = {
            'requestsent': 'Pending Upload',
            'added': 'Synced to Pepr',
            'savedlocally': 'Saved Locally'
        }

        var addSupplierNamesToInvoicesAndDisplay = function (invoices) {
            // console.log('invoices: ',invoices);
            var finalInvoices = [];
            var suppliers = _.keyBy($scope.data.suppliers, 'supplier_id');

            _.forEach(invoices, function (invoice, index) {
                if (_.has(suppliers, invoice.supplier_id)) {
                    var supplier = suppliers[invoice.supplier_id]
                    invoice.supplier_name = supplier.supplier_name;
                    invoice.supplier_alias_name = supplier.supplier_alias_name;
                    invoice.visible = true;
                    invoice.displayStatus = _.get(statusToDisplay, _.toLower(invoice.status), 'Processing')
                    finalInvoices.push(invoice);
                }
            });

            $scope.data.invoicesList = finalInvoices;

            if(!$scope.data.invoicesList.length)
              $rootScope.$broadcast('MESSAGESHOW');

            $rootScope.$broadcast('suppliersPageUpdate');
            //            console.log("invoices " + $scope.data.invoicesList.length);
        }

        var fetchInvoicesResponseHandler = function (invoices) {

            return $q(function (resolve, reject) {
                //            console.log('fetchInvoicesResponseHandler');
                //            console.log(invoices);
                invoices = invoices ? invoices : [];
                addSupplierNamesToInvoicesAndDisplay(invoices);

                $scope.invoices = invoices;
                // $scope.invoices = [];
                cameraDb.allDocs({
                    include_docs: true
                    // , attachments: true
                }).then(function (result) {
                    // handle result
                    if (result.rows.length > 0) {
                        var cntAllData = 0;
                        console.log('Local images count: '+ result.rows.length)
                        async.eachSeries(result.rows, function (item, callback1) {

                            cntAllData++;
                            //  DocumentSelectionService.readLocalInvoiceFile(item.doc._id).then(
                                //  function (local_image) {

                                    if (_.findIndex($scope.invoices, ['image_id',item.doc._id ]) == -1){
                                    // console.log('item: ',item);
                                        var pdbGalleryInvoice = {
                                            'image_id': item.doc._id,
                                            //  'image_url': 'data:image/png;base64,' + item.doc.image,
                                            // 'image_url': 'data:image/png;base64,' + local_image,
                                            'image_url': '',
                                            // 'status' : 'Saved Locally',
                                            'status': item.doc.status,
                                            // 'status' : 'Saved Locally',
                                            'created_at': item.doc.time,
                                            'supplier_id': item.doc.supplier_id
                                        }

                                        console.log('Adding local image to list' + item.doc._id)
                                        $scope.invoices.push(pdbGalleryInvoice);
                                        // console.log("inv cntAllData" + $scope.invoices.length);
                                    }

                                    if (result.rows.length == cntAllData) {
                                        // console.log('last record');
                                        // console.log('*******', $scope.invoices.length);
                                        addSupplierNamesToInvoicesAndDisplay($scope.invoices);
//                                        $scope.$broadcast('FREE');
                                          resolve('FREE')
                                    } else {
                                        callback1();
                                    }
                            // })
                        });
                    } else {
                          // $scope.$broadcast('FREE');
                          resolve('FREE')
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            });
        }

        var finalInvoice = [];

        function finalSetInvoices(setInvoices) {
            angular.forEach(setInvoices, function (inv, index) {
                // console.log(inv);
                angular.forEach($scope.data.suppliers, function (sup) {
                    if (inv.supplier_id === sup.supplier_id) {
                        inv.supplier_name = sup.supplier_name;
                        inv.supplier_alias_name = sup.supplier_alias_name;
                        inv.visible = true;
                        finalInvoice.push(inv);
                    }
                });
                if (index == setInvoices.length - 1) {

                    $scope.data.invoicesList = finalInvoice;
                    $scope.$broadcast('FREE');
                }
            });
        }

        var fetchSuppliersResponseHandler = function (suppliers) {
            return $q(function (resolve, reject) {
                // console.log(suppliers);
                var suppliers_cleaned = _.filter(suppliers, function (sup) {
                    return sup.supplier_alias_name !== "VOID" && sup.supplier_alias_name !== "";
                });

                suppliers_cleaned.push({
                    'supplier_alias_name': "New Supplier",
                    'supplier_id': "unknownsupplier",
                    'supplier_name': "New Supplier"
                },
                {
                    'supplier_alias_name': "Inventory",
                    'supplier_id': "unknownsupplier",
                    'supplier_name': "Inventory"
                }
                )

                $scope.data.suppliers = suppliers_cleaned
    //            console.log($scope.data.suppliers);
//                $scope.$broadcast('FREE');
                  resolve('FREE')
            });
        }

        $scope.invoiceButtons = [{
                'label': 'Camera',
                'name': 'myCamera',
                'icon': 'ion-camera',
        },
      ];

        // var confirmPopup;
        $scope.updatedItem = function (newValuea, oldValue) {
            console.log("select");
            $scope.mySupplier = newValuea;
            // $scope.supplier_modal.show();
        };

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
//                console.log(type);
                if (!type) {
                    callback(false, $scope.mySupplier);
                } else {
                    callback(true, $scope.mySupplier);
                }
            };

            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.supplier_modal.remove();
                console.log("destroy");
            });

            // Execute action on hide modal
            $scope.$on('modal.hidden', function () {
                // Execute action
                console.log("hidden");
            });

            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
                console.log("removed");
            });
        }

        $scope.myCaptureImages = [];

        $scope.takePhoto = function (imageType, supplier) {
            console.log('Take Photo');
//            console.log(imageType);
//            console.log(supplier);
            // clear interval
//            clearInterval(checkForUploadFailuresTimer);
            $interval.cancel(checkForUploadFailuresTimer);
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                targetWidth: 1600,
                targetHeight: 1000,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };

            DocumentSelectionService.camera(options).then(function (imageData) {
                // $scope.$broadcast('UPLOAD');
                console.log('Photo taken. Saving image locally')
                generateUUID(function (uid) {
                    console.log('UNIQUE..: ' + uid);

                    // save image to data directory using uid
                    DocumentSelectionService.saveInvoiceImage(imageData, 'invoiceCamera_' + uid)
                        .then(function (saveResponse) {
                            console.log('Image saved locally')


                        })

                    console.log('Adding entry to pouchdb')
                    var saveCamera = {
                            '_id': 'invoiceCamera_' + uid,
                            //                    'image' : imageData,
                            'imageType': imageType,
                            'supplier_id': supplier.supplier_id,
                            'time': moment().unix(),
                            'status': 'savedLocally'
                        }

                        cameraDb.put(saveCamera).then(function (response) {
                            // alert(response);
//                                console.log('Put Response: ' + JSON.stringify(response));
                            if (response.ok) {
                                console.log("Entry saved in pdb");
                            }
                        });


                });

                confirmBox(supplier, function (sure, newSupplier) {

//                    console.log("confirmBox", sure, newSupplier);
                    DocumentSelectionService.insertCamImg(function (status) {
//
//                        console.log("uploading " + status);
//                        console.log("done uploading");
//                        // if($scope.cameraDone){
//                        //   $scope.doRefresh();
//                        // }
//
                    });
                    if (sure) {
                        console.log('User chose to take another photo')
                        $timeout(function () {
                            $scope.takePhoto(imageType, newSupplier);
                        }, 500);
                    } else {
                        console.log("Finished taking photos");
                        $scope.cameraDone = true;
//                        DocumentSelectionService.insertCamImg(function (status) {});
//                        $scope.doRefresh(true);
                        $timeout(function(){$scope.doRefresh(true)}, 500)
                        $timeout(function(){$scope.doRefresh(true)}, 5000)
                        // do refresh will again start interval

                        // checkForUploadFailuresTimer = setInterval(function(){
                        //   console.log('@@@time interval@@@');
                        //   checkForUploadFailures();
                        // }, 3000);
                        // fetchSheetData();
                    }
                });
            });
        }


        function getImageData(results, supplier, imageType, callback) {
            var cnt = 0;
            async.eachSeries(results, function (item, callback1) {
                cnt++;
                window.plugins.Base64.encodeFile(item, function (imageData) {
                    // console.log('file base64 encoding: ' + JSON.stringify(imageData));
                    console.log("Got the image");
                    var newImageData = imageData.split('base64,');
                    // console.log('NewBase64: '+newImageData[1]);

                    generateUUID(function (uid) {
                        console.log('GALLERY UNIQUE..: ' + uid);
                        // save image to data directory using uid
                        DocumentSelectionService.saveInvoiceImage(newImageData[1], 'invoiceGallery_' + uid)
                            .then(function (saveResponse) {
                                console.log(saveResponse)
                            })

                        var saveCamera = {
                            '_id': 'invoiceGallery_' + uid,
                            //                      'image' : newImageData[1],
                            'imageType': imageType,
                            'supplier_id': supplier.supplier_id,
                            'time': moment().unix(),
                            'status': 'savedLocally'

                        }

                        // save gallery image to pouchdb
                        DocumentSelectionService.insertGalleryImg(saveCamera, function (storedStatus) {
                            if (storedStatus) {
                                console.log('gallery image stored');
                                console.log('put Gallery length: ' + results.length);
                                console.log('put Gallery: ' + cnt);

                                if (results.length == cnt) {
                                    console.log('if last gallery img stored');
                                    callback(true);
                                    DocumentSelectionService.uploadGalleryImage(function (galleryStatus) {
                                        if (galleryStatus) {
                                            fetchSheetData();
                                        }
                                    });
                                } else {
                                    callback1();
                                }

                            } else {
                                callback1();
                                console.log('gallery image not stored');
                                if (results.length == cnt) {
                                    console.log('if last gallery img');
                                    callback(true);
                                    DocumentSelectionService.uploadGalleryImage(function (galleryStatus) {
                                        if (galleryStatus) {
                                            fetchSheetData();
                                        }
                                    });
                                } else {
                                    callback1();
                                }
                            }
                        });

                    });
                });
            });
        }


        $scope.choosePhoto = function (imageType, supplier) {
            // multiple

            var options1 = {
                maximumImagesCount: 10,
                width: 2000,
                height: 2000,
                quality: 100,
            };

            $cordovaImagePicker.getPictures(options1)
                .then(function (results) {
                    if (results.length > 0) {
                        $scope.$broadcast('UPLOAD');
                        getImageData(results, supplier, imageType, function (status) {
                            console.log("done");
                            if (status) {
                                $scope.$broadcast('SUCCESS');
                                fetchSheetData();
                            }
                        });
                    }
                });
        }



        $scope.showSortingActionsheet = function () {
            $ionicActionSheet.show({
                titleText: 'Sorting',
                buttons: DocumentSelectionService.getButtons("SORT2"),
                cancelText: 'Cancel',
                cancel: function () {},
                buttonClicked: function (index) {
                    DocumentSelectionService.setButtonClicked("SORT2", index);
                    return true;
                }
            });
        };

        $scope.showAddingInvoiceActionsheet = function () {
            $ionicActionSheet.show({
                titleText: 'Add invoice',
                buttons: DocumentSelectionService.getButtons("CAMERA"),
                cancelText: 'Cancel',
                cancel: function () {
                    console.log('CANCELLED');
                },
                buttonClicked: function (index) {
                    if (index == 0) {
                        angular.element(document.querySelectorAll('#myCamera')).triggerHandler('click');
                    } else if (index == 1) {
                        angular.element(document.querySelectorAll('#myGallery')).triggerHandler('click');
                    }
                    return true;
                }
            });
        };

        $scope.showCamera = function (myClick) {

            angular.element(document.querySelectorAll('#' + myClick)).triggerHandler('click');

            var myEl;
//            console.log(myClick);

            if (myClick == "myCamera")
                myEl = angular.element(document.querySelector('.camera-set > .scroll-content'));
            else if (myClick == "myPromptCamera")
                myEl = angular.element(document.querySelector('.camera-set-prompt > .scroll-content'));
            else if (myClick == "myGallery")
                myEl = angular.element(document.querySelector('.gallery-set > .scroll-content'));
            else if (myClick == "myPromptGallery")
                myEl = angular.element(document.querySelector('.gallery-set-prompt > .scroll-content'));

            // console.log(myEl, $window.innerHeight);
            myEl.css('max-height', ($window.innerHeight - 80) + 'px');
            myEl.css('overflow-y', 'scroll');

        };

        $scope.$on('UPDATEUPLOAD', function (event) {
            $scope.$broadcast('BUSY');
            fetchSheetData();
        });

    }

})();
