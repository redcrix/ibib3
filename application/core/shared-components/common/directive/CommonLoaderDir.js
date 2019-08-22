(function(){
	'use strict';
	projectCostByte.directive('commonLoaderDirective',function($rootScope){
		return {
			restrict: 'A',
			link : function($rootScope,lelement,lAttributes){

				$rootScope.$on("show_busy",function(event){
					$rootScope.countServiceCalls++;
					return element.show();
				}); 

				$rootScope.$on("hide_busy", function(){
					$rootScope.countServiceCalls--;
					return element.hide();
				});
			}
		}
	});
})();