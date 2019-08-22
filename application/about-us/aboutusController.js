(function() {
  var AboutusCtrl = function ($scope, $cordovaAppVersion) {
    var that = this;
    $scope.navBarTitle.showToggleButton = false;
    this.init = function() {

        $cordovaAppVersion.getVersionNumber().then(function(version){
            var v = version;
            that.versionNumber = v;
         });
    }

}
  AboutusCtrl.$inject = ['$scope','$cordovaAppVersion'];
  projectCostByte.controller('AboutusCtrl', AboutusCtrl);
})();
