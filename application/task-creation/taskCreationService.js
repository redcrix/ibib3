(function () {
    'use strict';

    projectCostByte.factory('TaskCreationServiceOne', TaskCreationServiceOne);
    TaskCreationServiceOne.$inject = ['$q', 'CommonService', 'appModalService', '$ionicPopup'];

    var taskCreationData = {};
    taskCreationData.defaultMessages = [{'display': 'Custom', 'enabled': true}];
    taskCreationData.taskMessages = [];

    function TaskCreationServiceOne($q, CommonService, appModalService, $ionicPopup) {

        var TaskCreationFactoryOne = {
            userTaskCreation: userTaskCreation,
            showTaskCreateForm: showTaskCreateForm,
            fetchTaskCreationMessages: fetchTaskCreationMessages,
            showConfirmation: showConfirmation,
            fetchOldTaskMessages: fetchOldTaskMessages
        };

        function showTaskCreateForm(task_info, messages_filter) {
            // console.log("task_info: ", task_info);
            // console.log("messages_filter: ", messages_filter);

            task_info.messages_filter = _.transform(messages_filter, function (result, value, key) {
                result[key] = _.lowerCase(value)
            });
            return appModalService.show('application/task-creation/taskCreationPopupView.html', 'taskModalCtrl', task_info)
        }

        function userTaskCreation(responseHandler, task) {
            CommonService.DashboardaddTask(responseHandler, task);
        }

        function fetchTaskCreationMessages(messages_filter) {
            return $q(function (resolve, reject) {
                var fetchTaskMessagesRHW = function (taskMessagesResponse) {
                    resolve(_.sortBy(taskMessagesResponse.data.task_messages, ['rank']))
                };
                CommonService.fetchTaskMessages(fetchTaskMessagesRHW, messages_filter)
            })
        }

        function showConfirmation() {
            // An alert dialog
            var alertPopup = $ionicPopup.alert({
                title: 'Task Creation',
                template: 'Thank you for creating this task',
                buttons: [{
                    text: 'OK',
                    type: 'button-bal',
                    onTap: function (e) {
                        return e;
                    }
                }]
            });
            return alertPopup;
        }
        function fetchOldTaskMessages(fetchOldTaskMessagesRHW,messages_filter){
            // return $q(function (resolve, reject) {
            //     var fetchOldTaskMessagesRHW = function (oldTaskMessagesResponse) {
            //         resolve(_.sortBy(oldTaskMessagesResponse.data.task_messages, ['rank']))
            //     };
                CommonService.fetchOldTaskMessagesRequest(fetchOldTaskMessagesRHW, messages_filter)
            // })
        }

        return TaskCreationFactoryOne;
    }
})();
