(function() {
  'use strict';
  var filterButtonBarTemplate = `
        <div style="margin-top:5px;height: 85%;" class="button-bar ">
            <a ng-repeat="filterbutton in filterbuttons track by $index"
               style="text-overflow: inherit;height: 100%;border: 1px solid lightgray; max-width:{{ filterbutton.max_width }}"
               class="button  no-horizontal-padding"
               ng-class="filterbutton.clicked ? 'button-bal' : 'button-lightgray'"
               ng-click="filterbuttonclick($index)">
               <div class="col-50" style="height: 65%;">
                  <div style="width:200%;margin-top: -12%;"><i ng-show="filterbutton.icon" class="icon icon-left {{ filterbutton.icon }}" style="vertical-align: sub;"></i></div>
               </div>
               <div class="col-50" ng-class="filterbutton.clicked ? 'button-bal' : 'text-gray'" style="height: 30%;">
                  <div style="vertical-align: sub;width: 200%;margin-top: -15%;">{{ filterbutton.label }}</div>
               </div>


            </a>
        </div>`;

  projectCostByte.directive('filterbuttonbar', filterbuttonbar)

  filterbuttonbar.$inject = ['$rootScope', '$state', 'Utils', '$timeout'];

  function filterbuttonbar($rootScope, $state, Utils, $timeout) {
    return {
      restrict: 'E',
      // templateUrl: 'application/core/shared-components/common/directive/filterButtonBarView.html',
      template: filterButtonBarTemplate,
      scope: {
        filterbuttons: '=',
        allowalldeselected: '=',
        eventname: '='
      },
      link: function(scope, element, attribute) {
        // handler for filter button click
        // toggles the value of "clicked" and sets other buttons "clicked" to false

        scope.filterbuttonclick = function(filterbuttonindex) {
          //                    console.log(scope.eventname)

          var allowAllDeselected = _.get(scope, 'allowalldeselected', false)
          if (allowAllDeselected) {

            //                        _.forEach(scope.filterbuttons, function(button){
            //                            button.clicked = false
            //                        })
            scope.filterbuttons[filterbuttonindex].clicked = !(scope.filterbuttons[filterbuttonindex].clicked)
          } else {
            for (var i = 0; i < scope.filterbuttons.length; i++) {
              if (i == filterbuttonindex) {
                // console.log(scope.filterbuttons[i].filter_tag)
                scope.filterbuttons[i].clicked = true;
              } else {
                scope.filterbuttons[i].clicked = false;
              }
            }
          }
          if (angular.isDefined(scope.eventname)) {
            //                        console.log('broadcasting filter change')
            $rootScope.$broadcast(scope.eventname);
          }
        }
      }
    }
  };
})();
