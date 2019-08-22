angular.module('costbyte.copfilters', [])

.filter('makePositive', function() {
    return function(num) {
        return Math.abs(num);
    }
    }
    )
.filter('titleCase', function() {
return function(input) {
  input = input || '';
  return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
})
;