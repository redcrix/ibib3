(function() {
    var PaymentHomeCtrl = function($q, $scope, $rootScope, Utils, $state, $timeout, $ionicTabsDelegate, $ionicPopup, $ionicModal, $ionicActionSheet, PaymentService) {

        $scope.cardType = {};

        $scope.payment = {};
        $ionicModal.fromTemplateUrl('application/settings-manager/payment-settings/terms.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false
        }).then(function(modal) {
            $scope.terms_modal = modal;
        });
        $scope.openAgreement = function() {
                $scope.terms_modal.show();
                console.log("openModal");
            }
            //  };
        $scope.closeModal = function() {
            $scope.terms_modal.hide();
        };
        $scope.init = function(){
            $scope.pageTitle = "Payment";
        }

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.terms_modal.remove();
            console.log("destroy");
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
            console.log("hidden");
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
            console.log("removed");
        });

        $scope.ResponseData = {};
        //
        $scope.spinnerShow = true;
        // $scope.cardImage = "/img/visa-card.svg";


        $scope.navBarTitle.showToggleButton = false;



        PaymentService.planDetails(function(resp) {
            console.log(resp.result);
            if(resp.result){
              $scope.plan_name = resp.result.plan_name;
              $scope.actual_plan_value = resp.result.actual_plan_value ? resp.result.actual_plan_value : 60;
              $scope.subscription_value = resp.result.monthly_sudscription_value  ? resp.result.monthly_sudscription_value  : 150;
              $scope.discount_value = resp.result.discount ? resp.result.discount : 90;
            }
        });


        $scope.getSubscriptionDetails = function(flag) {
            PaymentService.subscription(function(resp) {
                console.log(resp.result);
                $scope.spinnerShow = false;
                if (resp.result) {
                    if (resp.result.status == "active" || resp.result.status == "trialing") {

                        $scope.showCheckout = false;
                        $scope.next_billing_date = moment(resp.result.next_billing_date).format("YYYY-MM-DD");
                        $scope.plan_name = resp.result.plan_name;
                        // $scope.actual_plan_value = resp.result.actual_plan_value ? resp.result.actual_plan_value : 30;
                        // $scope.subscription_value = resp.result.monthly_sudscription_value  ? resp.result.monthly_sudscription_value  : 150;
                        // $scope.discount_value = $scope.subscription_value - $scope.actual_plan_value;

                        var duration = moment.duration(moment(resp.result.next_billing_date).diff(moment().format()));
                        var days = Math.ceil(duration.asDays());
                        // console.log(days);
                        if (days > 0) {
                            $scope.endsIn = days;
                        } else {
                            $scope.endsIn = "Trial expired";
                            if (!flag)
                                $scope.showCheckout = true;
                        }
                    } else {
                        $scope.showCheckout = true;
                    }
                } else {
                    $scope.showCheckout = true;
                }
            });
        }

        function stripeResponseHandler(status, response) {
            console.log(response);
            $scope.spinnerShow = false;
            $scope.ResponseData = {};



            $scope.$apply(function() {
                if (response.hasOwnProperty('id')) {
                    var token = response.id;
                    $scope.ResponseData.token = token;
                    console.log(token);
                    PaymentService.subscribe($scope.ResponseData.token, function(resp) {
                        console.log(resp.status);
                        if (resp.status) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Payment',
                                template: '<center>Congrats! your subscription is Active</center>'
                            });

                            alertPopup.then(function(res) {
                                $state.go($state.current, {}, {
                                    reload: true
                                });
                                $scope.getSubscriptionDetails(true);
                            });
                        } else {
                            $scope.ResponseData.error = "Please try later";
                        }
                    });
                    // proceedCharge(token);
                    // $scope.ResponseData['loading'] = false;
                } else if (response.error.type && /^Stripe/.test(response.error.type)) {
                    console.log('Stripe error: ', response.error.message);
                    $scope.ResponseData.error = response.error.message;
                    $scope.ResponseData.param = response.error.param;
                    console.log($scope.ResponseData);
                } else {
                    $scope.ResponseData.error = response.error.message;
                    $scope.ResponseData.param = response.error.param;
                    console.log('Other error occurred, possibly with your API');
                    console.log($scope.ResponseData);
                }

                // if (response.error) {
                //     // Show the errors on the form
                //     console.log(response.error);
                //     $scope.ResponseData.error = response.error.message;
                //     // $scope.ResponseData['loading'] = false;
                //
                // } else {
                //     // Token was created!
                //     // Get the token ID:
                //     if(response.hasOwnProperty('id')) {
                //       var token = response.id;
                //       $scope.ResponseData.token = token;
                //       // proceedCharge(token);
                //       // $scope.ResponseData['loading'] = false;
                //     } else {
                //       $scope.ResponseData.error = response.error.message;
                //       // $scope.ResponseData['loading'] = false;
                //     };
                // }
            });
        }

        $scope.checkType = function(type) {

            $scope.cardType.cardImage = "";
            if (type) {
                console.log(Stripe.card.cardType(type));
                if (Stripe.card.cardType(type) == "Visa")
                    $scope.cardType.cardImage = "img/visa-card.svg";
                else if (Stripe.card.cardType(type) == "MasterCard")
                    $scope.cardType.cardImage = "img/master-card.svg";
                else if (Stripe.card.cardType(type) == "American Express")
                    $scope.cardType.cardImage = "img/amex-card.svg";
                else if (Stripe.card.cardType(type) == "Discover")
                    $scope.cardType.cardImage = "img/discover-card.svg";
                else if (Stripe.card.cardType(type) == "Diners Club")
                    $scope.cardType.cardImage = "img/diners-card.svg";
                else if (Stripe.card.cardType(type) == "JCB")
                    $scope.cardType.cardImage = "img/jcb-card.svg";

                // image issue fixed
                var myEl = angular.element(document.querySelector('.CardBrandIcon-inner'));
                myEl.css('margin-right', '2em');
            }

            // console.log($scope.cardType.cardImage);

            // 4242424242424242	 // https://js.stripe.com/v3/fingerprinted/img/visa-174eee4ab72f6c7a05b8c159068d6eee.svg visa
            // 378282246310005   // https://js.stripe.com/v3/fingerprinted/img/amex-66abfdd8486f76f3ef25dd820f151918.svg amex
            // 5200828282828210	 // https://js.stripe.com/v3/fingerprinted/img/mastercard-cadc10ebe1a9e5868ded0d44fec013b2.svg master-card
            // 6011111111111117  // https://js.stripe.com/v3/fingerprinted/img/discover-b2ccd4b9b0252166667a47c270c78dca.svg   discover
            // 30569309025904    // https://js.stripe.com/v3/fingerprinted/img/diners-1abf31f63965536a8a12d34646d98a10.svg diners Club
            // 3530111333300000  // https://js.stripe.com/v3/fingerprinted/img/fingerprinted/img/jcb-576d422a7dfcef38453efabb0b9755f7.svg JCB

        }

        $scope.createToken = function(form) {
            if (form.$valid) {
                console.log($scope.payment);
                $scope.spinnerShow = true;

                // if($scope.payment.exp_month)
                //   $scope.payment.exp_month = moment().month($scope.payment.exp_month).format("M");
                // console.log($scope.payment)

                var myPayment = angular.copy($scope.payment);

                if ($scope.payment.exp_month)
                    myPayment.exp_month = moment().month($scope.payment.exp_month).format("M");

                Stripe.card.createToken(myPayment, stripeResponseHandler);
            }
        };

        function getYears(offset, range) {
            var currentYear = new Date().getFullYear();
            var years = [];
            for (var i = 0; i < range + 1; i++) {
                years.push(currentYear + offset + i);
            }
            return years;
        }
        console.log(moment.months());
        $scope.monthList = moment.months();
        $scope.yearsList = getYears(0, 20);

        $scope.getSubscriptionDetails(false);

    }
    PaymentHomeCtrl.$inject = ['$q', '$scope', '$rootScope', 'Utils', '$state', '$timeout', '$ionicTabsDelegate', '$ionicPopup', '$ionicModal', '$ionicActionSheet', 'PaymentService'];
    projectCostByte.controller('PaymentHomeCtrl', PaymentHomeCtrl);

})();
