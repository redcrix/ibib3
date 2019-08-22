(function () {
    projectCostByte.controller('OperationsCtrl', operationsCtrl);

    operationsCtrl.$inject = ['$q', '$scope', 'CommonService', '$timeout', '$ionicLoading', '$ionicFilterBar','ionicDatePicker', '$rootScope', '$ionicActionSheet'];

    function operationsCtrl($q, $scope, CommonService, $timeout, $ionicLoading, $ionicFilterBar, ionicDatePicker, $rootScope, $ionicActionSheet) {

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });
        $scope.graphSpinnerHide = true;

        var toTitleCase = function (str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };
        var toastMessage = function (message_text, duration) {
            if (typeof duration === 'undefined') duration = 2000;
            $ionicLoading.show({
                template: message_text,
                noBackdrop: true,
                duration: duration
            });
        };

        var selectedDate = new Date();
        var showIng = function (ingList) {
            console.log('showIng');
            $scope.graphSpinnerHide = false;
            $scope.graphIngName = 'Price history of ' + ingList.name;
            _.forEach($scope.ingredients, function (ingr) {
                ingr.clicked = false;
            });
            ingList.clicked = true;

            CommonService.fetchIngredientsData(ingList.id, $scope.timePeriod,
                CommonService.changeDateFormat(selectedDate),
                function (getChartData) {
                    if (angular.isUndefined($scope.ingData)) {
                        console.log('if undefined');
                        $scope.ingData = {}
                    }
                    // console.log('getChartData.dates: ',getChartData,getChartData.dates.length);
                    if(getChartData.dates){
                        if (getChartData.dates.length > 0) {
                            console.log('if data')
                            $scope.ingData.dates = getChartData.dates;
                            $scope.ingData.data = [getChartData.values];
                            // $scope.graphSpinnerHide = true;
                            $scope.$broadcast('GRAPH_FREE');
                            $scope.graphData = true;

                        }
                    }else {
                        console.log('else');
                        $scope.$broadcast('GRAPH_FREE');
                        $scope.ingData = {};
                        $scope.graphData = false;
                        toastMessage("No more price history to show");
                    }
                });

        };


        // to catch response of api
        $scope.periodList = [];

        function periosResHandler(datas) {
          _.forEach(datas.periodList, function(period) {
            _.forEach(period.periodWeeks, function(tag) {
              if (tag.periodWeekTag.includes("WEEK"))
                $scope.periodList.push({
                  'text': tag.periodWeekTag
                });
            });
          });
          // console.log($scope.periodList);
          fetchIngredientPricesData();
        }

        // service to fetch period list
        CommonService.pandLfetchPeriodWeeksWithData(periosResHandler);
        $scope.periodDetailSelection = function() {
          if (angular.isDefined($scope.periodList)) {
            var selectedPeriod = {};
            _.each($scope.periodList, function(p, pIndex) {
              // console.log(angular.isDefined($rootScope.globalSelectedOperationPeriod),p);
              if (angular.isDefined($rootScope.globalSelectedOperationPeriod) && p.text == $rootScope.globalSelectedOperationPeriod.text) {
                p = $rootScope.globalSelectedOperationPeriod;
                selectedPeriod = p;
              }
              else if (!angular.isDefined($rootScope.globalSelectedOperationPeriod)) {
              // else {
                if ($scope.periodList.length == pIndex + 1) {
                  p.selected = true
                  $rootScope.globalSelectedOperationPeriod = p;
                  selectedPeriod = p;
                }
              }
            })
            // console.log('selectedPeriod: ',selectedPeriod);
            return selectedPeriod.text;
          }
          return ""
        }
        //  to get list of periods for date range drop-down
        $scope.showPeriod = function() {
          // if ($scope.periodSelection === 'Period') {
          var hideSheet = $ionicActionSheet.show({
            buttons: $scope.periodList,
            titleText: '<h4><center>Select Period</center></h4>',
            cancelText: 'Cancel',
            cancel: function() {},
            buttonClicked: function(index) {
              _.each($scope.periodList, function(p, pIndex) {
                if (index === pIndex) {
                  p.selected = true;
                  $rootScope.globalSelectedOperationPeriod = p;
                  $rootScope.globalSelectedOperationPeriodIndex = undefined;
                  $timeout(setWeeksFilterButtons, 1);
                } else {
                  p.selected = false;
                }
              });
              return true;
            }
          });
          // }
          var myEl = angular.element(document.querySelector('.action-sheet-group'));
          myEl.css('overflow-y', 'scroll');
          myEl.css('max-height', (window.innerHeight - 95) + 'px');
          // myEl.css('max-width', (window.innerWidth - 120) + 'px');
        };

        // get label to display selected date range
        var setWeeksFilterButtons = function(periodItem) {
          return $q(function(resolve, reject) {
            // console.log("scope.periodList in setWeeksFilterButtons is : ", scope.periodList);
            if (angular.isDefined($scope.periodList)) {
              let periodItem = _.find($scope.periodList, ['selected', true]);
              let buttons = _.transform(periodItem.periodWeeks, function(result, periodWeek, index) {
                periodWeek.style = '';
                result.push(periodWeek)
              });
              let selectedWeekButton = _.findIndex(buttons, ['selected', true]);
              // console.log("$rootScope.globalSelectedOperationPeriodIndex in setWeeksFilterButtons : ", $rootScope.globalSelectedOperationPeriodIndex);
              if (angular.isDefined($rootScope.globalSelectedOperationPeriodIndex)) {
                selectedWeekButton = $rootScope.globalSelectedOperationPeriodIndex
              } else if (selectedWeekButton === -1) {
                selectedWeekButton = 0;
                $rootScope.globalSelectedOperationPeriodIndex = selectedWeekButton;
              }
              $scope.filterButtons = buttons;
              // console.log("scope.filterButtons in setWeeksFilterButtons is : ", scope.filterButtons);
              $scope.filterbuttonclick(selectedWeekButton);
              resolve(true)
            }

          })

        };

        // to get selected tag from drop-down date range(period)
        $scope.filterbuttonclick = function(filterbuttonindex) {
          console.log("filterbuttonclick")
          _.each($scope.filterButtons, function(button, index) {
            if (index === filterbuttonindex) {
              $rootScope.globalSelectedOperationPeriodIndex = index;
              button.selected = true;
            } else {
              button.selected = false;
            }
          });
          console.log("calling filterbuttonclick year, period, index: ", $rootScope.globalSelectedOperationPeriod, $rootScope.globalSelectedOperationPeriodIndex);
          fetchIngredientPricesData();
        };

        //On health tracker init handler
        $scope.onOperationsInitHandler = function () {
            $scope.$broadcast('IPT_BUSY');
            $scope.timePeriod = 'DAILY';
            $scope.PeriodDisplay = toTitleCase('DAILY');
            $scope.navBarTitle.showToggleButton = true;
            // CommonService.fetchDisabledDates(rHandler, new Date(2016, 6, 1), new Date());
            // CommonService.fetchLatestDate(dateResponseHandler, new Date(2016, 6, 1), new Date());
            // fetchIngredientPricesData();
        };

        $scope.latestDateTextDisplay = function () {
            return "Latest Date: " + CommonService.changeDateFormat(selectedDate);
        };

        $scope.change_display_ingredient = function (ingredient_item) {
            selectedDate = new Date();
            showIng(ingredient_item);
        };

        $scope.sortDirections = {};
        var sortPriority = [];
        var sorterFn = function (){
            if (sortPriority.length > 0) {
                $scope.ingredients = _.orderBy($scope.ingredients, sortPriority,
                    _.map(sortPriority, function square(sortField) {
                        return $scope.sortDirections[sortField];
                    }));
                _.forEach($scope.ingredients, function (ingr) {
                    ingr.clicked = false;
                });
                showIng($scope.ingredients[0]);
                $scope.$broadcast('IPT_ING_FREE');
            } else {
                // $scope.ingredients = [];
                // CommonService.fetchIngrediantsList(function (ingredientList) {
                //     $scope.ingredients = ingredientList.ing;
                //     _.forEach($scope.ingredients, function (ingr) {
                //         ingr.clicked = false;
                //     });
                //     showIng($scope.ingredients[0]);
                //     $scope.$broadcast('IPT_ING_FREE');
                // });
                $scope.$broadcast('IPT_ING_FREE');
            }

        }

        $scope.sortIngredientsBy = function (fieldName) {
            $scope.$broadcast('IPT_ING_BUSY');
            if (_.has($scope.sortDirections, fieldName)) {
                if ($scope.sortDirections[fieldName] === 'asc') {
                    $scope.sortDirections[fieldName] = 'desc';
                } else if ($scope.sortDirections[fieldName] === 'desc') {
                    _.unset($scope.sortDirections, fieldName);
                    _.pull(sortPriority, fieldName)
                }
            } else {
                $scope.sortDirections[fieldName] = 'asc';
                sortPriority.push(fieldName)
            }


            sorterFn()


        };


        //Method used to call all the http requests for fetching ingredient price tracker data
        var fetchIngredientPricesData = function () {
            $scope.$broadcast('IPT_BUSY');
            let dateRange = $scope.periodDetailSelection();
            $scope.ingredients = [];
            console.log(dateRange);
            CommonService.fetchIngrediantsList(dateRange,function (ingredientList) {
              // change
                $scope.ingredients = ingredientList.ing;
                console.log($scope.ingredients);
                $scope.spinnerHide = true;
                if($scope.ingredients){
                  console.log('if-----');
                  $scope.$broadcast('GRAPH_FREE');
                  $scope.spinnerhide = true;
                } else {
                  console.log('else---');
                  $scope.$broadcast('GRAPH_FREE');
                  $scope.spinnerhide = true;
                }
                _.forEach($scope.ingredients, function (ingr) {
                    ingr.clicked = false;
                });

                if($scope.ingredients) showIng($scope.ingredients[0]);
                $scope.$broadcast('IPT_FREE');
                $scope.$broadcast('IPT_ING_FREE');

            });
        };

        $scope.$on('IPT_BUSY', function (event) {
            $scope.spinnerHide = false;
        });

        $scope.$on('IPT_FREE', function (event) {
            $scope.spinnerHide = true;
        });

        $scope.$on('IPT_ING_BUSY', function (event) {
            $scope.spinnerINGHide = false;
        });

        $scope.$on('IPT_ING_FREE', function (event) {
            $scope.spinnerINGHide = true;
        });

        $scope.$on('GRAPH_BUSY', function (event) {
            $scope.graphSpinnerHide = false;
            $scope.graphData = false;
        });

        $scope.$on('GRAPH_FREE', function (event) {
            $scope.graphSpinnerHide = true;
            $scope.graphData = true;
            console.log('graphSpinner free');
            $timeout(function(){
                var navBar = document.getElementsByClassName("bar-header");
                var navBarHeight = navBar[0].offsetHeight;
                var subHeadBar = document.getElementsByClassName("bar-subheader");
                var subHeadBarHeight = subHeadBar[0].offsetHeight;
                var chartBar = document.getElementsByClassName("chartBar");
                var chartBarHeight = chartBar[0].offsetHeight;
                var tblHead = document.getElementsByClassName("tblHead");
                var tblHeadHeight = tblHead[0].offsetHeight;
                var totalHeight = (navBarHeight + subHeadBarHeight + chartBarHeight + tblHeadHeight)+"px";
                document.getElementById("chartTblHead").style.top = totalHeight;
                document.getElementById("set-spin").style.height = parseInt(chartBarHeight+5)+"px";
            },100);
        });

        // //Things to take care when the state is navigated to app.healthTracker
        // $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //     if (toState.name == "app.healthTracker") {
        //     }
        // });


        $scope.moveDateForward = function () {
            console.log('moving date forward');
            let lastDate = CommonService.strToDate($scope.ingData.dates[$scope.ingData.dates.length - 1]);
            console.log(lastDate);
            selectedDate = new Date(lastDate.setDate(lastDate.getDate() + 14));
            console.log(selectedDate);
            $timeout(function () {
                showIng(_.find($scope.ingredients, ['clicked', true]))
            });
        };
        $scope.moveDateBackward = function () {
            console.log('moving date backward');
            let firstDate = CommonService.strToDate($scope.ingData.dates[0]);
            console.log(firstDate);
            selectedDate = firstDate;
            $timeout(function () {
                showIng(_.find($scope.ingredients, ['clicked', true]))
            });
        };


        $scope.searchActive = false;
        $scope.showFilterBar = function() {
            let search_fields = [ 'id', 'name'];
            $scope.searchActive = true;
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.ingredients,
                debounce: true,
                update: function(filteredItems, filterText) {
                    $scope.ingredients = filteredItems;
                    sorterFn();
                }
            });
        };

    }
})();
