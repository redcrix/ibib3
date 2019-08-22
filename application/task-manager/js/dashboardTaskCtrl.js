(function() {
  projectCostByte.controller('DashboardTasksCtrl', DashboardTasksCtrl);

  DashboardTasksCtrl.$inject = ['$scope', 'DashboardTasksService', '$state', '$timeout', '$window', 'CommonConstants', 'CommonService', '$ionicActionSheet', '$rootScope', 'Utils', '$ionicListDelegate', '$ionicPopup', '$ionicScrollDelegate', '$ionicLoading', '$ionicActionSheet', '$ionicHistory'];


  function DashboardTasksCtrl($scope, DashboardTasksService, $state, $timeout, $window , CommonConstants,
    CommonService, $ionicActionSheet, $rootScope, Utils, $ionicListDelegate,
    $ionicPopup, $ionicScrollDelegate, $ionicLoading, $ionicActionSheet, $ionicHistory) {

    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
      viewData.enableBack = true;
    });

    /* backdrop of floating buttons */

    // var everywhere = angular.element(window.document+":not('#floating-menu')");
    var clicked;
    var everywhere = angular.element(window.document);

    $scope.$on('floating-menu:open', function() {
      console.log('open');
      clicked = true;
      // var everywhere = angular.element(document.querySelectorAll('body:not(#floating-menu)'));

      everywhere.bind('click', function(event) {
        // console.log(event.target.className == "icon menu-icon ion-arrow-left-c");
        var el = angular.element(document.querySelectorAll('#floating-menu'));
        if (el[0] && el[0].className === 'active') {
          if (clicked) {
            // console.log("clicked");
            el.removeClass('active');
            el.triggerHandler('click');
          }
        }
      });
      everywhere.bind('click', function(event) {
        // console.log(event.target.className == "icon menu-icon ion-arrow-left-c");
        var el = angular.element(document.querySelectorAll('#my-float-summary'));
        if (el[0] && el[0].className === 'active') {
          if (clicked) {
            // console.log("clicked");
            el.removeClass('active');
            el.triggerHandler('click');
          }
        }
      });
    });

    $scope.$on('floating-menu:close', function() {
      console.log('close');
      clicked = false;
    });



    //On Tasks init handler
    $scope.onTasksInit = function() {

      $scope.pageTitle = "My Dashboard";
      $scope.navBarTitle.showToggleButton = true;
      $scope.headerBarButtons = {
        'ShowDelete': false,
      };
      $scope.taskcount = 0;
      fetchTasks();
      // buttons
      $scope.taskFilterButtons = DashboardTasksService.getButtons("FILTER");
    };

    // gets tasks from server . run only once on init
    var fetchTasks = function() {
      DashboardTasksService.fetchTasks(fetchTasksResponseHandler);
    }

    var fetchTasksResponseHandler = function(tasks) {
      $scope.tasks = tasks;
      // console.log($scope.tasks)
      if(!$scope.tasks.length){
        var result = angular.element( document.querySelector( '#task-filterbar' ) );
        // console.log(result[0].childNodes[1].style)
        console.log(result)
        if(result.length)
          result[0].childNodes[1].style.marginTop = '10%'
      }
      $scope.$emit('UPDATETASKCOUNT');
    }


    // listen for taskcount
    $scope.$on('UPDATETASKCOUNT', function(event) {
      var taskcount = 0;
      if ($scope.tasks) {
        angular.forEach($scope.tasks, function(task) {
          if (task.deleted === false)
            taskcount += 1;
        });
        $scope.taskcount = taskcount;
      }
    });

    $scope.myGoBack = function() {
      // console.log("c b b");
      // $ionicHistory.goBack();
      $window.history.back();
    };
    $scope.showSortingActionsheet = function() {
      $ionicActionSheet.show({
        titleText: 'Sorting',
        buttons: DashboardTasksService.getButtons("SORT"),
        // destructiveText: 'Delete',
        cancelText: 'Cancel',
        cancel: function() {
          //                    console.log('CANCELLED');
        },
        buttonClicked: function(index) {
          //                    console.log('BUTTON CLICKED', index);
          DashboardTasksService.setButtonClicked("SORT", index);
          return true;
        },
        // destructiveButtonClicked: function() {
        //     console.log('DESTRUCT');
        //     return true;
        // }
      });
    };

  }
})();
