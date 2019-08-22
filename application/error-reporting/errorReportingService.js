(function () {
    'use strict';

    projectCostByte.factory('ErrorReportingServiceOne', ErrorReportingServiceOne);



    ErrorReportingServiceOne.$inject = ['$q', 'CommonService', '$timeout', 'Utils', 'appModalService', '$ionicPopup'];

    var errorReportingData = {}
    errorReportingData.defaultMessages = [{'display': 'Custom', 'enabled':true}]
    errorReportingData.cannedMessages = []
    function ErrorReportingServiceOne($q, CommonService, $timeout, Utils, appModalService, $ionicPopup) {



        var ErrorReportingFactoryOne = {
            userErrorReport: userErrorReport,
            showErrorReportForm:showErrorReportForm,
            fetchCannedErrorMessages:fetchCannedErrorMessages,
            showConfirmation: showConfirmation,
        };

        var modal_shown = false;
        function showErrorReportForm(error_info, messages_filter){
            // console.log("error_info: ",error_info);
            // console.log("messages_filter: ",messages_filter);
            // return promise resolved by '$scope.closeModal(data)'
            // Use:
            // myModals.showLogin(userParameters) // get this inject 'parameters' on 'loginModalCtrl'
            //  .then(function (result) {
            //      // result from closeModal parameter
            //  });
            error_info.messages_filter = _.transform(messages_filter, function(result, value, key) {
                result[key] = _.lowerCase(value)
            });

            // if (!modal_shown) {
                modal_shown = appModalService.show('application/error-reporting/errorReportingPopupView.html', 'errorModalCtrl', error_info)
                // modal_shown = appModalService.show('errorReportingTemplate', 'errorModalCtrl', error_info)
                // or not 'as controller'
                // return appModalService.show('templates/modals/login.html', 'loginModalCtrl', userInfo)
            // }
            return modal_shown
        }


        function userErrorReport(page, component, store_id, error, comments, error_id) {
            //            Business ID , Store ID , USEr ID , PAge , Comments , Error , ERROR ID

            return $q(function (resolve, reject) {
                var error_report = {
                    'page': page,
                    'component': component,
                    'store_id': store_id,
                    'error_message': error,
                    'comments': comments,
                    'error_id' : error_id
                }

                var postErrorReportRHW = function (postErrorResponse) {

                    resolve(postErrorResponse)
                }

                CommonService.postUserErrorReport(postErrorReportRHW, error_report)
            });
        }

        function fetchCannedErrorMessages(messages_filter){
//            console.log(messages_filter)
            return $q(function (resolve, reject) {

                     var fetchCannedErrorMessagesRHW = function (errorMessagesResponse) {
//                            console.log(errorMessagesResponse.data)
//                            errorReportingData.cannedMessages = _.union(errorReportingData.cannedMessages,
//                                                                        errorMessagesResponse.data.canned_messages)
//                            resolve(_.union(_.filter(errorReportingData.cannedMessages,messages_filter),
//                                            _.filter(errorReportingData.cannedMessages,{'error_id': 'custom'})))
                               resolve(_.sortBy(errorMessagesResponse.data.canned_messages,['rank']))

                    }

                    CommonService.fetchCannedErrorMessages(fetchCannedErrorMessagesRHW, messages_filter)
            })


        }

        function showConfirmation(){
                 // An alert dialog

           var alertPopup = $ionicPopup.alert({
             title: 'Error Report Sent',
             template: 'Thank you for reporting the error.',
             buttons: [ {
                        text: 'OK',
                        type: 'button-bal',
                        onTap: function(e) {
                          // Returning a value will cause the promise to resolve with the given value.
                            return e;
                        }
                      }]
           });

          return alertPopup;
        }


        return ErrorReportingFactoryOne;
    }

})();
