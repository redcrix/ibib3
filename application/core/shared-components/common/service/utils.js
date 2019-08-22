(function () {
    'use strict';

    projectCostByte.factory('Utils', utils);

    utils.$inject = ['$window', '$http', 'CommonConstants', '$ionicHistory', '$q', '$templateCache', '$ionicNavBarDelegate','$ionicLoading'];

    function utils($window, $http, CommonConstants, $ionicHistory, $q, $templateCache, $ionicNavBarDelegate,$ionicLoading) {

        var commonFactory = {
            executeCostByteWebService: executeCostByteWebService,
            executeCostBytePostWebService: executeCostBytePostWebService,
            setLocalValue: setLocalValue,
            getLocalValue: getLocalValue,
            setLocalObject: setLocalObject,
            getLocalObject: getLocalObject,
            round: round,
            getIndexIfObjWithOwnAttr: getIndexIfObjWithOwnAttr,
            averageOf: averageOf,
            sumOf: sumOf,
            clearSession: clearSession,
            refreshApp: refreshApp,
            preLoadTemplate: preLoadTemplate,
            setHeaderTitle:setHeaderTitle,
            insertIntoPouchDb: insertIntoPouchDb,
            updatePouchDb: updatePouchDb,
            getDocumentFromPouchDb: getDocumentFromPouchDb
        };

        function setLocalValue(key, value) {
            var _lsTotal=0,_xLen,_x;
            for(_x in localStorage){ 
                if(!localStorage.hasOwnProperty(_x)) {
                    continue;
                } 
                _xLen= ((localStorage[_x].length + _x.length)* 2);
                _lsTotal+=_xLen; 
                // console.log(_x.substr(0,50)+" = "+ (_xLen/1024).toFixed(2)+" KB")
            };
                // console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
            $window.localStorage[key] = value;
        }

        function getLocalValue(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        }

        function setLocalObject(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        }

        function getLocalObject(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }

        function round(num, places) {
            var den = Math.pow(10, places);
            return Math.round(num * den) / den;
        }

        function getIndexIfObjWithOwnAttr(array, attr, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].hasOwnProperty(attr) && array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        }

        function averageOf(data, key) {
            if (angular.isUndefined(data) && angular.isUndefined(key)) {
                return 0;
            } else {
                var sum = 0;
                var itemscount = 0;
                angular.forEach(data, function (value) {
                    sum = sum + value[key];
                    itemscount += 1;
                });
                return sum / itemscount;
            }
        }

        function sumOf(data, key) {
            if (angular.isUndefined(data) && angular.isUndefined(key)) {
                return 0;
            } else {
                var sum = 0;
                //                var itemscount = 0;
                angular.forEach(data, function (value) {
                    sum = sum + value[key];
                    //                    itemscount += 1;
                });
                return sum;
            }
        }
        function toastMessage(message_text, duration) {
          if (typeof duration === 'undefined') duration = 1500;
          $ionicLoading.show({
            template: message_text,
            noBackdrop: true,
            duration: duration,
          });
        };

        //Used for get requests
        function executeCostByteWebService(serviceRequestPath, serviceRequestData, serviceRequestType, serviceResponseHandler, serviceRequestHeaders) {
            var responseResultFlag = false;
            var serviceRequestUrl = CommonConstants.REQUEST_BASE_URL_V1 + serviceRequestPath;
            $http({
                    url: serviceRequestUrl,
                    params: serviceRequestData,
                    method: serviceRequestType,
                    headers: serviceRequestHeaders
                })
                .then(function (response) {
                  // console.log(response);
                    if (response.status == CommonConstants.HTTP_SUCCESS_CODE) {
                        responseResultFlag = true;
                    } else {
                        responseResultFlag = false;
                    }

                    if (responseResultFlag) {
                        serviceResponseHandler(response);
                    }
                }, function (response) {
                  // console.log(response);
                    // serviceResponseHandler(response.status);
                    if(response.status == 503)
                      toastMessage("Something went wrong!", 1500);
                });
        }

        //Used for post requests
        function executeCostBytePostWebService(serviceRequestPath, serviceRequestData, serviceRequestType, serviceResponseHandler, serviceRequestHeaders) {
            var responseResultFlag = false;
            var serviceRequestUrl = CommonConstants.REQUEST_BASE_URL_V1 + serviceRequestPath;
            $http({
                    url: serviceRequestUrl,
                    data: serviceRequestData,
                    method: serviceRequestType,
                    headers: serviceRequestHeaders
                })
                .then(function (response) {
                    if (response.status = CommonConstants.HTTP_SUCCESS_CODE) {
                        responseResultFlag = true;
                    } else {
                        responseResultFlag = false;
                    }

                    if (responseResultFlag) {
                        serviceResponseHandler(response);
                    }
                }, function (response) {
                      serviceResponseHandler(response);
                })
        }

        function clearSession() {
            return $q(function(resolve, reject){
                var has_current_version = false;
                if(_.has($window.localStorage, 'appPreviousVersion')){
                    has_current_version = true;
                    var current_version = $window.localStorage["appPreviousVersion"];
                }


                $window.localStorage.clear();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                if(has_current_version){
                    $window.localStorage["appPreviousVersion"] = current_version;
                }

                var cameraDb = new PouchDB('invoice_camera').destroy().then(function (response) {
                    // success
                    // console.log('destroyed invoice_camera pouchdb')
                    resolve(true);
                }).catch(function (err) {
                    // console.log(err);
                });

            });
        }

        function refreshApp() {
            return $q(function(resolve, reject){
                var has_current_version = false;
                if(_.has($window.localStorage, 'appPreviousVersion')){
                    has_current_version = true;
                    var current_version = $window.localStorage["appPreviousVersion"];
                }
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                if(has_current_version){
                    $window.localStorage["appPreviousVersion"] = current_version;
                }

                var cameraDb = new PouchDB('invoice_camera').destroy().then(function (response) {
                    resolve(true);
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            });
        }

        function preLoadTemplate(templateName, templateURL){
            return $q(function(resolve, reject){
                // console.log('loading template' + templateName)
                if ($templateCache.get(templateURL)){
                    resolve(true); //prevent the prefetching if the template is already in the cache
                }
                $http.get(templateURL).success(function (t) {
                    $templateCache.put(templateURL, t);
                    resolve(true);
                });
            });
        }

        function setHeaderTitle(titleText){
            return $q(function (resolve, reject) {
                    $ionicNavBarDelegate.title(titleText);
                    $ionicNavBarDelegate.showBar(true)
                    resolve(true)
            })
        }


        function insertIntoPouchDb(dbName, draftId){
            console.log("inside insert into pouch db"+dbName+ "==" + draftId);
            var db = new PouchDB(dbName);
            var temp = null;
            var doc = {
               _id : draftId,
               data: temp
            }

            db.put(doc, function(err, response) {
               if (err) {
                  return console.log(err);
               } else {
                  console.log("Document created Successfully");
                  updatePouchDb(dbName, draftId, temp);
               }
            });
        }

        function getDocumentFromPouchDb(dbName, draftId){
            console.log("getting doc from pouch");
            console.log(draftId);
            var db = new PouchDB(dbName);
            return new Promise(resolve =>
                {
                   db.get(draftId)
                   .then((doc)=>{
                        console.log("retrived all docs");
                        resolve(doc);
                   })
                   .catch((err) =>
                   {
                       console.log("error");
                       console.log(err);
                      resolve(null);
                   });
                });

        }

        //TODO: add check to avoid infinite loop
        function updatePouchDb(dbName, draftId, payload){
            console.log("ak: updating pouch db")
            var db = new PouchDB(dbName);
            try
            {

            db.get(draftId, function(err, doc) {
               if (err) {
                   //document not found. For existing drafts create a new document
                   console.log("inside if");
                   console.log(err);
                   if(!insertIntoPouchDb(dbName, draftId)){
                       console.log("err unable to create new doc");
                   }

               }else{ 
                console.log("inside else");
                    if(true )
                    {
                        var tempData = {};
                        if(doc.data)
                            tempData = JSON.parse(doc.data);

                        tempData[payload.last_updated_at] = payload;

                        var temp = {
                            _id : draftId,    
                            _rev: doc._rev,
                            data: tempData
                        }
                     //   console.log(doc.data);
                        db.put(
                       //     temp
                        {
                            _id : draftId,    
                            _rev: doc._rev,
                            data: JSON.stringify(tempData)

                        }
                        )
                        .then(function(response){
                            console.log("put succes");
                            console.log(response);
                        }).catch(function(err){
                            console.log("errr");
                            console.log(err);

                        });

                    }else{
                        console.log("inside elesee");
                    }
                }
            });
        }
        catch(err){
            console.log("exception");
            console.log(err);

        }

 /*           return new Promise(resolve =>
              {
                 db.put({
                        _id: draftId,
                        _rev: doc._rev,
                        data: payload
                      }
                    )
                 .catch((err) =>
                 {
                    resolve(false);
                 });
                resolve(true);
              });
*/
        }

        return commonFactory;
    }
})();
