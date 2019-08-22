(function () {
    'use strict';

    projectCostByte.directive('taskcreationpopup', taskcreationpopup);
    taskcreationpopup.$inject = ['$ionicModal'];

    function taskcreationpopup($ionicModal) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                taskCreation: "="
            },
            link: function ($scope, element, attribute) {

                $ionicModal.fromTemplateUrl('application/task-creation/taskCreationPopupView.html', {
                    scope: $scope.taskCreation,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal
                });

                $scope.taskCreation.openModal = function () {
                    $scope.modal.show()
                };
            }
        }
    }
})();
