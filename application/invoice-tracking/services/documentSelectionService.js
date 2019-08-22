(function () {
    'use strict';

    projectCostByte.factory('DocumentSelectionService', documentSelectionService);

    documentSelectionService.$inject = ['$q', 'CommonService', 'Utils', '$cordovaFile'];

    var cameraDb = new PouchDB('invoice_camera');

    // cameraDb.destroy().then(function (response) {
    // // success
    // }).catch(function (err) {
    // console.log(err);
    // });

    function documentSelectionService($q, CommonService, Utils, $cordovaFile) {

        var documentSelectionServiceFactory = {
            uploadImage: uploadImage,
            getUploadedImages: getUploadedImages,
            fetchSuppliers: fetchSuppliers,
            fetchMeasurements: fetchMeasurements,
            fetchUploadedInvoices: fetchUploadedInvoices,
            fetchForceUploadedInvoices: fetchForceUploadedInvoices,
            fetchSupplierInvoices: fetchSupplierInvoices,
            fetchPurchaseTrend: fetchPurchaseTrend,
            getButtons: getButtons,
            setButtonClicked: setButtonClicked,
            addInvoice: addInvoice,
            updateInvoiceDueStatus: updateInvoiceDueStatus,
            updateInvoiceImageStatus: updateInvoiceImageStatus,
            fetchInvoice: fetchInvoice,
            camera: getPicture,
            insertCamImg: insertCamImg,
            checkFailure: checkFailure,
            checkFailureNew: checkFailureNew,
            checkGalleryFailure: checkGalleryFailure,
            insertGalleryImg: insertGalleryImg,
            uploadGalleryImage: uploadGalleryImage,
            getPdbData: getPdbData,
            getGalleryPdbData: getGalleryPdbData,
            saveInvoiceImage: saveInvoiceImage,
            readLocalInvoiceFile: readLocalInvoiceFile,
            fetchPurchaseSummary: fetchPurchaseSummary,
            postInvoiceDetails: postInvoiceDetails,
            fetchInvoiceConfigItems: fetchInvoiceConfigItems
        }

        // get gallery image data from pouchdb
        function getGalleryPdbData(sendPdbData) {
            cameraDb.allDocs({
                include_docs: true,
                startkey: "invoiceGallery_",
                endkey: "invoiceGallery_\uffff"
            }).then(function (res) {
                // console.log('Req Send: ',res.rows[0]);
                sendPdbData(res);
            });
        }

        function getPdbData(sendPdbData) {
            cameraDb.allDocs({
                include_docs: true,
                startkey: "invoiceCamera_",
                endkey: "invoiceCamera_\uffff"
            }).then(function (res) {
                // console.log('Req Send: ',res.rows[0]);
                sendPdbData(res);
            });
        }

        // check whether any image failed to sync with server or not
        function checkFailure(cbFailure) {
            console.log('checkFailure');
            getPdbData(function (res) {

                // console.log('length: ',res.rows.length);
                if (res.rows.length > 0) {
                    // console.log('chkFailureRes: ',res);
                    var cnt = 0;
                    async.eachSeries(res.rows, function (item, callback1) {
                        cnt++;
                        console.log(item.doc);
                        updatePdb('requestSent', item.doc, function (gotStatus) {
                            if (item.doc.status == 'failed' || item.doc.status == 'savedLocally') {
                                console.log('got failure resend to upload');
                                // uploadImage(item.doc.image, item.doc.imageType, function(imageUrl, imageId, uploadedTimeEpoch) {
                                uploadImageNew(item.doc._id, item.doc.imageType, function (imageUrl, imageId, uploadedTimeEpoch) {
                                    console.log(imageUrl);
                                    console.log(imageId);
                                    console.log(uploadedTimeEpoch);

                                    var requestPayload = {
                                        "supplier_id": item.doc.supplier_id,
                                        "image_id": imageId,
                                        "image_url": imageUrl
                                    };
                                    // console.log(requestPayload);

                                    addInvoice(requestPayload, function (data) {
                                    // console.log("TESTTT in Failure case: " + JSON.stringify(data));

                                        if (data.status == 200) {
                                            console.log('reDelete img from Pdb');
                                            console.log(item.doc);

                                            deleteLocalInvoiceFile(item.doc._id).then(function (deleteResponse) {
                                                // console.log(deleteResponse)
                                            })


                                            cameraDb.allDocs({
                                                include_docs: true,
                                                startkey: "invoiceCamera_",
                                                endkey: "invoiceCamera_\uffff"
                                            }).then(function (response) {
                                                // // console.log('RES....',res);
                                                console.log(response.rows[0].doc);

                                                cameraDb.remove(response.rows[0].doc).then(function (result) {
                                                    // handle result
                                                    console.log("reDELETE res: " + JSON.stringify(result));
                                                    if (res.rows.length + 1 == cnt) {
                                                        console.log('last record');
                                                        cbFailure(true);
                                                    } else {
                                                        callback1();
                                                    }

                                                }).catch(function (err) {
                                                    console.log(err);
                                                    if (res.rows.length + 1 == cnt) {
                                                        console.log('last record in catch');
                                                        cbFailure(false);
                                                    } else {
                                                        callback1();
                                                    }
                                                });
                                            });

                                        } else {
                                            updatePdb('failed', item.doc, function (gotStatus) {});
                                            if (res.rows.length + 1 == cnt) {
                                                console.log('last record in failed');
                                                cbFailure(false);
                                            } else {
                                                callback1();
                                            }
                                        }
                                    });


                                });
                            }
                        });


                    });
                }
            });
        }


        function checkFailureNew(uploadImageCB) {
            // console.log('checkFailureNew');
            cameraDb.allDocs({
                include_docs: true,
                startkey: "invoiceCamera_",
                endkey: "invoiceCamera_\uffff"
            }).then(function (res) {
                var cntDelPdb = 0;
                // alert("I m here "+res.rows.length);
                if (res.rows.length) {
                    async.eachSeries(res.rows, function (item, callbackDelPdb) {
                        cntDelPdb++;
                        //console.log("STATUS" + item.doc.status);
                        //console.log("cntDelPdb" + cntDelPdb);
                        if (item.doc.status == "failed"  || item.doc.status == 'savedLocally') {
                            console.log('if savedLocally or failed');
                            updatePdbClone('requestSent', item.doc, function (gotStatus) {
                                if (gotStatus) {
                                    // uploadImage(item.doc.image, item.doc.imageType, function(imageUrl, imageId, uploadedTimeEpoch) {
                                    uploadImageNew(item.doc._id, item.doc.imageType, function (imageUrl, imageId, uploadedTimeEpoch) {
                                        // console.log(imageUrl);
                                        // console.log(imageId);
                                        // console.log(uploadedTimeEpoch);
                                        var requestPayload = {
                                            "supplier_id": item.doc.supplier_id,
                                            "image_id": imageId,
                                            "image_url": imageUrl
                                        };

                                        addInvoice(requestPayload, function (data) {
                                            // console.log("TESTTT: " + JSON.stringify(data));
                                            if (data.status == 200) {

                                                deleteLocalInvoiceFile(item.doc._id).then(function (deleteResponse) {
                                                    // console.log(deleteResponse)
                                                });

                                                cameraDb.get(item.doc._id).then(function (doc) {
                                                    cameraDb.remove(doc);
                                                    if (res.rows.length == cntDelPdb)
                                                        uploadImageCB(true);
                                                    else
                                                        callbackDelPdb();
                                                });
                                            } else {
                                                updatePdbClone('failed', item.doc, function (gotStatus) {
                                                    if (gotStatus) {
                                                        if (res.rows.length == cntDelPdb)
                                                            uploadImageCB(true);
                                                        else
                                                            callbackDelPdb();
                                                    } else {
                                                        console.log("error in updating status");
                                                        if (res.rows.length == cntDelPdb)
                                                            uploadImageCB(true);
                                                        else
                                                            callbackDelPdb();
                                                    }
                                                });
                                            }
                                        });
                                    });
                                } else {
                                    console.log("error in updating status");
                                    if (res.rows.length == cntDelPdb)
                                        uploadImageCB(true);
                                    else
                                        callbackDelPdb();
                                }
                            });
                        } else if (item.doc.status == 'requestSent') {
                            console.log('else if requestSent' + (moment().unix() - item.doc.time));

                            if ((moment().unix() - item.doc.time) > 30) {
                                updatePdbClone('failed', item.doc, function (gotStatus) {
                                    if (gotStatus) {
                                        if (res.rows.length == cntDelPdb)
                                            uploadImageCB(true);
                                        else
                                            callbackDelPdb();
                                    } else {
                                        console.log("error in updating status");
                                        if (res.rows.length == cntDelPdb)
                                            uploadImageCB(true);
                                        else
                                            callbackDelPdb();
                                    }
                                });
                            } else {
                                if (res.rows.length == cntDelPdb)
                                    uploadImageCB(true);
                                else
                                    callbackDelPdb();
                            }

                        } else {
                            if (res.rows.length == cntDelPdb)
                                uploadImageCB(true);
                            else
                                callbackDelPdb();
                        }
                    });
                } else {
                    // console.log("No pouchDB records");
                }
            });
        }


        function checkGalleryFailure() {
            console.log('checkGalleryFailure');
            getGalleryPdbData(function (res) {

                // console.log('length: ',res.rows.length);
                if (res.rows.length > 0) {
                    // console.log('chkFailureRes: ',res);
                    var cnt = 0;
                    async.eachSeries(res.rows, function (item, callback1) {
                        cnt++;
                        console.log(item.doc);
                        if (res.rows.length + 1 == cnt) {
                            console.log('last record');
                        } else {
                            if (item.doc.status == 'failed' || item.doc.status == 'savedLocally') {
                                console.log('resend to upload');
                                // uploadImage(item.doc.image, item.doc.imageType, function(imageUrl, imageId, uploadedTimeEpoch) {
                                uploadImageNew(item.doc._id, item.doc.imageType, function (imageUrl, imageId, uploadedTimeEpoch) {
                                    // console.log(imageUrl);
                                    // console.log(imageId);
                                    // console.log(uploadedTimeEpoch);
                                    updatePdb('requestSent', item.doc, function (gotStatus) {
                                        var requestPayload = {
                                            "supplier_id": item.doc.supplier_id,
                                            "image_id": imageId,
                                            "image_url": imageUrl
                                        };
                                        // console.log(requestPayload);

                                        addInvoice(requestPayload, function (data) {
                                            // console.log("TESTTT: "+JSON.stringify(data));

                                            if (data.status == 200) {
                                                console.log('reDelete img from Pdb');
                                                console.log(item.doc);

                                                deleteLocalInvoiceFile(item.doc._id).then(function (deleteResponse) {
                                                    // console.log(deleteResponse)
                                                });
                                                cameraDb.allDocs({
                                                    include_docs: true,
                                                    startkey: "invoiceGallery_",
                                                    endkey: "invoiceGallery_\uffff"
                                                }).then(function (response) {
                                                    // console.log('RES....', response);
                                                    // console.log(response.rows[0].doc);
                                                    // if(response.rows.length > 0){
                                                    cameraDb.remove(response.rows[0].doc).then(function (result) {
                                                        // handle result
                                                        console.log("reDELETE res: ", result);
                                                        callback1();
                                                    }).catch(function (err) {
                                                        console.log(err);
                                                        callback1();
                                                    });
                                                    // }

                                                });

                                            } else {
                                                updatePdb('failed', item.doc, function () {});
                                                callback1();
                                            }
                                        });
                                    });

                                });
                            }
                        }
                    });
                }
            });
        }

        function updatePdb(setStatus, datas, sendstatus) {
            console.log('**************updatePdb**' + setStatus);
            cameraDb.allDocs({
                include_docs: true,
                startkey: "invoiceCamera_",
                endkey: "invoiceCamera_\uffff"
            }).then(function (res) {
                console.log('Req Send: ', res.rows[0]);
                getPdbData(function (res) {
                    var cntPdb = 0;
                    async.eachSeries(res.rows, function (item, callbackPdb) {
                        cntPdb++;
                        console.log('Lenght: ' + res.rows.length);
                        console.log('cntrrr: ' + cntPdb);
                        if (res.rows.length == cntPdb) {
                            console.log('last record in update');
                            sendstatus(true);
                        } else {
                            console.log('update Req Send: ', item);

                            var dataToUpdate = {
                                '_id': item.doc._id,
                                'image': item.doc.image,
                                'imageType': item.doc.imageType,
                                'supplier_id': item.doc.supplier_id,
                                'status': setStatus,
                                'time': moment().unix(),
                                // 'time1':moment(new Date()).format(),
                                '_rev': item.doc._rev

                            }
                            // console.log('dataToUpdate: '+JSON.stringify(dataToUpdate._id));
                            // console.log('imageType: '+JSON.stringify(dataToUpdate.imageType));
                            // console.log('supplier_id: '+JSON.stringify(dataToUpdate.supplier_id));
                            // console.log('status: '+JSON.stringify(dataToUpdate.status));
                            // console.log('time: '+JSON.stringify(dataToUpdate.time));
                            // console.log('_rev: '+JSON.stringify(dataToUpdate._rev));
                            cameraDb.put(dataToUpdate).then(function (updateResp) {
                            // console.log("Upadate response: " + JSON.stringify(updateResp));
                                callbackPdb();

                            }).catch(function (err) {
                                console.log("Update Errr: " + JSON.stringify(err));
                                callbackPdb();
                            });
                        }

                    });

                });

            });
        }

        function updatePdbClone(setStatus, datas, sendstatus) {
            console.log('**************updatePdb***************' + setStatus);

            cameraDb.get(datas._id).then(function (doc) {
            //                console.log("update Doc: ");
            //                console.log("_ID: " + datas._id);
            //                console.log("_rev: " + doc._rev);
            //                console.log("imageType: " + datas.imageType);
            //                console.log("supplier_id: " + datas.supplier_id);
                var dataToUpdate = {
                    '_id': datas._id,
                    '_rev': doc._rev,
                    'image': datas.image,
                    'imageType': datas.imageType,
                    'supplier_id': datas.supplier_id,
                    'status': setStatus,
                    'time': moment().unix(),
                }
                cameraDb.put(dataToUpdate).then(function (updateResp) {
                //                    console.log("Upadate response: " + JSON.stringify(updateResp));
                    sendstatus(true);
                }).catch(function (err) {
                    console.log('Update Err: ' + JSON.stringify(err));
                    // cameraDb.get(datas._id).then(function (doc) {
                    // return cameraDb.remove(doc);
                    // });
                    cameraDb.remove(doc._id, doc._rev);
                    sendstatus(false);
                });
            });
        }

        function fetchInvoiceConfigItems (selectedPeriod){
            return $q(function (resolve, reject) {
                CommonService.fetchInvoiceConfigSuplierItems(function (data) {
                    resolve(data);
                },selectedPeriod);
             });
        }

        function updateGalleryPdb(setStatus, data, sendCallback) {
            console.log('**************updatePdb Gallery***************' + setStatus);
            // cameraDb.allDocs({
            // include_docs: true,
            // startkey: "invoiceCamera_",
            // endkey: "invoiceCamera_\uffff"
            // }).then(function(res) {
            // console.log('Req Send: ',res.rows[0]);
            // getGalleryPdbData(function(res){

            // var cntPdb = 0;
            // async.eachSeries(res.rows, function(item, callbackPdb) {
            // cntPdb++;


            // console.log('update Gallery: '+JSON.stringify(item));
            // if (res.rows.length+1 == cntPdb){
            // console.log('last record Gallery');

            // } else{
            console.log('update Req Send: ' + JSON.stringify(data));

            var dataToUpdate = {
                '_id': data._id,
                'image': data.image,
                'imageType': data.imageType,
                'supplier_id': data.supplier_id,
                'status': setStatus,
                'time': moment().unix(),
                // 'time1':moment(new Date()).format(),
                '_rev': data._rev

            }
            // console.log('dataToUpdate: ',dataToUpdate);
            cameraDb.put(dataToUpdate).then(function (updateResp) {
            //                console.log("Upadate response gallery: " + JSON.stringify(updateResp));
                sendCallback(true);
                // callbackPdb();
            }).catch(function (err) {
                console.log(err);

                cameraDb.remove(item.doc._id, item.doc._rev, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    sendCallback(false);
                });
                // callbackPdb();
            });
            // }

            // });

            // });

            // });
        }

        function uploadGalleryImage(uploadStatusGallery) {
            console.log('**************uploadGalleryImage***************');
            // cameraDb.allDocs({
            // include_docs: true,
            // startkey: "invoiceCamera_",
            // endkey: "invoiceCamera_\uffff"
            // }).then(function(res) {
            // console.log('Req Send: ',res.rows[0]);
            var cntGallery = 0;
            getGalleryPdbData(function (res) {

                async.eachSeries(res.rows, function (item, callbackGallery) {
                    cntGallery++;

                    console.log('update Req Send gallery: ');
                    // console.log(item.doc.image);
                    // console.log(item.doc.imageType);
                    // uploadImage(item.doc.image, item.doc.imageType, function(imageUrl, imageId, uploadedTimeEpoch) {
                    uploadImageNew(item.doc._id, item.doc.imageType, function (imageUrl, imageId, uploadedTimeEpoch) {
                        console.log("imageUrl: " + imageUrl);
                        console.log("imageId: " + imageId);
                        // inventory_sheet
                        // console.log(uploadedTimeEpoch);
                        updateGalleryPdb('requestSent', item.doc, function (status) {
                            var requestPayload = {
                                "supplier_id": item.doc.supplier_id,
                                "image_id": imageId,
                                "image_url": imageUrl
                            };

                            console.log("requestPayload: " + JSON.stringify(requestPayload));

                            addInvoice(requestPayload, function (data) {
                                // console.log("TESTTT Gallery " + cntGallery + ": " + JSON.stringify(data));

                                if (data.status == 200) {
                                    console.log('Delete img from Pdb');

                                    deleteLocalInvoiceFile(item.doc._id).then(function (deleteResponse) {
                                        // console.log(deleteResponse)
                                    })

                                    // cameraDb.remove(saveCamera);
                                    cameraDb.allDocs({
                                        include_docs: true,
                                        startkey: "invoiceGallery_",
                                        endkey: "invoiceGallery_\uffff"
                                    }).then(function (response) {
                                        console.log('RES....' + JSON.stringify(response.rows[0].doc));
                                        // console.log(response.rows[0].doc);
                                        cameraDb.remove(response.rows[0].doc).then(function (result) {
                                            // handle result
                                            console.log("DELETE Gallery res: " + JSON.stringify(result));
                                            callbackGallery();
                                            console.log('res.rows.length: ' + res.rows.length);
                                            console.log('cntGallery: ' + cntGallery);
                                            if (res.rows.length == cntGallery) {
                                                console.log('last record for Gallery');
                                                uploadStatusGallery(true);
                                            }
                                        }).catch(function (err) {
                                            console.log(err);
                                            callbackGallery();
                                            if (res.rows.length == cntGallery) {
                                                console.log('last record for Gallery');
                                                uploadStatusGallery(true);
                                            }
                                        });
                                    });
                                } else {
                                    updateGalleryPdb('failed', item.doc, function (status) {});
                                }
                            });
                        });

                    });



                });

            });

            // });
        }

        function insertCamImg(uploadImageCB) {
            console.log('Uploading image to server');
            cameraDb.allDocs({
                include_docs: true,
                startkey: "invoiceCamera_",
                endkey: "invoiceCamera_\uffff"
            }).then(function (res) {
                var cntDelPdb = 0;
                // alert("I m here "+res.rows.length);
                async.eachSeries(res.rows, function (item, callbackDelPdb) {
                    cntDelPdb++;
                    //                    console.log("STATUS" + item.doc.status);
                    //                    console.log("cntDelPdb" + cntDelPdb);
                    if (item.doc.status == "savedLocally" || item.doc.status == "failed") {
                    //  console.log('if savedLocally or failed');
                        updatePdbClone('requestSent', item.doc, function (gotStatus) {
                            if (gotStatus) {
                                // uploadImage(item.doc.image, item.doc.imageType, function(imageUrl, imageId, uploadedTimeEpoch) {
                                uploadImageNew(item.doc._id, item.doc.imageType, function (imageUrl, imageId, uploadedTimeEpoch) {
                                //                                    console.log(imageUrl);
                                //                                    console.log(imageId);
                                //                                    console.log(uploadedTimeEpoch);
                                    var requestPayload = {
                                        "supplier_id": item.doc.supplier_id,
                                        "image_id": imageId,
                                        "image_url": imageUrl
                                    };

                                    addInvoice(requestPayload, function (data) {
                                        // console.log("TESTTT: " + JSON.stringify(data));
                                        if (data.status == 200) {

                                            deleteLocalInvoiceFile(item.doc._id).then(function (deleteResponse) {
                                            // console.log(deleteResponse)
                                            })

                                            cameraDb.get(item.doc._id).then(function (doc) {
                                                cameraDb.remove(doc);
                                                if (res.rows.length == cntDelPdb)
                                                    uploadImageCB(true);
                                                else
                                                    callbackDelPdb();
                                            });
                                        } else {
                                            updatePdbClone('failed', item.doc, function (gotStatus) {
                                                if (gotStatus) {
                                                    if (res.rows.length == cntDelPdb)
                                                        uploadImageCB(true);
                                                    else
                                                        callbackDelPdb();
                                                } else {
                                                    console.log("error in updating status");
                                                    if (res.rows.length == cntDelPdb)
                                                        uploadImageCB(true);
                                                    else
                                                        callbackDelPdb();
                                                }
                                            });
                                        }
                                    });
                                });
                            } else {
                                console.log("error in updating status");
                                if (res.rows.length == cntDelPdb)
                                    uploadImageCB(true);
                                else
                                    callbackDelPdb();
                            }
                        });
                    }
                    // else if (item.doc.status == "finished") {
                    // console.log('Delete Doc');
                    // console.log("_id: "+item.doc._id);
                    // console.log('_rev: '+item.doc._rev);
                    // cameraDb.remove(item.doc._id, item.doc._rev, function(err) {
                    // if (err) {
                    // return console.log(err);
                    // } else {
                    // console.log("Document deleted successfully");
                    // if (res.rows.length == cntDelPdb)
                    // uploadImageCB(true);
                    // else
                    // callbackDelPdb();
                    // }
                    // });
                    // }
                    // else if (item.doc.status == "requestSent"){
                    // console.log('else if requestSent' +(moment().unix()- item.doc.time));
                    // // var duration = moment.duration(moment().unix() - item.doc.time);
                    // // alert(duration);

                    // if((moment().unix()- item.doc.time) > 30){
                    // updatePdbClone('failed', item.doc, function(gotStatus) {
                    // if (gotStatus) {
                    // console.log("done");
                    // } else {
                    // console.log("error in updating status");
                    // }
                    // });
                    // } else {
                    // if (res.rows.length == cntDelPdb)
                    // uploadImageCB(true);
                    // else
                    // callbackDelPdb();
                    // }
                    // }
                });
            });
        }

        function insertGalleryImg(saveCamera, sendResponce) {

            var docs, newDocs = [];
            // console.log(saveCamera);

            cameraDb.put(saveCamera).then(function (response) {
                // handle response
                // console.log('Put Response: '+JSON.stringify(response));
                if (response.ok) {
                    sendResponce(true);
                } else {
                    sendResponce(false);
                }
            }).catch(function (err) {
                console.log('Put Response err: ' + JSON.stringify(err));
                sendResponce(false);
            });

        }

        function getRequestHeaders() {
            return {
                "isb-session-id": Utils.getLocalValue('sessionId')
            };
        }


        function getPicture(options) {
            // console.log("camera");
            var q = $q.defer();
            navigator.camera.getPicture(function (result) {
                // console.log(result);
                q.resolve(result);
            }, function (err) {
                q.reject(err);
            }, options);

            return q.promise;
        }

        function uploadImage(encodedImageData, type, uploadImageCallback) {
            //Closure function for return handler
            var responseHandlerWrapper = function (response) {
                // console.log("uploadImage Res: "+JSON.stringify(response));
                uploadImageCallback(response.data.image_url, response.data.image_id, response.data.uploaded_time_epoch);
            };

            var serviceRequestType = "POST";
            var serviceRequestData = {
                encoded_image_data: encodedImageData,
                type: type,
                request_id: ""
            };

            Utils.executeCostBytePostWebService('upload_image', serviceRequestData,
                serviceRequestType, responseHandlerWrapper, getRequestHeaders());
        }

        // first the file is read from the local data directory and then uploaded to backend
        function uploadImageNew(encodedImageId, type, uploadImageCallback) {
            console.log('Sending image upload request')
            readLocalInvoiceFile(encodedImageId).then(
                function (encodedImageData) {
                    //Closure function for return handler
                    var responseHandlerWrapper = function (response) {
                        console.log('image upload request completed')
                        uploadImageCallback(response.data.image_url, response.data.image_id, response.data.uploaded_time_epoch);
                    };

                    var serviceRequestType = "POST";
                    var serviceRequestData = {
                        encoded_image_data: encodedImageData,
                        type: type,
                        request_id: ""
                    };
                    console.log("UPloading iage");
                    Utils.executeCostBytePostWebService('upload_image', serviceRequestData,
                        serviceRequestType, responseHandlerWrapper, getRequestHeaders());

                }
            )

        }

        function getUploadedImages(type, getUploadedImagesCallback) {
            var responseHandlerWrapper = function (response) {
                var uploadedImages = [];
                if (response.data.uploaded_images) {
                    uploadedImages = response.data.uploaded_images.map(function (item) {
                        return {
                            title: item.uploaded_time_epoch,
                            thumbnail_url: item.url
                        }
                    });
                }
                getUploadedImagesCallback(uploadedImages);
            }

            var serviceRequestType = "GET";
            var serviceRequestData = {
                type: type
            };

            Utils.executeCostByteWebService('get_uploaded_images', serviceRequestData,
                serviceRequestType, responseHandlerWrapper, getRequestHeaders());
        }


        var summaryFilterButtons = [{
                'label': ' Purchase Summary',
                'name': 'purchase',
                // 'style': 'button-balanced ion-ios-star full-star',
                // 'icon': 'ion-ios-star full-star',
                'clicked': true,
        }
        // , {
        // 'label': 'Invoices Due',
        // 'name': 'due',
        // // 'style': 'button-balanced incomplete-alert',
        // // 'icon': 'incomplete-alert',
        // 'clicked': false,
        // }
      ];

        var uploadSortButtons = [{
            text: 'By Supplier Name',
            clicked: true,
            name: "supplier_alias_name",
            toggleState: false,
        }, {
            text: 'By Date',
            clicked: false,
            name: "created_at",
            toggleState: false,
        }, ]


        var uploadSortButtons1 = [{
            text: 'By Supplier Name',
            clicked: false,
            name: "supplier_alias_name",
            toggleState: false,
        }, {
            text: 'By Date',
            clicked: true,
            name: "created_at",
            toggleState: true,
        }, ]

        var invoicesSortButtons = [{
            text: 'By Supplier Name',
            clicked: false,
            name: "supplier_name",
            toggleState: false
        },
        {
            text: 'By Due Date',
            clicked: false,
            name: "due_date",
            toggleState: false,
        },
        {
            text: 'By Date',
            clicked: false,
            name: "date",
            toggleState: false,
        },
        {
            text: 'By Default',
            clicked: true,
            name: "date",
            toggleState: false,
        }
        ]


        var invoiceUploadButtons = [{
            text: 'Camera',
            clicked: false,
            name: "camera",
        }, {
            text: 'Gallery',
            clicked: false,
            name: "gallery",
        }, ]



        function getButtons(buttonType) {

            if (buttonType == "SORT") {
                return uploadSortButtons;
            } else if (buttonType == "SORT2") {
                return uploadSortButtons1;
            } else if (buttonType == "SORT1") {
                return invoicesSortButtons;
            } else if (buttonType == "FILTER") {
                return summaryFilterButtons;
            } else if (buttonType == "CAMERA") {
                return invoiceUploadButtons;
            }
        }

        function setButtonClicked(buttonType, indexToSetTrue) {

            var buttons = getButtons(buttonType);
            angular.forEach(buttons, function (btn, index) {
                if (index == indexToSetTrue)
                    btn.clicked = true;
                else
                    btn.clicked = false;
            });

            if (buttonType == "SORT" || buttonType == "SORT1" || buttonType == "SORT2") {
                buttons[indexToSetTrue].toggleState = !buttons[indexToSetTrue].toggleState;
            }

        }

        function postInvoiceDetails(invoiceResponse, invoiceDetails) {
            CommonService.postInvoiceDetails(invoiceResponse, invoiceDetails);
        }

        function fetchSuppliers() {

            var q = $q.defer();
            CommonService.fetchSuppliers(function (suppliers) {
                q.resolve(suppliers.suppliers);
            });
            return q.promise;
        }

        function fetchMeasurements() {

            var q = $q.defer();
            CommonService.fetchMeasurements(function (measurements) {
                q.resolve(measurements.measurements);
            });
            return q.promise;
        }

        function fetchUploadedInvoices() {

            var q = $q.defer();
            CommonService.fetchSuppliersInvoices(function (invoices) {
                // console.log('Invoice images fetched count: '+ invoices.supplier_invoices.length)
                q.resolve(invoices.supplier_invoices);
            });
            return q.promise;


        }

        function fetchForceUploadedInvoices() {

            var q = $q.defer();
            CommonService.fetchForceSuppliersInvoices(function (invoices) {
                q.resolve(invoices.supplier_invoices);
            });
            return q.promise;


        }


        function fetchSupplierInvoices(selectedPeriod) {

            var q = $q.defer();
            CommonService.fetchInvoiceTracking(function (invoices) {
                q.resolve(invoices.invoice_tracking);
            }, selectedPeriod);
            return q.promise;
        }

        function fetchPurchaseSummary(selectedPeriod) {

            var q = $q.defer();
            CommonService.fetchPurchaseSummary(function (purchaseSummary) {
                q.resolve(purchaseSummary);
            }, selectedPeriod);
            return q.promise;
        }

        function fetchPurchaseTrend(responseHandler) {

            var q = $q.defer();
            CommonService.fetchInvoicePurchaseTrend(function (invoices) {
                q.resolve(invoices.purchase_trends);
            });
            return q.promise;

        }


        function addInvoice(requestPayload, responseHandler) {

            var suppliersList = function (invoices) {
                responseHandler(invoices)
            }
            CommonService.createInvoice(requestPayload, suppliersList);
        }


        function updateInvoiceDueStatus(responseHandler, invoice_id, property) {
            CommonService.updateInvoiceDue(responseHandler, invoice_id, property);
        }


        function updateInvoiceImageStatus(responseHandler, invoice_id) {
            CommonService.updateInvoiceImage(responseHandler, invoice_id);
        }

        function fetchInvoice(responseHandler, invoice_id,supplier_id) {

            var invoiceList = function (invoices) {
                responseHandler(invoices.data);
            }

            CommonService.fetchInvoiceDetails(invoiceList, invoice_id,supplier_id);
        }

        function createImageDirectory() {
            var q = $q.defer();
            // Checks if the invoice uploads directory exists. And creates it if it does not
            $cordovaFile.checkDir(cordova.file.dataDirectory, "invoice_uploads")
                .then(function (success) {
                    // check dir success
                    q.resolve(success)
                }, function (error) {
                    // error could be not found or something else
                    if (error.message == 'NOT_FOUND_ERR') {
                        // create the directory
                        $cordovaFile.createDir(cordova.file.dataDirectory, "invoice_uploads", false)
                            .then(function (success) {
                                // create dir success
                                q.resolve(success)
                            }, function (error) {
                                // create dir error
                                q.resolve(error)
                            });

                    } else {
                        // error something else
                        q.resolve(error)
                    }



                });

            return q.promise;

        }

        function saveInvoiceImage(imageData, fileNameUid) {
            var q = $q.defer();
            // createImageDirectory().then(function (dirResponse) {
            // $cordovaFile.writeFile(cordova.file.dataDirectory, 'invoice_uploads/' + fileNameUid, imageData, true)
            $cordovaFile.writeFile(cordova.file.dataDirectory, fileNameUid, imageData, true)
                .then(function (success) {
                    // write file success

                    q.resolve(success)
                }, function (error) {
                    // error
                    q.resolve(error)
                });
            // });

            return q.promise;
        }

        function readLocalInvoiceFile(fileNameUid) {
            var q = $q.defer();
            // READ local file
            // $cordovaFile.readAsText(cordova.file.dataDirectory, 'invoice_uploads/' + fileNameUid)
            $cordovaFile.readAsText(cordova.file.dataDirectory, fileNameUid)
                .then(function (success) {
                    // file read success
                    q.resolve(success)
                }, function (error) {
                    // file read error
                    q.resolve(error)
                });

            return q.promise;

        }

        function deleteLocalInvoiceFile(fileNameUid) {
            var q = $q.defer();
            // READ local file
            // $cordovaFile.removeFile(cordova.file.dataDirectory, 'invoice_uploads/' + fileNameUid)
            $cordovaFile.removeFile(cordova.file.dataDirectory, fileNameUid)
                .then(function (success) {
                    // file read success
                    q.resolve(success)
                }, function (error) {
                    // file read error
                    q.resolve(error)
                });

            return q.promise;

        }


        return documentSelectionServiceFactory;
    }
})();
