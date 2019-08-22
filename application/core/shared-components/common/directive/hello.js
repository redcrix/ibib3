(function () {
    'use strict';
    var filterButtonBarTemplate = `
        <div style="margin-top:5px;" class="button-bar ">
            Hellooooooooooo 
        </div>`;

    projectCostByte.directive('hello-text', filterbuttonbar)

    filterbuttonbar.$inject = ['$rootScope', '$state' ,'Utils', '$timeout'];

    function filterbuttonbar($rootScope, $state ,Utils, $timeout) {
        return {
            restrict: 'E',
            // templateUrl: 'application/core/shared-components/common/directive/filterButtonBarView.html',
            template: filterButtonBarTemplate,
            scope: {
                
            },
            link: function (scope, element, attribute) {
                // handler for filter button click
                // toggles the value of "clicked" and sets other buttons "clicked" to false
                console.log('hellloooooo directive')
               
                }
            }
    };
})();
