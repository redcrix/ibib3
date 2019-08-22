(function(){
    'use strict';
    projectCostByte.directive('isbPieChart',function(){
        return {
            restrict : 'E',
            templateUrl : 'application/core/shared-components/isb-pie-chart/view/IsbPieChartDirView.html',
            scope : {
                data : '=',
                labels: "=",
                title: "="
            },
            link : function(scope,element,attribute){
                scope.pieChartOptions = {
                    'height':500,
                    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
                }
            }
        }
    });
})();
