(function() {
    projectCostByte.controller('PromotionOptimizerCtrl', PromotionOptimizerCtrl);

    PromotionOptimizerCtrl.$inject = ['$scope', 'PromotionOptimizerService', '$state', 'CommonConstants', 'CommonService'
    ,'Utils','$ionicListDelegate','$ionicPopup','$ionicScrollDelegate', 'DashboardTasksService', '$ionicLoading'];

    function PromotionOptimizerCtrl($scope, PromotionOptimizerService, $state, CommonConstants, CommonService
    ,Utils, $ionicListDelegate, $ionicPopup, $ionicScrollDelegate, DashboardTasksService, $ionicLoading) {

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

        //On Promotion Optimizer init handler
        $scope.onPromotionOptimizerInitHandler = function() {
            $scope.navBarTitle.showToggleButton = true;
            fetchPromotions();
            fetchCandidates();
        }

        //On Promotion Optimizer init handler
        $scope.onAllPromotionsInit = function() {
            $scope.navBarTitle.showToggleButton = false;
            fetchPromotions();
//            fetchCandidates();
        }
        //On Promotion Optimizer init handler
        $scope.onAllCandidatesInit = function() {
            $scope.navBarTitle.showToggleButton = false;
//            fetchPromotions();
            fetchCandidates();
        }

        var fetchPromotions = function(){
            PromotionOptimizerService.fetchPromotionData(fetchPromotionDataRH, 'promotion');

        }

        var fetchCandidates = function(){
            PromotionOptimizerService.fetchPromotionData(fetchPromotionDataRH,'candidate');

        }

        var fetchPromotionDataRH = function(promotionData, PromotionDataType){
//            console.log(promotionData)
            switch(PromotionDataType) {
                case 'promotion':
                    $scope.maxSales = maxOf(promotionData, 'sales')
                    $scope.promotions = promotionData;

//                    console.log($scope.maxSales)
//                    $scope.maxSales = 49000;
                    $scope.spinnerHide = true;

                    break;
                case 'candidate':
                    $scope.candidates = promotionData;
                    $scope.spinnerHide = true;
                    break;
                default:
                    console.log('PromotionDataType not recognized')
            }

        }
            // function to add decision
        $scope.decide = function (decision_source, decision_type, item, affected_name) {
                var add_task = true;
                var disable_confirmation_popup_tasks = Utils.getLocalValue('disable_confirmation_popup_tasks', false)
                if (!disable_confirmation_popup_tasks) {
                    $scope.popupnoshow = {};
                    var confirmPopup = $ionicPopup.confirm({
                        scope: $scope
                        , title: 'Add Task'
                        , template: '<div>Are you sure you want to ' + decision_type + ' of ' + affected_name + '?</div>' +
                            //                                        '<label class="checkbox"><input type="checkbox">Do not ask me again</label>'
                            '<div class="row checkbox"><div class="col col-20"><input type="checkbox" ng-model="popupnoshow.pref"></div><div class="col" style="padding-top: 10px">Do not ask me again</div></div>'
                    });
                    confirmPopup.then(function (user_response) {
                        if ($scope.popupnoshow.pref) Utils.setLocalValue('disable_confirmation_popup_tasks', true);
                        add_task = user_response;
                        if (add_task) {
                            //                       this_decision = create_decision(decision_source, decision_type, item_name);
                            //                       decisionStoreFactory.set_decision(this_decision);
                            addTask(decision_source, decision_type, item, affected_name);
                            toastMessage("Task added : " + decision_type + " of " + affected_name, 800)
                        }
                    });
                }
                else {
                    if (add_task) {
                        //                   this_decision = create_decision(decision_source, decision_type, item_name);
                        //                   decisionStoreFactory.set_decision(this_decision);
                        addTask(decision_source, decision_type, item, affected_name);
                        toastMessage("Task added : " + decision_type + " of " + affected_name, 1200);
                    }
                }
                $ionicListDelegate.closeOptionButtons();
            }

        var addTask = function (source_name, decision, item, affected_name) {
            task = create_task(source_name, decision, item, affected_name)
            DashboardTasksService.addTask(addTaskResponseHandler, task)
        }
        var create_task = function (source_name, decision, item, affected_name) {
            return {
                'item_name': affected_name
                , 'decision': decision
                , 'source_name': source_name
                , 'source': item.reference_key
                , 'source_link': 'app.promotionOptimizer()'
            }
        }

        var toastMessage = function (message_text, duration) {
            if (typeof duration === 'undefined') duration = 1500;
            $ionicLoading.show({
                template: message_text
                , noBackdrop: true
                , duration: duration
            });
        }

        var addTaskResponseHandler = function (res) {
                //            console.log(res)
        }

        var maxOf = function (data, key) {
            if (angular.isUndefined(data) && angular.isUndefined(key)) {
                return 0;
            } else {
                var max_value = 0;

                angular.forEach(data, function (value) {
                    if (value[key]>max_value){
                        max_value = value[key]
                    }

                });
                return max_value;
            }
        }


    }

})();
