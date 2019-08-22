(function () {
    'use strict'
    projectCostByte.controller('DocumentSelectionCtrl', documentSelectionCtrl);

    documentSelectionCtrl.$inject = ['$q', '$scope', '$rootScope', '$state', 'DocumentSelectionService','appModalService'];

    function documentSelectionCtrl($q, $scope, $rootScope, $state, DocumentSelectionService,appModalService) {
        $scope.supplierList = [];
        $rootScope.isChagesExist = false;
        $scope.getSupplierList = function () {
            DocumentSelectionService.fetchSuppliers().then(function (suppliers) {
                //DocumentSelectionService.fetchSuppliers(function(suppliers){
                // console.log(suppliers);
                $scope.supplierList = suppliers;
                $rootScope.$broadcast('suppliers', $scope.supplierList);
            });
        }
        var modal_shown = true;
        $scope.summaryClickHandler = function () {
            if(!$rootScope.isChagesExist) {
                $state.go('app.invoices.summary');
            }else {
                $rootScope.discardChangesFrom.name = 'invoiceSummaryCalled';
                $rootScope.discardChangesFrom.value = 'app.invoices.summary';
                if (modal_shown) {
                    // console.log("showing conversion");
                    modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
                }
                return modal_shown
            }
        };

        $scope.configClickHandler = function() {
            if(!$rootScope.isChagesExist) {
                $state.go('app.invoices.config');
            }else {
                $rootScope.discardChangesFrom.name = 'invoiceConfigCalled';
                $rootScope.discardChangesFrom.value = 'app.invoices.config';
                if (modal_shown) {
                    // console.log("showing conversion");
                    modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
                }
                return modal_shown
            }
        }

        $scope.invoicesClickHandler = function () {
            if(!$rootScope.isChagesExist) {
                $state.go('app.invoices.trackings');
            }else {
                $rootScope.discardChangesFrom.name = 'invoiceTrackingCalled';
                $rootScope.discardChangesFrom.value = 'app.invoices.trackings';
                if (modal_shown) {
                    // console.log("showing conversion");
                    modal_shown = appModalService.show('application/invoice-tracking/view/configConfirmation.html', 'ConfigConfirmationCtrl',$rootScope.discardChangesFrom)
                }
                return modal_shown
            }
        };

        // $scope.uploadClickHandler = function () {
        //     $state.go('app.invoices.uploads');
        // };

    }

})();
