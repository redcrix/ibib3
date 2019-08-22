(function () {
    'use strict';
    projectCostByte.directive('tasksitemlist', tasksitemlist);
    tasksitemlist.inject = ["DashboardTasksService", "$ionicListDelegate", "Utils"];

    function tasksitemlist(DashboardTasksService, $ionicListDelegate, Utils) {
        return {
            restrict: 'E',
            templateUrl: 'application/task-manager/view/tasks/tasksItemList.html',
            scope: {
                tasks: '=',
                filterbuttons: '=',
                headerbarbuttons: '=',
            },
            link: function (scope, element, attribute) {


                scope.getSortingClass = function () {
                    var sortingButtons = DashboardTasksService.getButtons("SORT");
                    var clickedButtonIndex = Utils.getIndexIfObjWithOwnAttr(sortingButtons, 'clicked', true);
                    var toggleState = "";
                    if (sortingButtons[clickedButtonIndex].toggleState) {
                        toggleState = "-";
                    }
                    //                    console.log(scope.getFilterClass());
                    return toggleState + sortingButtons[clickedButtonIndex].name;
                }

                scope.byFilterClass = function () {
                    return function (item) {
                        var clickedButtonIndex = Utils.getIndexIfObjWithOwnAttr(scope.filterbuttons, 'clicked', true);
                        if (item.deleted) {
                            return false;
                        } else if (item.starred && clickedButtonIndex == 0) {
                            return true;
                        } else if (!item.action_taken && clickedButtonIndex == 1) {
                            return true;
                        } else if (item.action_taken && clickedButtonIndex == 2) {
                            return true;
                        }
                        return false;
                    }
                }


            }
        };
    }
})();
