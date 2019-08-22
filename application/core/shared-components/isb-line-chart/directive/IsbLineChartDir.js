(function(){
    'use strict';
    projectCostByte.directive('isbLineChart',function(){
        return {
            restrict : 'E',
            templateUrl : 'application/core/shared-components/isb-line-chart/view/IsbLineChartDirView.html',
            scope : {
                data : '=',
                horizontalAxisLabels : '=',
                legendLabels: '=',
                title: '=',
                scaleprefix: '=',
                scalesuffix: '=',
                showLegend: '=',
                responsive: '='

            },
            link : function(scope,element,attribute){

                var truncateDecimals = function (number, digits) {
                    var multiplier = Math.pow(10, digits),
                        adjustedNum = number * multiplier,
                        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

                    return truncatedNum / multiplier;
                };

                // let legendTemplateString = function(){return ""};
                // if (scope.legendLabels && scope.showLegend){
                //     legendTemplateString = "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>";
                // }
                // console.log("responsive", scope.responsive);
                scope.lineChartOptions = {
                    legend: { display: scope.showLegend ,
                        position: 'bottom'},
                    showTooltips: true,
                    bezierCurve : true,
                    datasetFill : true,
                    pointDotRadius : 2,
                    datasetStrokeWidth : 2,

                    // legendTemplate : legendTemplateString,
                    // scaleLabel: function (label) {
                    //                 return (scope.scaleprefix||'') + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +(scope.scalesuffix||'');
                    //             }
                    scales: {
                        yAxes: [{
                            ticks: {
                                // Include a prefix and suffix sign in the y-ticks
                                callback: function (value, index, values) {
                                    let negative = "";
                                    if (value<0){negative = "-"}
                                    let result  = truncateDecimals(Math.abs(value), 2);

                                    if (angular.isDefined(scope.scaleprefix) && scope.scaleprefix!==""){
                                        result = scope.scaleprefix + result;
                                    }
                                    if (angular.isDefined(scope.scalesuffix  && scope.scalesuffix!=="")){
                                        result = result + scope.scalesuffix;
                                    }
                                    return negative+result;
                                }
                            }
                        }]
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: function(tooltipItem, data) {
                                let label = data.datasets[tooltipItem.datasetIndex].label;
                                let datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                
                                if (angular.isDefined(scope.scaleprefix) && scope.scaleprefix!==""){
                                    datasetLabel = scope.scaleprefix + datasetLabel;
                                }
                                if (angular.isDefined(scope.scalesuffix  && scope.scalesuffix!=="")){
                                    datasetLabel = datasetLabel + scope.scalesuffix;
                                }

                                return label + ': ' + datasetLabel;

                            }
                        }
                    },
                };
                // if(scope.responsive)
                //     scope.lineChartOptions.responsive = scope.responsive;

                scope.lineChartColors =  [
                    {
                        borderColor: 'rgba(17,193,243,0.5)',
                        backgroundColor: 'rgba(151,187,205,0.2)'

                    },
                    {
                        borderColor: 'rgba(255,69,0,0.5)',
                        backgroundColor: 'rgba(220,220,220,0.2)'
                    }

                ];


            }
        }
    });
})();
