(function() {
    'use strict';

    projectCostByte.factory('PaymentService', paymentService);

    paymentService.$inject = ['$q','CommonService', 'Utils'];

    function paymentService($q, CommonService, Utils) {

        var paymentServiceFactory = {
            subscribe: subscribeUser,
            subscription: getSubscription,
            planDetails: getPlanDetails
        }


        function getRequestHeaders() {
            return {
                "isb-session-id": Utils.getLocalValue('sessionId')
            };
        }


        function getSubscription(getSubscriptionCallback) {

            var responseHandlerWrapper = function(response) {
                getSubscriptionCallback(response.data);
            };

            var serviceRequestType = 'GET';
            var serviceRequestData = {};

            Utils.executeCostByteWebService('get_subscription_details', serviceRequestData,
                serviceRequestType, responseHandlerWrapper, getRequestHeaders());
        }

        function getPlanDetails(getPlanCallback) {

            var responseHandlerWrapper = function(response) {
                getPlanCallback(response.data);
            };

            var serviceRequestType = 'GET';
            var serviceRequestData = {};

            Utils.executeCostByteWebService('get_payment_plan_details', serviceRequestData,
                serviceRequestType, responseHandlerWrapper, getRequestHeaders());
        }

        function subscribeUser(token, subscribeCallback) {
            var responseHandlerWrapper = function(response) {
                subscribeCallback(response.data);
            };

            var serviceRequestType = "POST";
            var serviceRequestData = {
                token_id: token,
            };

            Utils.executeCostBytePostWebService('create_subscription_request', serviceRequestData,
                serviceRequestType, responseHandlerWrapper, getRequestHeaders());
        }


        return paymentServiceFactory;
    }
})();
