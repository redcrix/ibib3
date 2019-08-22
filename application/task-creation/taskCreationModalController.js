(function () {
    projectCostByte.controller('taskModalCtrl', taskModalCtrl);

    taskModalCtrl.$inject = ['$scope', '$rootScope', 'TaskCreationServiceOne', 'parameters', 'CommonService', 'Utils', 'DashboardTasksService', '$ionicPopup', '$ionicLoading','$filter','$ionicScrollDelegate','DocumentSelectionService','$q','$timeout'];
    function taskModalCtrl($scope, $rootScope, TaskCreationServiceOne, parameters, CommonService, Utils, DashboardTasksService, $ionicPopup, $ionicLoading,$filter,$ionicScrollDelegate,DocumentSelectionService,$q,$timeout) {

        $scope.dataReceived = false;
        $scope.sendButtonColor = 'app-theme-color';
        $scope.sendButtonText = 'Create Task';

        $scope.taskCreation = {
            'selected_task': '',
            'selectedStore': null,
            'comments': null
        };
        $scope.stores = [];
        $scope.task = false;
        // console.log(parameters);

        CommonService.fetchStores(function (data) {
            if (!!data && data.business_stores) {
                var local_current_store = Utils.getLocalValue('current_store', '0');
                $scope.stores = data.business_stores;
                if (_.find($scope.stores, ['store_id', local_current_store])) {
                    $scope.taskCreation.selectedStore = local_current_store;
                } else {
                    $scope.taskCreation.selectedStore = $scope.stores[0].store_id;
                }
            }
        });
        var fetchSuppliersResponseHandler = function (suppliers) {
            // console.log(suppliers)
            $scope.data = {}
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
                  resolve('FREE')
            });
        }
        var fetchSheetData = function () {
            // console.log('fetchSheetData')
            $scope.$broadcast('BUSY');
            var promises = [DocumentSelectionService.fetchSuppliers()];

            $q.all(promises).then((values) => {
                // console.log('promisesssss')
                $q.all([fetchSuppliersResponseHandler(values[0])])
                .then(function(res){
                    $scope.$broadcast('FREE');
                    // console.log(res)
                })

            });
        }
        fetchSheetData();
        var paramNew = {
            component: parameters.component,
            page: parameters.page,
            item: parameters.item,
            name: parameters.name,
            price: parameters.price,
            cost: parameters.cost,
            type: parameters.type,
            portionUnit: parameters.portionUnit
        };
        $scope.taskItem = angular.copy(paramNew);
        // console.log($scope.taskItem);
        function getBasePrice(){
            var item = $scope.taskItem
            var price = item.menuItemAveragePrice
            if (item.hasOwnProperty('price')){
                price = item.price;
            }else if(item.hasOwnProperty('menuItemBasePrice')){
                price = item.menuItemBasePrice;
            }
            return price;
        }


        $scope.priceicon =  'ion-pricetag';
        $scope.iconedPrice =  $filter('currency')(getBasePrice())

        $scope.myModal = parameters.modalName;
        $scope.comments = {}
        TaskCreationServiceOne.fetchTaskCreationMessages(parameters.messages_filter)
            .then(function (messagesData) {
                _.each(messagesData, function (message) {
                    message.selected = false;
                    // console.log(message)
                    message.textVal = '';
                    message.commentVal = '';
                    message.change = false;
                    message.show = false;
                    message.supplier = '';
                    // $scope.comments[message.task_message] = '';
                    // console.log($scope.comments)
                });
                // console.log(messagesData);
                $scope.taskOptions = messagesData;
                $scope.dataReceived = true;
            });
        $scope.selectTask = function (selectedIndex,group) {
            // console.log('select taskkkk',selectedIndex)
            // $scope.currencyVal = false;
            _.each($scope.taskOptions, function (message) {
                message.selected = false;

            });
            $scope.taskOptions[selectedIndex].selected = true;
            $scope.taskCreation.selected_task = $scope.taskOptions[selectedIndex]
            // console.log(group)
            group.show = !group.show;
            $ionicScrollDelegate.resize();


        };

        var create_task = function (source_name, decision, item, affected_name,textVal,commentVal) {
            return {
                'item_name': affected_name,
                'decision': decision,
                'source_name': source_name,
                'source': JSON.stringify(item),
                'source_link': "app.marginoptimizermenuitem2({sectionName:'" + item.sectionName + "', category:'" + item.category + "',menuType:'" + item.menuType + "',menuItem:'" + item.menuItem + "', })",
                'value': textVal,
                'comments': commentVal
            }
        };

        var addTaskResponseHandler = function (res) {
            // console.log(res);
            if(res.status == 200)
                toastMessage("Task successfully added " , 1200);
            else
                toastMessage("something went wrong." , 1200);
            $scope.closeModal({'modal': 'closed', 'task': 'done'});

        };

        var toastMessage = function (message_text, duration) {
            if (typeof duration === 'undefined') duration = 1500;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        };

        var confirmPopup = function (decision_type, affected_name) {
            return $ionicPopup.confirm({
                scope: $scope,
                title: 'Add Task',
                template: '<div>Are you sure you want to ' + decision_type + ' for ' + affected_name + '?</div>' +
                '<div class="row checkbox"><div class="col col-20"><input type="checkbox" ng-model="popupnoshow.pref"></div><div class="col" style="padding-top: 10px">Do not ask me again</div></div>'
            });
        };

        // var addTask = function (source_name, decision, item, affected_name) {
        //     var task = create_task(source_name, decision, item, affected_name);
        //     TaskCreationServiceOne.userTaskCreation(addTaskResponseHandler, task);
        //     toastMessage("Task added : " + decision + " of " + affected_name, 1200);
        // };

        var addTask = function (finalTaskList, decision, affected_name) {
            // var task = create_task(source_name, decision, item, affected_name);
            // console.log(task);

            TaskCreationServiceOne.userTaskCreation(addTaskResponseHandler, finalTaskList);
            // toastMessage("Task added : " + decision + " of " + affected_name, 1200);
            //
        };
        $scope.setTask = function(){
          let finalTaskList = []
          _.each($scope.filteredList, function (item,i) {
              // console.log(item)
              finalTaskList.push({
                  'item_name': $scope.taskItem.component,
                  'decision': item.task_message,
                  'source_name': item.page,
                  'source': JSON.stringify($scope.taskItem.item),
                  'source_link': "app.marginoptimizermenuitem2({sectionName:'" + $scope.taskItem.item.sectionName + "', category:'" + $scope.taskItem.item.category + "',menuType:'" + $scope.taskItem.item.menuType + "',menuItem:'" + $scope.taskItem.item.menuItem + "', })",
                  'value': item.textVal.toString(),
                  'comments': item.commentVal
              });

              if($scope.filteredList.length == i+1){
                  // console.log(finalTaskList)
                  // addTask(item.page, item.task_message, $scope.taskItem.item, item.component,item.textVal,item.commentVal);
                  addTask(finalTaskList,item.task_message,item.component);
              }
          });
        }

        $scope.createTask = function () {
            // console.log($scope.filteredList)
            if($scope.taskCreation.selected_task) {
                // console.log('create task', $scope.taskCreation.selected_task);
                if($scope.filteredList && $scope.filteredList.length){
                        var disable_confirmation_popup_tasks = Utils.getLocalValue('disable_confirmation_popup_tasks', false)
                            if (!disable_confirmation_popup_tasks) {
                                    $scope.popupnoshow = {};
                                    confirmPopup($scope.taskItem.page, $scope.taskItem.component).then(function (user_response) {
                                        if ($scope.popupnoshow.pref) {
                                            Utils.setLocalValue('disable_confirmation_popup_tasks', true);
                                        }
                                        if (user_response) {
                                            $scope.sendButtonText = 'Creating Task...';
                                            $scope.sendButtonColor = 'app-theme-color-transparent';
                                            // addTask($scope.taskItem.page, $scope.taskCreation.selected_task.task_message, $scope.taskItem.item, $scope.taskItem.component);
                                            $scope.setTask();
                                        }
                                    });

                            } else {
                                $scope.sendButtonText = 'Creating Task...';
                                $scope.sendButtonColor = 'app-theme-color-transparent';
                                // addTask($scope.taskItem.page, $scope.taskCreation.selected_task.task_message, $scope.taskItem.item, $scope.taskItem.component);
                                // addTask(item.page, item.task_message, $scope.taskItem.item, item.component,item.textVal,item.commentVal);
                                $scope.setTask();
                            }

                    }else{
                        toastMessage("Click on Add Task", 1200);
                    }

            } else {
                toastMessage("Decision is required", 1200);
            }
        };

        $scope.closeModalCtrl = function () {
            console.log('closeModal');
            $scope.myModal.hide();
            $scope.closeModal({'modal': 'closed', 'task': 'not done'});
        };

        $scope.textValChanged = function(option){
            option.change = true;
        }

        $scope.addTaskToList = function(){
            $scope.filteredList = []
            // console.log($scope.taskOptions)
            $scope.filteredList = _.filter($scope.taskOptions, function(o) {
                return o.change;
            });
            // console.log($scope.filteredList)
            $scope.task = true;

        }
        function oldTaskHandler(resOldTask){
            // console.log(resOldTask)
            if(resOldTask.data){
                $scope.task = false;
                console.log(resOldTask.data.task_list_data)
                if(!resOldTask.data.task_list_data)
                    $scope.task = true;
                $scope.oldTaskDataList = resOldTask.data.task_list_data;
                _.each($scope.oldTaskDataList, function (OldMsg) {
                    $scope.filteredList.push({
                        'task_message': OldMsg.decision,
                        'textVal' : OldMsg.value,
                        'commentVal': OldMsg.comments,
                        'deleted': OldMsg.deleted,
                        'item_name': OldMsg.item_name
                    })
                })
            } else{
                $scope.task = true;
            }
        }
        let OldMsgRqst = []
        $scope.oldTaskList = function(){
            $scope.filteredList = []
            OldMsgRqst = {'menuName': parameters.name}
            console.log(OldMsgRqst)
            TaskCreationServiceOne.fetchOldTaskMessages(oldTaskHandler,OldMsgRqst)
        }
        $scope.isGroupShown = function (group) {
            // console.log('isGroupShown: ',group)
            if (angular.isUndefined(group)) {
                return false;
            } else {
                return group.show;
            }
        };
        $scope.shoutLoud = function(newValue, oldValue){
            // console.log(newValue,oldValue)
            console.log($scope.taskOptions)
            _.each($scope.taskOptions,function(o){
                if(o.task_message == 'Change Supplier'){
                    o.supplier = newValue;
                    o.supplier.supplier_alias_name = newValue.supplier_alias_name;
                    o.change = true;
                }
            })
            console.log($scope.taskOptions)

        };
        $scope.shoutReset = function(){
          console.log("value was reset!");
        };

        $scope.setInventory = function(sup, index){

            // scope.current_selected = inv;

            $timeout(function(){
               angular.element(document.querySelectorAll('#my_maps')).triggerHandler('click');
            },200);
        }
        $scope.$on('BUSY', function (event) {
            $scope.spinnerShow = true;
        });

        $scope.$on('FREE', function (event) {
            $scope.spinnerShow = false;
        });
    }
})();
