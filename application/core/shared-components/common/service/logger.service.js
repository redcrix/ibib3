(function() {
    'use strict';

    projectCostByte.factory('Logger', loggerService);

    loggerService.$inject = ['CommonService'];

    function loggerService(CommonService) {

        var loggerFactory = {
            info: info,
            warning: warning,
            error: error
        };

        function info(message) {
            console.log(message);
            CommonService.sendLoggerMessage(message, 'info');
        }

        function warning(message) {
            console.log(message);
            CommonService.sendLoggerMessage(message, 'warning');
        }

        function error(message) {
            console.log(message);
            CommonService.sendLoggerMessage(message, 'error');
        }

        return loggerFactory;
    }
})();

