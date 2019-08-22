
// (function(){
// 	'use strict';
// 	projectCostByte.directive('ngMatch',['$parse', function ($parse) {
// 		var directive = {
// 			link: link,
// 			restrict: 'A',
// 			require: '?ngModel'
// 		};
// 			return directive;
			 
// 			function link(scope, elem, attrs, ctrl) {
// 			// if ngModel is not defined, we don't need to do anything
// 			if (!ctrl) return;
// 			if (!attrs[directiveId]) return;
			 
// 			var firstPassword = $parse(attrs[directiveId]);
			 
// 			var validator = function (value) {
// 			var temp = firstPassword(scope),
// 			v = value === temp;
// 			ctrl.$setValidity('match', v);
// 			return value;
// 			}
			 
// 			ctrl.$parsers.unshift(validator);
// 			ctrl.$formatters.push(validator);
// 			attrs.$observe(directiveId, function () {
// 			validator(ctrl.$viewValue);
// 			});
			 
// 			}
// 	}]);
// })();
(function(){
	'use strict';
	projectCostByte.directive('compareTo',function($rootScope){
		var compareTo = function() {
		    return {
		        require: "ngModel",
		        scope: {
		            otherModelValue: "=compareTo"
		        },
		        link: function(scope, element, attributes, ngModel) {
		             
		            ngModel.$validators.compareTo = function(modelValue) {
		                return modelValue == scope.otherModelValue;
		            };
		 
		            scope.$watch("otherModelValue", function() {
		                ngModel.$validate();
		            });
		        }
		    };
		};
	});
})();