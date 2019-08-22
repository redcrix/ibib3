(function () {
    'use strict';

    projectCostByte.factory('DashboardTasksService', DashboardTasksService);

    DashboardTasksService.$inject = ['CommonService'];

    function DashboardTasksService(CommonService) {


        var DashboardTasksFactory = {
            fetchTasks: fetchTasks,
            addTask: addTask,
            toggleTask: toggleTask,
            getButtons: getButtons,
            setButtonClicked: setButtonClicked,

        };

        var DashboardTasksData = {};

        var taskFilterButtons = [{
            'label': 'Starred',
            'name': 'star',
            //            'style': 'button-balanced ion-ios-star full-star',
            'icon': 'ion-ios-star full-star',
            'clicked': false
        }, {
            'label': 'Incomplete',
            'name': 'incomplete',
            //            'style': 'button-balanced incomplete-alert',
            'icon': 'incomplete-alert',
            'clicked': true
        }, {
            'label': 'Completed',
            'name': 'completed',
            //            'style': 'button-balanced ion-checkmark-circled',
            'icon': 'ion-checkmark-circled',
            'clicked': false
        }];


        var tasksSortButtons = [{
            text: 'By Name',
            clicked: true,
            name: "item_name",
            toggleState: false
        }, {
            text: 'By Date',
            clicked: false,
            name: "date",
            toggleState: false
        }, {
            text: 'By Task Source',
            clicked: false,
            name: "source_name",
            toggleState: false
        }, {
            text: 'By Task Type',
            clicked: false,
            name: "decision",
            toggleState: false
        }];


        function getButtons(buttonType) {
            if (buttonType == "SORT") {
                return tasksSortButtons;
            } else if (buttonType == "FILTER") {
                return taskFilterButtons;
            }
        }

        function setButtonClicked(buttonType, indexToSetTrue) {
            var buttons = getButtons(buttonType);
            for (var i = 0; i < buttons.length; i++) {
                if (i == indexToSetTrue) {
                    buttons[i].clicked = true;
                } else {
                    buttons[i].clicked = false;
                }
            }
            if (buttonType == "SORT") {
                buttons[indexToSetTrue].toggleState = !buttons[indexToSetTrue].toggleState;
            }

        }

        function fetchTasks(responseHandler) {

            var fetchTasksRHW = function (tasks) {
//              console.log(tasks);
                DashboardTasksData.tasks = tasks;
                responseHandler(tasks)
            }

            CommonService.DashboardfetchTasks(fetchTasksRHW);

        }

        function addTask(responseHandler, task) {
            CommonService.DashboardaddTask(responseHandler, task);
        }

        function toggleTask(responseHandler, task_id, property) {
            CommonService.DashboardtoggleTask(responseHandler, task_id, property);
        }


        return DashboardTasksFactory;
    }

})();
