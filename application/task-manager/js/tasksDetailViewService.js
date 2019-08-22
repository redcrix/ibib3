(function () {
    'use strict';

    projectCostByte.factory('tasksDetailViewService', tasksDetailViewService);

    tasksDetailViewService.$inject = ['CommonService'];

    function tasksDetailViewService(CommonService) {

        var tasksDetailViewFactory = {
            fetchTemplateForTaskDetail: fetchTemplateForTaskDetail,

        };

        function fetchTemplateForTaskDetail(responseHandler, taskKey) {

            CommonService.fetchTasksTemplateForTaskDetail(responseHandler, taskKey);



        }

        return tasksDetailViewFactory;
    }

})();
