(function () {
    'use strict';
    projectCostByte.directive('tasksitem', tasksitem);
    tasksitem.inject = ["DashboardTasksService", "$ionicListDelegate"];

    function tasksitem(DashboardTasksService, $ionicListDelegate) {
        return {
            restrict: 'E',
            templateUrl: 'application/task-manager/view/tasks/tasksItem.html',
            scope: {
                task: '=',
                taskindex: '=',
                ifeven: '=',

            },
            link: function (scope, element, attribute) {

                scope.DeleteTask = function () {
                    toggle_task(scope.task.reference_key, 'deleted');
                    scope.task.deleted = true;
                    scope.$emit('UPDATETASKCOUNT'); // already called
                    $ionicListDelegate.closeOptionButtons();
                };

                scope.toggleActionTaken = function () {
                    scope.task.action_taken = !scope.task.action_taken;
                    toggle_task(scope.task.reference_key, 'action_taken');
                    //                    scope.$emit('UPDATETASKCOUNT'); // already called
                    //                    scope.$emit('UPDATETASKLIST', scope.page, scope.task.reference_key);
                    $ionicListDelegate.closeOptionButtons();
                };

                scope.toggleStarred = function () {
                    scope.task.starred = !scope.task.starred;
                    //                    console.log(scope.task.starred);
                    toggle_task(scope.task.reference_key, 'starred');
                    //                    scope.$emit('UPDATETASKLIST', scope.page, scope.task.reference_key);
                    //                    scope.$emit('UPDATETASKCOUNT'); // already called
                    $ionicListDelegate.closeOptionButtons();
                };

                var toggle_task = function (key, property) {
                    DashboardTasksService.toggleTask(toggleTaskResponseHandler, key, property);
                };

                var toggleTaskResponseHandler = function (toggle_response) {
                    // console.log(toggle_response);
                };

            }
        };
    }
})();
