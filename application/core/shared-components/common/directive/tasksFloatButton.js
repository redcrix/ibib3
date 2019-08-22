(function () {
    'use strict';
    var tasksFloatButtonTemplate = `
        <button class="button button-bal icon ion-clipboard float-button button-fab-bottom-right"
                ui-sref="app.dashboard.tasks()" fab>
        </button>`;
    projectCostByte.directive('tasksfloatbutton', function () {
        return {
            restrict: 'E',
            template: tasksFloatButtonTemplate,
            scope: {},
            link: function (scope, element, attribute) {}
        }
    });
})();