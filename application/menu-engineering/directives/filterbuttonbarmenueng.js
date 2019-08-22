(function () {
    'use strict';
    var filterButtonBarTemplate = `
        <div style="padding:0px 0px 0px 0px ;" class="row">
            <div ng-repeat="filterbutton in filterbuttons track by $index"
               style="text-overflow: inherit; width:100%;height:75px;text-align:center"
               class=" {{filterbutton.col}} menueng "
               ng-class="filterbutton.clicked ? '' : 'button-out'"
               ng-click="filterbuttonclick($index)"><div>
               <i ng-show="filterbutton.icon" class="icon icon-left {{ filterbutton.icon }}" style="vertical-align: sub;padding-bottom:5px;">{{ filterbutton.label }}</i><div style="padding-top:15px;"></div>

              <span style ="padding:0px 0px 0px 0px;font-size:20px;height:25px;color: #4CAF50;vertical-align: sub;border:2px solid #CCC;border-radius: 35%;width:20px;display: block;margin-left: auto;margin-right: auto;"ng-click="info(filterbutton.label);$event.stopPropagation();">i</span></div>
        </div>`;

    projectCostByte.directive('filterbuttonbarmenueng', filterbuttonbarmenueng)

    filterbuttonbarmenueng.$inject = ['$rootScope', '$state' ,'Utils', '$timeout','appModalService'];

    function filterbuttonbarmenueng($rootScope, $state ,Utils, $timeout,appModalService) {
        return {
            restrict: 'E',
            // templateUrl: 'application/core/shared-components/common/directive/filterButtonBarView.html',
            template: filterButtonBarTemplate,
            scope: {
                filterbuttons: '=',
                allowalldeselected: '=',
                eventname: '='
            },
            link: function (scope, element, attribute) {
                // handler for filter button click
                // toggles the value of "clicked" and sets other buttons "clicked" to false
     
                scope.filterbuttonclick = function (filterbuttonindex) {
//                    console.log(scope.eventname)
                    
                        var allowAllDeselected = _.get(scope, 'allowalldeselected', false)
                        if (allowAllDeselected){

    //                        _.forEach(scope.filterbuttons, function(button){
    //                            button.clicked = false
    //                        })
                            scope.filterbuttons[filterbuttonindex].clicked = !(scope.filterbuttons[filterbuttonindex].clicked)
                        }else{                            
                            for (var i = 0; i < scope.filterbuttons.length; i++) {
                                if (i == filterbuttonindex) {                                    
                                    // console.log(scope.filterbuttons[i].filter_tag)
                                    scope.filterbuttons[i].clicked = true;
                                } else {                                    
                                    scope.filterbuttons[i].clicked = false;
                                }
                            }
                        }
                        if(angular.isDefined(scope.eventname)){
    //                        console.log('broadcasting filter change')
                            $rootScope.$broadcast(scope.eventname);
                        }
                    }
                    // var modal_shown = false;
                    var modal_shown =true;
                    scope.info =function(label){
                        if (modal_shown) {
                        console.log("showing conversion");
                        modal_shown = appModalService.show('application/menu-engineering/directives/menuEngInfo.html', 'menuEngInfoCtrl', label)
                    }
                    return modal_shown

                    }
                }
            }
    };
})();
