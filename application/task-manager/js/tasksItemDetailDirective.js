(function() {
    'use strict';
    projectCostByte.directive('taskitemdetailview', taskitemdetailview);
    taskitemdetailview.$inject = ['$ionicScrollDelegate', 'Utils', 'tasksDetailViewService'];

    function taskitemdetailview($ionicScrollDelegate, Utils, tasksDetailViewService) {
        return {
            restrict: 'E',
            templateUrl: 'application/task-manager/view/tasks/tasksItemDetail.html',
            scope: {
                task: '=',
                ifeven: '=',
            },
            link: function(scope, element, attribute) {

                scope.toggleGroup = function(group) {
                    if (!angular.isUndefined(group)) {
                        group.show = !group.show;
                        $ionicScrollDelegate.resize();
                    }
                };

                scope.isGroupShown = function(group) {
                    if (angular.isUndefined(group)) {
                        return false;
                    } else {
                        return group.show;
                    }
                };

                scope.getDetialsView = function() {
                    if (angular.isUndefined(scope.task)) {


                    } else {
                        //                        console.log("fetching detail template")
                        tasksDetailViewService.fetchTemplateForTaskDetail(getDetialsViewRH, scope.task.reference_key);
                    }
                };

                function getDetialsViewRH(templateAndData) {
                    //                    console.log("fetched detail template")

                    //                    console.log(templateAndData)
                    scope.template = templateAndData.template;
                    scope.templateData = templateAndData.templateData;

                    scope.taskDataGroup = {
                        'show': true,
                        //                        'taskData': "",
                        //                        'template': templateAndData.template,
                        //                        'templateData': templateAndData.data
                    };

                }


            }
        };
    }
})();
