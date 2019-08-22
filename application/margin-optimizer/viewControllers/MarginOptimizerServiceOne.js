(function () {
    'use strict';

    projectCostByte.factory('MarginOptimizerServiceOne', marginOptimizerServiceOne);



    marginOptimizerServiceOne.$inject = ['$q', 'CommonService', '$timeout', 'Utils'];

    function marginOptimizerServiceOne($q, CommonService, $timeout, Utils) {

        var marginOptimizerData = {};
        marginOptimizerData['groupByKeys'] = [{
                displayKey: 'Menu Section',
                key: 'sectionName',
                selected: true,
                quartile: false
            },
            //                                              {displayKey:'Dollar Sales', key: 'dollarSalesQuartile', selected:false, quartile: true},
            {
                displayKey: 'Dollar Sales',
                key: 'dollarSalesQuartile',
                selected: false,
                quartile: false
            }, {
                displayKey: 'Profitability',
                key: 'weightedContributionMarginQuartile',
                selected: false,
                quartile: false
            }, {
                displayKey: 'No grouping',
                key: 'NOGROUPING',
                selected: false,
                quartile: false
            },
        ];
        marginOptimizerData.displayIcons = {
            'price': 'ion-pricetag',
            'quantity': 'ion-android-cart',
            'cost': 'ion-cash',
            'sales': 'ion-connection-bars',
            'alert': 'ion-alert-circled',
        }

        marginOptimizerData.sortingButtons = [{
            'label': 'Top Sales',
            'filter_tag': 'top_sales',
            'style': 'button-positive',
            'clicked': true,
            'sortClass': '-dollarSales',
            'icon': 'ion-trophy'
            }, {
            'label': 'Low Sales',
            'filter_tag': 'low_sales',
            'style': 'button-positive',
            'clicked': false,
            'sortClass': 'dollarSales',
            'icon': 'ion-arrow-graph-down-right'
            }, {
            'label': 'High Cost',
            'filter_tag': 'high_cost',
            'style': 'button-positive',
            'clicked': false,
            'sortClass': '-costPercent',
            // 'icon': 'ion-alert'
            'icon': 'ion-arrow-graph-up-right'
            },{
            'label': 'All',
            'filter_tag': 'all',
            'style': 'button-positive',
            'clicked': false,
            'sortClass': 'menuItemName',
            'icon': 'ion-checkmark-circled'
            }]
        //        marginOptimizerData.selectedMenuTypeOptions = {}
        marginOptimizerData.dummyData = [
            {
                "costPercent": 0.31,
                "section": "WINGS-EMPANADAS",
                "menuItems": [{
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 586.83000000000004,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 0.81999999999999995,
                    "menuItemAveragePrice": 3.9700000000000002,
                    "basePrice": 4.0700000000000003,
                    "menuItem": "MENU350",
                    "menuItemAverageCost": 0.81999999999999995,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Sweet Street Empanada"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 434.29000000000002,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 7.1900000000000004,
                    "menuItemAveragePrice": 18.879999999999999,
                    "basePrice": 18.870000000000001,
                    "menuItem": "MENU347",
                    "menuItemAverageCost": 7.1600000000000001,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "21 Wings"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 803.35000000000002,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 0.93999999999999995,
                    "menuItemAveragePrice": 3.9199999999999999,
                    "basePrice": 4.0700000000000003,
                    "menuItem": "MENU352",
                    "menuItemAverageCost": 0.94999999999999996,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Curry Chicken Empanada"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 56.539999999999999,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 10.84,
                    "menuItemAveragePrice": 28.27,
                    "basePrice": 28.27,
                    "menuItem": "MENU348",
                    "menuItemAverageCost": 10.800000000000001,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "32 Wings"
            }],
                "avgWeightedContributionMargin": 0.0,
                "sectionName": "Wings-empanadas"
        }, {
                "costPercent": 0.27000000000000002,
                "section": "QUESADILLAS",
                "menuItems": [{
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 908.66999999999996,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 3.6200000000000001,
                    "menuItemAveragePrice": 10.1,
                    "basePrice": 9.9700000000000006,
                    "menuItem": "MENU316",
                    "menuItemAverageCost": 3.6400000000000001,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Shrimp Quesadilla"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 433.04000000000002,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 2.46,
                    "menuItemAveragePrice": 9.4100000000000001,
                    "basePrice": 9.1699999999999999,
                    "menuItem": "MENU65",
                    "menuItemAverageCost": 2.4500000000000002,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Chorizo Quesadilla"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 389.52999999999997,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 4.04,
                    "menuItemAveragePrice": 11.460000000000001,
                    "basePrice": 11.470000000000001,
                    "menuItem": "MENU318",
                    "menuItemAverageCost": 4.0599999999999996,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Gator Quesadilla"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 565.41999999999996,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 2.3900000000000001,
                    "menuItemAveragePrice": 9.1199999999999992,
                    "basePrice": 8.8699999999999992,
                    "menuItem": "MENU312",
                    "menuItemAverageCost": 2.3999999999999999,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Beef Quesadilla"
            }],
                "avgWeightedContributionMargin": 0.0,
                "sectionName": "Quesadillas"
        }, {
                "costPercent": 0.40000000000000002,
                "section": "APPETIZERS",
                "menuItems": [{
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 1485.6800000000001,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 4.0899999999999999,
                    "menuItemAveragePrice": 9.3399999999999999,
                    "basePrice": 9.3699999999999992,
                    "menuItem": "MENU236",
                    "menuItemAverageCost": 4.0899999999999999,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "YUCKY YUCCA FRIES"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 536.60000000000002,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 2.7999999999999998,
                    "menuItemAveragePrice": 7.1500000000000004,
                    "basePrice": 7.8700000000000001,
                    "menuItem": "MENU246",
                    "menuItemAverageCost": 2.77,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Macho Nacho"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 2689.2399999999998,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 1.2,
                    "menuItemAveragePrice": 3.3999999999999999,
                    "basePrice": 3.4700000000000002,
                    "menuItem": "MENU234",
                    "menuItemAverageCost": 1.3200000000000001,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "MEXICAN STREET CORN"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 676.13,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 1.22,
                    "menuItemAveragePrice": 4.0499999999999998,
                    "basePrice": 4.1699999999999999,
                    "menuItem": "MENU244",
                    "menuItemAverageCost": 1.22,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "PLAINTAINS"
            }],
                "avgWeightedContributionMargin": 0.0,
                "sectionName": "Appetizers"
        }, {
                "costPercent": 0.22,
                "section": "TACOS",
                "menuItems": [{
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 2042.47,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 0.45000000000000001,
                    "menuItemAveragePrice": 3.2799999999999998,
                    "basePrice": 3.5699999999999998,
                    "menuItem": "MENU340",
                    "menuItemAverageCost": 0.41999999999999998,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Chicky Baby Taco"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 1952.75,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 0.56000000000000005,
                    "menuItemAveragePrice": 3.3900000000000001,
                    "basePrice": 3.5699999999999998,
                    "menuItem": "MENU345",
                    "menuItemAverageCost": 0.57999999999999996,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Original Taco"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 2119.3000000000002,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 0.68000000000000005,
                    "menuItemAveragePrice": 3.3700000000000001,
                    "basePrice": 3.5699999999999998,
                    "menuItem": "MENU342",
                    "menuItemAverageCost": 0.65000000000000002,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Carnitas Taco"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 2885.1399999999999,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 1.0,
                    "menuItemAveragePrice": 3.3999999999999999,
                    "basePrice": 3.5699999999999998,
                    "menuItem": "MENU343",
                    "menuItemAverageCost": 0.96999999999999997,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Spicy Shrimp"
            }],
                "avgWeightedContributionMargin": 0.0,
                "sectionName": "Tacos"
        }, {
                "costPercent": 0.27000000000000002,
                "section": "BURGERS",
                "menuItems": [{
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 355.23000000000002,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 4.2199999999999998,
                    "menuItemAveragePrice": 12.25,
                    "basePrice": 13.07,
                    "menuItem": "MENU261",
                    "menuItemAverageCost": 4.21,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Fidel Burger"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 643.77999999999997,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 3.0699999999999998,
                    "menuItemAveragePrice": 13.140000000000001,
                    "basePrice": 13.07,
                    "menuItem": "MENU266",
                    "menuItemAverageCost": 3.0800000000000001,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Poblano Blue Burger"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 1859.73,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 2.1699999999999999,
                    "menuItemAveragePrice": 10.69,
                    "basePrice": 9.3699999999999992,
                    "menuItem": "MENU256",
                    "menuItemAverageCost": 2.1699999999999999,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "O.G.BURGER"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 559.64999999999998,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 3.8199999999999998,
                    "menuItemAveragePrice": 13.02,
                    "basePrice": 13.57,
                    "menuItem": "MENU259",
                    "menuItemAverageCost": 3.7799999999999998,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Burro Bustin Burger"
            }],
                "avgWeightedContributionMargin": 0.0,
                "sectionName": "Burgers"
        }, {
                "costPercent": 0.29999999999999999,
                "section": "BURRITOS",
                "menuItems": [{
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 1683.04,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 2.5299999999999998,
                    "menuItemAveragePrice": 10.65,
                    "basePrice": 9.9700000000000006,
                    "menuItem": "MENU276",
                    "menuItemAverageCost": 2.54,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Bahama Bump"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 695.84000000000003,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 1.95,
                    "menuItemAveragePrice": 10.539999999999999,
                    "basePrice": 9.9700000000000006,
                    "menuItem": "MENU281",
                    "menuItemAverageCost": 1.95,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Lola's Secret Garden"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 191.78,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 3.6499999999999999,
                    "menuItemAveragePrice": 9.1300000000000008,
                    "basePrice": 8.8699999999999992,
                    "menuItem": "MENU271",
                    "menuItemAverageCost": 3.6499999999999999,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Stinkin Badges"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 579.83000000000004,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 4.5999999999999996,
                    "menuItemAveragePrice": 13.18,
                    "basePrice": 13.07,
                    "menuItem": "MENU286",
                    "menuItemAverageCost": 4.6100000000000003,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Dirty Sanchez"
            }],
                "avgWeightedContributionMargin": 0.0,
                "sectionName": "Burritos"
        }, {
                "costPercent": 0.29999999999999999,
                "section": "STREET SIDES",
                "menuItems": [{
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 787.61000000000001,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 2.0299999999999998,
                    "menuItemAveragePrice": 6.9100000000000001,
                    "basePrice": 6.9699999999999998,
                    "menuItem": "MENU335",
                    "menuItemAverageCost": 2.3599999999999999,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Guacamole (large)"
            }, {
                    "menuEngineeringFilterTag": "STARS",
                    "dollarSales": 14.07,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 0.14000000000000001,
                    "menuItemAveragePrice": 0.67000000000000004,
                    "basePrice": 0.67000000000000004,
                    "menuItem": "MENU330",
                    "menuItemAverageCost": 0.14999999999999999,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Pineapple Salsa (small)"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 117.72,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 0.62,
                    "menuItemAveragePrice": 3.1800000000000002,
                    "basePrice": 3.27,
                    "menuItem": "MENU326",
                    "menuItemAverageCost": 0.62,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Refried Beans"
            }, {
                    "menuEngineeringFilterTag": "STARS",
                    "dollarSales": 630.51999999999998,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 0.23000000000000001,
                    "menuItemAveragePrice": 0.77000000000000002,
                    "basePrice": 0.77000000000000002,
                    "menuItem": "MENU337",
                    "menuItemAverageCost": 0.23999999999999999,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Sour Cream"
            }],
                "avgWeightedContributionMargin": 0.0,
                "sectionName": "Street sides"
        }, {
                "costPercent": 0.32000000000000001,
                "section": "ENTREES",
                "menuItems": [{
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 272.17000000000002,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 4.4500000000000002,
                    "menuItemAveragePrice": 13.609999999999999,
                    "basePrice": 13.57,
                    "menuItem": "MENU296",
                    "menuItemAverageCost": 4.3700000000000001,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Baa Baa Baa"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 117.36,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 5.4100000000000001,
                    "menuItemAveragePrice": 14.67,
                    "basePrice": 14.67,
                    "menuItem": "MENU294",
                    "menuItemAverageCost": 5.3300000000000001,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Sea Scallops Tacos"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 1263.95,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 3.4300000000000002,
                    "menuItemAveragePrice": 14.699999999999999,
                    "basePrice": 14.67,
                    "menuItem": "MENU74",
                    "menuItemAverageCost": 3.4199999999999999,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Enchiladas"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 213.24000000000001,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 8.2899999999999991,
                    "menuItemAveragePrice": 17.77,
                    "basePrice": 17.77,
                    "menuItem": "MENU293",
                    "menuItemAverageCost": 7.9000000000000004,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Paella De Carne"
            }],
                "avgWeightedContributionMargin": 0.0,
                "sectionName": "Entrees"
        }, {
                "costPercent": 0.27000000000000002,
                "section": "SALADS",
                "menuItems": [{
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 460.06,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 1.8899999999999999,
                    "menuItemAveragePrice": 10.699999999999999,
                    "basePrice": 8.3699999999999992,
                    "menuItem": "MENU320",
                    "menuItemAverageCost": 1.8899999999999999,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Chavez Salad"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 373.48000000000002,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 3.3199999999999998,
                    "menuItemAveragePrice": 12.449999999999999,
                    "basePrice": 12.57,
                    "menuItem": "MENU322",
                    "menuItemAverageCost": 3.0,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Grilled Chimi Steak Salad"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 243.91999999999999,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 0.81999999999999995,
                    "menuItemAveragePrice": 5.1900000000000004,
                    "basePrice": 4.1699999999999999,
                    "menuItem": "MENU323",
                    "menuItemAverageCost": 0.82999999999999996,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Lolas House (SIDE) Salad"
            }, {
                    "menuEngineeringFilterTag": "PLOUGHHORSES",
                    "dollarSales": 2472.3099999999999,
                    "dollarSalesChange": 0.0,
                    "weightedContributionMargin": 0.0,
                    "baseCost": 2.9100000000000001,
                    "menuItemAveragePrice": 10.390000000000001,
                    "basePrice": 10.07,
                    "menuItem": "MENU321",
                    "menuItemAverageCost": 3.04,
                    "menuItemThresholdCost": 31.0,
                    "menuItemName": "Tito Puentes Taco Salad"
            }],
                "avgWeightedContributionMargin": 0.0,
                "sectionName": "Salads"
        }]
        marginOptimizerData.dummyMenus = [
            {
                "category": "Food",
                "avgWeightedContributionMargin": 0.0,
                "dollarSales": 6555.5800000000017,
                "categoryName": "Food",
                "menuTypeName": "Food",
                "menuType": "Food",
                "costPercent": 0.0
        }, {
                "category": "KIDS MENU",
                "avgWeightedContributionMargin": 0.0,
                "dollarSales": 783.6700000000011,
                "categoryName": "Kids menu",
                "menuTypeName": "Food",
                "menuType": "Food",
                "costPercent": 0.25633169802665351
        }, {
                "category": "BRUNCH MENU",
                "avgWeightedContributionMargin": 0.0,
                "dollarSales": 310.82999999999998,
                "categoryName": "Brunch menu",
                "menuTypeName": "Food",
                "menuType": "Food",
                "costPercent": 0.15642179069610496
        }, {
                "category": "Liquor",
                "avgWeightedContributionMargin": 0.0,
                "dollarSales": 40610.020000000281,
                "categoryName": "Liquor",
                "menuTypeName": "Liquor",
                "menuType": "Liquor",
                "costPercent": 0.0
        }, {
                "category": "MAIN MENU",
                "avgWeightedContributionMargin": 0.0,
                "dollarSales": 88151.88000000047,
                "categoryName": "Main menu",
                "menuTypeName": "Food",
                "menuType": "Food",
                "costPercent": 0.29250664074022159
        }]
        var marginOptimizerFactoryOne = {
            fetchSelectedMenuType: fetchSelectedMenuType,
            setSelectedMenuType: setSelectedMenuType,
            fetchSortingButtons: fetchSortingButtons,
            fetchMenus: fetchMenus,
            changeSelectedMenu: changeSelectedMenu,
            getSelectedMenuData: getSelectedMenuData,
            getSelectedSectionData: getSelectedSectionData,
            getSelectedMenuItemData: getSelectedMenuItemData,
            getSelectedMenuIngredients: getSelectedMenuIngredients,
            getSelectedRecipeIngredients: getSelectedRecipeIngredients,
            getSelectedMenuIngredientsEdit: getSelectedMenuIngredientsEdit,
            getMenuIngredientToEdit: getMenuIngredientToEdit,
            updateTotalIngredientCost: updateTotalIngredientCost,
            setMenuRecipeIngredients: setMenuRecipeIngredients,
            updateMenuItemByRecipeEdit: updateMenuItemByRecipeEdit,
            getIcon: getIcon,
            fetchDetailedModsData: fetchDetailedModsData,
            getGroupByKeys: getGroupByKeys,
            changeGrouping: changeGrouping,
            fetchMarginOptimizerMenuItemEditIngredientsV2: fetchMarginOptimizerMenuItemEditIngredientsV2,
            getSelectedRecipeIngredientsNew: getSelectedRecipeIngredientsNew,
            getIngredientList: getIngredientList,
            getSelecteFreshdMenuItemData: getSelecteFreshdMenuItemData,
            getSelectedFreshMenuIngredients: getSelectedFreshMenuIngredients,
            getRefreshScreenMenuIngredients: getRefreshScreenMenuIngredients
        };

        function getIcon(iconType) {
            if (marginOptimizerData.displayIcons.hasOwnProperty(iconType))
                return marginOptimizerData.displayIcons[iconType];
            return "";
        }

        function fetchSelectedMenuType(returnType) {
            //            console.log(marginOptimizerData.selectedMenuTypeOptions)
            if (angular.isUndefined(marginOptimizerData.selectedMenuTypeOptions)) {
                marginOptimizerData.selectedMenuType = "Food";
                return marginOptimizerData.selectedMenuType;
            } else {
                if (!marginOptimizerData.hasOwnProperty('selectedMenuType')) {
                    marginOptimizerData.selectedMenuType = "Food";
                }
                if (angular.isUndefined(returnType)) {
                    return marginOptimizerData.selectedMenuTypeOptions[marginOptimizerData.selectedMenuType];
                } else if (returnType == 'key') {
                    return marginOptimizerData.selectedMenuType;
                } else {
                    return marginOptimizerData.selectedMenuTypeOptions[marginOptimizerData.selectedMenuType];
                }
            }
        }

        function setSelectedMenuType(menuType) {
            if (angular.isUndefined(menuType)) {
                if (!marginOptimizerData.hasOwnProperty('selectedMenuType') || marginOptimizerData.selectedMenuType == "") {
                    marginOptimizerData.selectedMenuType = "Food";
                }
            } else {
                if (_.includes(_.keysIn(marginOptimizerData.selectedMenuTypeOptions), menuType)) {
                    marginOptimizerData.selectedMenuType = menuType;
                } else {
                    marginOptimizerData.selectedMenuType = "Food";
                }
            }
        }

        function setMenuTypeOptions(actualOptions) {
            var possibleOptionsHC = ['Food', 'Liquor'];
            marginOptimizerData['selectedMenuTypeOptions'] = {};
            _.forEach(possibleOptionsHC, function (pOpt) {
                _.forEach(actualOptions, function (aOpt) {
                    if (pOpt.toLowerCase() == aOpt.toLowerCase()) {
                        marginOptimizerData['selectedMenuTypeOptions'][pOpt] = aOpt;
                    }
                })

            })
            setSelectedMenuType();
        }

        function fetchSortingButtons(responseHandler) {
            if (marginOptimizerData.hasOwnProperty('sortingButtons')) {
                return $timeout(function () {
                    responseHandler(marginOptimizerData.sortingButtons)
                }, 1);

            }

            var fetchSortingButtonsRHW = function (sortingButtons) {
                marginOptimizerData['sortingButtons'] = sortingButtons;
                responseHandler(sortingButtons);
            }

            CommonService.fetchMarginOptimizerSortingButtons(fetchSortingButtonsRHW);

        }


        function fetchMenus(responseHandler) {
            var selectedMenuType = fetchSelectedMenuType();
            if (marginOptimizerData.hasOwnProperty('menusData')) {
                if (marginOptimizerData['menusData'].hasOwnProperty(selectedMenuType)) {
                    return $timeout(function () {
                        responseHandler(marginOptimizerData['menusData'][selectedMenuType])
                    }, 1);
                }
            }

            var fetchMenusRHW = function (menus_orig) {
                // console.log("menus",menus)
                var menus = angular.copy(menus_orig)
                var menuAll=[{
                       "category"      :"ALL",
                       "categoryName"  :"ALL",
                       "menuType"      :"FOOD",
                      "menuTypeName"  :"FOOD"
                       },
                       {
                       "category"      :"ALL",
                       "categoryName"  :"ALL",
                       "menuType"      :"LIQUOR",
                      "menuTypeName"  :"LIQUOR"
                   }]

                    _.forEach(menuAll,function(item){
                       menus.push(item);
                   })
                    // console.log("menus",menus)
                // sorting menu categories by dollar sales considering cost percent
                menus.sort(function (a, b) {
                    return (b.dollarSales * b.costPercent - a.dollarSales * a.costPercent);
                })

                _.forEach(menus, function (menu) {
                    menu['selected'] = false;
                    var categoryName = menu['categoryName'],
                        menuName = menu['menuTypeName'];
                    if (categoryName == menuName && categoryName != 'Liquor') {
                        menu['categoryNameDisplay'] = 'other';
                    } else {
                        menu['categoryNameDisplay'] = categoryName;
                    }

                })

                // group menus by menu type
                var grouped_menus = _.groupBy(menus, 'menuType');
                var grouped_keys = _.keysIn(grouped_menus);
                _.forEach(grouped_keys, function (key) {
                    grouped_menus[key][0]['selected'] = true;
                })
                setMenuTypeOptions(grouped_keys);
                marginOptimizerData['menusData'] = grouped_menus;

                responseHandler(marginOptimizerData['menusData'][fetchSelectedMenuType()]);

            } //fetchMenusRHW


            CommonService.fetchMarginOptimizerMenusV2(fetchMenusRHW, fetchSelectedMenuType('key'));
            //            $timeout(fetchMenusRHW(marginOptimizerData.dummyMenus),2)

        }



        function changeSelectedMenu(selectedIndex, responseHandler) {
            var selectedMenuType = fetchSelectedMenuType();
            _.forEach(marginOptimizerData['menusData'][selectedMenuType], function (menuDataSet) {
                menuDataSet['selected'] = false;
            })
            marginOptimizerData['menusData'][selectedMenuType][selectedIndex]['selected'] = true;

            responseHandler(marginOptimizerData['menusData'][selectedMenuType]);


        }

        function findSelectedMenu(returnKeyName) {
            var selectedMenuType = fetchSelectedMenuType();
            if (marginOptimizerData.hasOwnProperty('menusData')) {
                if (returnKeyName == "index") {
                    return _.findIndex(marginOptimizerData['menusData'][selectedMenuType], 'selected')
                } else {
                    var selectedMenu = _.find(marginOptimizerData['menusData'][selectedMenuType], 'selected');
                    return _.get(selectedMenu, returnKeyName, "")
                }
            }
            //            for (var i = 0; i < marginOptimizerData['menusData'][fetchSelectedMenuType()].length; i++) {
            //
            //                if (marginOptimizerData['menusData'][fetchSelectedMenuType()][i]['selected']) {
            //                    if (returnKeyName == "index") {
            //                        return i;
            //                    } else {
            //                        return marginOptimizerData['menusData'][fetchSelectedMenuType()][i][returnKeyName]
            //                    }
            //                }
            //            };
        }



        function getSelectedMenuData(responseHandler) {

            changeMenuData(responseHandler);

        }

        function changeMenuData(responseHandler) {
            var category = findSelectedMenu("category");
            var menuType = fetchSelectedMenuType();
            //            console.log(menuType)
            if (angular.isDefined(category) && category!=""){
              var request_definition = {
                  'category': category,
                  'menuType': menuType
              };
              var changeMenuDataRHW = function (sectionList_orig) {
                  var sectionList = angular.copy(sectionList_orig)
                  if (!marginOptimizerData.hasOwnProperty(category)) {
                      marginOptimizerData[category] = {}
                  }
                  marginOptimizerData[category][menuType] = addMenuAndCategoryToSections(category, menuType, sectionList);
                  sortByAndGroupBy(marginOptimizerData[category][menuType]).then(
                      function (sorted_grouped_list) {
                          responseHandler(sorted_grouped_list)
                      })
              }
              if (marginOptimizerData.hasOwnProperty(category)) {
                  if (marginOptimizerData[category].hasOwnProperty(menuType)) {
                      sortByAndGroupBy(marginOptimizerData[category][menuType]).then(
                          function (sorted_grouped_list) {
                              responseHandler(sorted_grouped_list)
                            })
                  }
              }
              CommonService.fetchMarginOptimizerMenuDataV2(changeMenuDataRHW, request_definition);
            }else {
              responseHandler([])
            }
        }


        function sortByAndGroupBy(sectionList) {
            return $q(function (resolve, reject) {
                var full_menu_items_list = _.reduce(sectionList, function (full_list, section) {
                    return _.concat(full_list, section.menuItems);
                }, []);

                //                var sortByKey = _.get(_.find(marginOptimizerData['sortByKeys'], 'selected'), 'key'),
                //                sortDirection = _.get(_.find(marginOptimizerData['sortByKeys'], 'selected'), 'direction'),
                var groupByKey = _.get(_.find(marginOptimizerData['groupByKeys'], 'selected'), 'key'),
                    groupByKeyIfQuartile = _.get(_.find(marginOptimizerData['groupByKeys'], 'selected'), 'quartile');
                //                console.log(groupByKey)

                //                var sorted_list = _.sortBy(full_menu_items_list, [function(o) {
                //                                            if (isFinite(o[sortByKey])){
                //                                                return sortDirection * o[sortByKey];
                //                                            }else{
                //                                                return 9999999999;
                //                                            }
                //                                        }
                //                                        ]
                //
                //
                //                                  );

                //                _.forEach(sorted_list, function(o, index){
                //                    o['sortedIndex'] = index;
                //                })

                var grouped_dict = {
                    'All items': full_menu_items_list
                }

                if (groupByKey != 'NOGROUPING') {
                    grouped_dict = _.groupBy(full_menu_items_list, groupByKey)
                }

                //                console.log(grouped_dict)

                var grouped_list = _.map(grouped_dict, function (menu_items, group_name) {

                    var dollarSales = 0,
                        dollarCosts = 0;
                    //                      sortedIndex = 99999;

                    _.forEach(menu_items, function (menu_item) {
                        dollarSales = dollarSales + menu_item.dollarSales;
                        if (isFinite(menu_item.costPercent)) {
                            dollarCosts = dollarCosts + menu_item.dollarSales * menu_item.costPercent;
                        }
                        //                        if(menu_item.sortedIndex < sortedIndex){
                        //                            sortedIndex = menu_item.sortedIndex
                        //                        }
                    })


                    return {
                        'groupDisplayName': groupByKeyIfQuartile ? "Quartile " + group_name : group_name,
                        'dollarSales': dollarSales,
                        'costPercent': dollarCosts / dollarSales,
                        //                            'sortedIndex': sortedIndex,
                        'menuItems': menu_items
                    }

                })


                var grouped_list = _.sortBy(grouped_list, [function (o) {
                    return o.sortedIndex;
                }]);
                //                console.log(grouped_list)
                resolve(grouped_list);

            });


        }

        function addMenuAndCategoryToSections(category, menuType, sectionList) {
            if (angular.isDefined(sectionList)) {
                var maxSales = maxSalesInSectionList(sectionList);

                //                for (var i = 0; i < sectionList.length; i++) {
                //                    var sectionName = sectionList[i]['sectionName'];
                //                    sectionList[i]['category'] = category;
                //                    sectionList[i]['menuType'] = menuType;
                //                    if (sectionName == category && category != 'Liquor') {
                //                        sectionList[i]['sectionNameDisplay'] = 'other';
                //                    } else {
                //                        sectionList[i]['sectionNameDisplay'] = sectionName;
                //                    }
                //
                //                    sectionList[i]['dollarSales'] = Utils.sumOf(sectionList[i]['menuItems'], 'dollarSales');
                //
                ////                    for (var j = 0; j < sectionList[i]['menuItems'].length; j++) {
                ////                        sectionList[i]['menuItems'][j]['category'] = category;
                ////                        sectionList[i]['menuItems'][j]['menuType'] = menuType;
                ////                        sectionList[i]['menuItems'][j]['sectionName'] = sectionName;
                ////                        sectionList[i]['menuItems'][j]['maxSales'] = maxSales;
                ////                        sectionList[i]['menuItems'][j]['costPercent'] = getBaseCost(sectionList[i]['menuItems'][j]) / notZero(sectionList[i]['menuItems'][j]['menuItemAveragePrice']);
                ////                    }
                //
                //                    _.forEach(sectionList[i]['menuItems'], function(menuItem){
                //                        menuItem['category'] = category;
                //                        menuItem['menuType'] = menuType;
                //                        menuItem['sectionName'] = sectionName;
                //                        menuItem['maxSales'] = maxSales;
                //                        menuItem['costPercent'] = getBaseCost(menuItem) / notZero(menuItem['menuItemAveragePrice']);
                //
                //                    })
                //
                //                }

                _.forEach(sectionList, function (section) {
                    var sectionName = section['sectionName'];
                    section['category'] = category;
                    section['menuType'] = menuType;
                    if (sectionName == category && category != 'Liquor') {
                        section['sectionNameDisplay'] = 'other';
                    } else {
                        section['sectionNameDisplay'] = sectionName;
                    }

                    section['dollarSales'] = Utils.sumOf(section['menuItems'], 'dollarSales');

                    _.forEach(section['menuItems'], function (menuItem) {
                        menuItem['category'] = category;
                        menuItem['menuType'] = menuType;
                        menuItem['sectionName'] = sectionName;
                        menuItem['maxSales'] = maxSales;
                        if (!menuItem.hasOwnProperty('costPercent')) {
                            menuItem['costPercent'] = getBaseCost(menuItem) / notZero(getBasePrice(menuItem));
                        }
                    })

                })
            }
            return sectionList;
        }

        function getBaseCost(menuItem) {
            var baseCost = menuItem['menuItemAverageCost']
            if (menuItem.hasOwnProperty('baseCost')) {
                baseCost = menuItem['baseCost']
            }
            return baseCost;
        }

        function getBasePrice(menuItem) {
            var basePrice = menuItem['menuItemAveragePrice']
            if (menuItem.hasOwnProperty('basePrice')) {
                basePrice = menuItem['basePrice']
            }
            return basePrice;
        }

        function getSelectedSectionData(sectionSelection) {

            //            return $timeout(function () {
            //                var sections = marginOptimizerData[sectionSelection.category][sectionSelection.menuType];
            //                var sectionIndex = Utils.getIndexIfObjWithOwnAttr(sections, "sectionName", sectionSelection.sectionName);
            //                return sections[sectionIndex];
            //
            //            }, 1);
            return $q(function (resolve, reject) {
                var sections = marginOptimizerData[sectionSelection.category][sectionSelection.menuType];
                //                var sectionIndex = Utils.getIndexIfObjWithOwnAttr(sections, "sectionName", sectionSelection.sectionName);
                var section = _.find(sections, {
                    sectionName: sectionSelection.sectionName
                })

                resolve(section)
            });
        }

        function fetchMissingMenuData(category, menuType) {
          // console.log('fetchMissingMenuData----- ',category, menuType);
            return $q(function (resolve, reject) {
                var request_definition = {
                    'category': category,
                    'menuType': menuType
                };

                var changeMenuDataRHW = function (sectionList_orig) {
                    var sectionList = angular.copy(sectionList_orig)
                    if (!marginOptimizerData.hasOwnProperty(category)) {
                        marginOptimizerData[category] = {}
                    }
                    marginOptimizerData[category][menuType] = addMenuAndCategoryToSections(category, menuType, sectionList);
                    sortByAndGroupBy(marginOptimizerData[category][menuType]).then(
                        function (sorted_grouped_list) {
                            resolve(sorted_grouped_list)
                        }
                    )

                }

                CommonService.fetchMarginOptimizerMenuDataV2(changeMenuDataRHW, request_definition);
            })
        }

        function getSelectedMenuItemData(responseHandler, menuItemSelection) {
          // console.log('**** fetchMissingMenuData ****',menuItemSelection);
            var getSelectedMenuItemDataFromLocalStore = function () {
                var sections = marginOptimizerData[menuItemSelection.category][menuItemSelection.menuType],
                    section = _.find(sections, {
                        sectionName: menuItemSelection.sectionName
                    }),
                    menuItem = _.find(section['menuItems'], {
                        menuItem: menuItemSelection.menuItem
                    });
                    // console.log(menuItem)
                responseHandler(menuItem);
            }
            // console.log(marginOptimizerData);
            // console.log(!_.has(marginOptimizerData, [menuItemSelection.category, menuItemSelection.menuType]));

            if (!_.has(marginOptimizerData, [menuItemSelection.category, menuItemSelection.menuType])) {
              // console.log('ifffffffffff');
                fetchMissingMenuData(menuItemSelection.category, menuItemSelection.menuType)
                    .then(function () {
                        getSelectedMenuItemDataFromLocalStore()
                    });
            } else {
              // console.log('elseeeeeee');
                getSelectedMenuItemDataFromLocalStore()
            }



        }

        function getSelecteFreshdMenuItemData(responseHandler, menuItemSelection) {
          // console.log('**** getSelecteFreshdMenuItemData ****',menuItemSelection);
            var getSelectedMenuItemDataFromLocalStore = function () {
                var sections = marginOptimizerData[menuItemSelection.category][menuItemSelection.menuType],
                    section = _.find(sections, {
                        sectionName: menuItemSelection.sectionName
                    }),
                    menuItem = _.find(section['menuItems'], {
                        menuItem: menuItemSelection.menuItem
                    });
                    // console.log(menuItem)
                responseHandler(menuItem,menuItemSelection);
            }
            // console.log(marginOptimizerData);
            // console.log(!_.has(marginOptimizerData, [menuItemSelection.category, menuItemSelection.menuType]));

            // if (!_.has(marginOptimizerData, [menuItemSelection.category, menuItemSelection.menuType])) {
              // console.log('ifffffffffff');
                fetchMissingMenuData(menuItemSelection.category, menuItemSelection.menuType)
                    .then(function () {
                        getSelectedMenuItemDataFromLocalStore()
                    });
            // } else {
            //   console.log('elseeeeeee');
            //     getSelectedMenuItemDataFromLocalStore()
            // }



        }





        function getSelectedMenuIngredients(responseHandler, menuItemSelection) {

            getSelectedMenuItemData(function (menuItemObj) {
                // console.log(menuItemSelection);
                // console.log(menuItemObj);
                var ingredientKey = menuItemSelection['category'] + "@@" + menuItemSelection['menuType'] + "@@" +
                    menuItemSelection['sectionName'] + "@@" + menuItemObj['menuItem'];
                if (marginOptimizerData.hasOwnProperty('ingredientsData')) {
                    if (marginOptimizerData['ingredientsData'].hasOwnProperty(ingredientKey)) {
                        responseHandler(marginOptimizerData['ingredientsData'][ingredientKey])
                    }
                }

                var fetchIngredientsRHW = function (ingredients) {
                  // console.log(ingredients);
                    ingredients = ingredients.items;
                    _.forEach(ingredients, function (ingredient) {
                        angular.extend(ingredient, menuItemSelection);
                    })
                    if (!marginOptimizerData.hasOwnProperty('ingredientsData')) {
                        marginOptimizerData['ingredientsData'] = {};
                    }

                    marginOptimizerData['ingredientsData'][ingredientKey] = ingredients;
                    //                    console.log(ingredients)
                    responseHandler(ingredients);
                }
                // console.log(_.has(marginOptimizerData, ['ingredientsData', ingredientKey]));
                if (_.has(marginOptimizerData, ['ingredientsData', ingredientKey])) {
                    responseHandler(marginOptimizerData['ingredientsData'][ingredientKey]);
                } else {
                  // console.log('else---------------------');
                    CommonService.fetchMarginOptimizerMenuItemIngredientsV2(fetchIngredientsRHW, {
                        menuItem: menuItemObj['menuItem']
                    });
                }



            }, menuItemSelection)

        }

        function getRefreshScreenMenuIngredients(responseHandler, menuItemSelection,recipeId) {

            getSelectedMenuItemData(function (menuItemObj) {
                // console.log(menuItemSelection);
                // console.log(menuItemObj);
                var ingredientKey = menuItemSelection['category'] + "@@" + menuItemSelection['menuType'] + "@@" +
                    menuItemSelection['sectionName'] + "@@" + menuItemObj['menuItem'];
                if (marginOptimizerData.hasOwnProperty('ingredientsData')) {
                    if (marginOptimizerData['ingredientsData'].hasOwnProperty(ingredientKey)) {
                        responseHandler(marginOptimizerData['ingredientsData'][ingredientKey])
                    }
                }

                var fetchIngredientsRHW = function (ingredients) {
                  // console.log(ingredients);
                    ingredients = ingredients;
                    _.forEach(ingredients, function (ingredient) {
                        angular.extend(ingredient, menuItemSelection);
                    })
                    // if (!marginOptimizerData.hasOwnProperty('ingredientsData')) {
                    //     marginOptimizerData['ingredientsData'] = {};
                    // }

                    marginOptimizerData['ingredientsData'][ingredientKey] = ingredients;
                    responseHandler(ingredients);
                }
                // console.log(_.has(marginOptimizerData, ['ingredientsData', ingredientKey]));
                    CommonService.refreshScreenApi(fetchIngredientsRHW,recipeId,menuItemObj['menuItem']
                    );



            }, menuItemSelection)

        }

        function getSelectedFreshMenuIngredients(responseHandler, menuItemSelection) {

            getSelectedMenuItemData(function (menuItemObj) {
                // console.log(menuItemSelection);
                // console.log(menuItemObj);
                var ingredientKey = menuItemSelection['category'] + "@@" + menuItemSelection['menuType'] + "@@" +
                    menuItemSelection['sectionName'] + "@@" + menuItemObj['menuItem'];
                if (marginOptimizerData.hasOwnProperty('ingredientsData')) {
                    if (marginOptimizerData['ingredientsData'].hasOwnProperty(ingredientKey)) {
                        responseHandler(marginOptimizerData['ingredientsData'][ingredientKey])
                    }
                }

                var fetchIngredientsRHW = function (ingredients) {
                  // console.log(ingredients);
                    ingredients = ingredients.items;
                    _.forEach(ingredients, function (ingredient) {
                        angular.extend(ingredient, menuItemSelection);
                    })
                    if (!marginOptimizerData.hasOwnProperty('ingredientsData')) {
                        marginOptimizerData['ingredientsData'] = {};
                    }

                    marginOptimizerData['ingredientsData'][ingredientKey] = ingredients;
                    //                    console.log(ingredients)
                    responseHandler(ingredients);
                }
                // console.log(_.has(marginOptimizerData, ['ingredientsData', ingredientKey]));
                // if (_.has(marginOptimizerData, ['ingredientsData', ingredientKey])) {
                //     responseHandler(marginOptimizerData['ingredientsData'][ingredientKey]);
                // } else {
                //   console.log('else---------------------');
                    CommonService.fetchMarginOptimizerMenuItemIngredientsV2(fetchIngredientsRHW, {
                        menuItem: menuItemObj['menuItem']
                    });
                // }



            }, menuItemSelection)

        }

        function getSelectedRecipeIngredients(responseHandler, menuItemSelection) {
            // getSelectedMenuItemData(function (menuItemObj) {
                var fetchIngredientsRHW = function (ingredients) {
                  // console.log(ingredients);
                  ingredients = ingredients.items;
                    _.forEach(ingredients, function (ingredient) {
                        angular.extend(ingredient, menuItemSelection);
                    });
                    if (!marginOptimizerData.hasOwnProperty('ingredientsData')) {
                        marginOptimizerData['ingredientsData'] = {};
                    }

                    // marginOptimizerData['ingredientsData'][ingredientKey] = ingredients;
                    //                    console.log(ingredients)
                    responseHandler(ingredients);
                };
                // console.log(menuItemSelection);
                CommonService.fetchMarginOptimizerMenuItemIngredientsV2(fetchIngredientsRHW, {
                    menuItem: menuItemSelection
                });

            // }, menuItemSelection)

        }
        function getSelectedRecipeIngredientsNew(responseHandler, menuItemSelection) {
            // getSelectedMenuItemData(function (menuItemObj) {
                var fetchIngredientsRHW = function (ingredients) {
                  // console.log(ingredients);
                  // ingredients = ingredients.items;
                    _.forEach(ingredients, function (ingredient) {
                        angular.extend(ingredient, menuItemSelection);
                    });
                    if (!marginOptimizerData.hasOwnProperty('ingredientsData')) {
                        marginOptimizerData['ingredientsData'] = {};
                    }

                    // marginOptimizerData['ingredientsData'][ingredientKey] = ingredients;
                    //                    console.log(ingredients)
                    responseHandler(ingredients);
                };
                // console.log(menuItemSelection);
                CommonService.fetchMarginOptimizerMenuItemIngredientsV2(fetchIngredientsRHW, {
                    menuItem: menuItemSelection
                });

            // }, menuItemSelection)

        }

        function getIngredientList(responseHandler) {
                var fetchIngList = function (ingredients) {
                    responseHandler(ingredients);
                };
                CommonService.fetchAddIngredients(fetchIngList);
        }


        function fetchMarginOptimizerMenuItemEditIngredientsV2(responseHandler, menuItemSelection) {
            // getSelectedMenuItemData(function (menuItemObj) {
                var fetchIngredientsRHW = function (ingredients) {
                    _.forEach(ingredients, function (ingredient) {
                        angular.extend(ingredient, menuItemSelection);
                    });
                    if (!marginOptimizerData.hasOwnProperty('ingredientsData')) {
                        marginOptimizerData['ingredientsData'] = {};
                    }

                    // marginOptimizerData['ingredientsData'][ingredientKey] = ingredients;
                    //                    console.log(ingredients)
                    responseHandler(ingredients);
                };
                // console.log(menuItemSelection);
                CommonService.fetchMarginOptimizerMenuItemEditIngredientsV2(fetchIngredientsRHW, {
                    menuItem: menuItemSelection
                });

            // }, menuItemSelection)

        }
        //


        function getSelectedMenuIngredientsEdit(responseHandler, menuItemSelection) {
            getSelectedMenuItemData(function (menuItemObj) {
                var ingredientKey = menuItemSelection['category'] + "@@" + menuItemSelection['menuType'] + "@@" +
                    menuItemSelection['sectionName'] + "@@" + menuItemObj['menuItem'];


                var fetchIngredientsRHW = function (ingredients) {
                    _.forEach(ingredients, function (ingredient) {
                        angular.extend(ingredient, menuItemSelection);
                    })
                    if (!marginOptimizerData.hasOwnProperty('ingredientsEditData')) {
                        marginOptimizerData['ingredientsEditData'] = {};
                    }

                    marginOptimizerData['ingredientsEditData'][ingredientKey] = ingredients;
                    //                   console.log(ingredients)
                    responseHandler(marginOptimizerData['ingredientsEditData'][ingredientKey]);
                }

                if (_.has(marginOptimizerData, ['ingredientsEditData', ingredientKey])) {
                    responseHandler(marginOptimizerData['ingredientsEditData'][ingredientKey]);
                } else {
                    CommonService.fetchMarginOptimizerMenuItemIngredientsEditV2(fetchIngredientsRHW, {
                        menuItem: menuItemObj['menuItem']
                    });
                }



            }, menuItemSelection)
        }

        function getMenuIngredientToEdit(responseHandler, menuItemSelection, ingredient) {

            getSelectedMenuItemData(function (menuItemObj) {
                var ingredientKey = menuItemSelection['category'] + "@@" + menuItemSelection['menuType'] + "@@" +
                    menuItemSelection['sectionName'] + "@@" + menuItemObj['menuItem'];

                var ingredientsEdit = _.get(marginOptimizerData, ['ingredientsEditData', ingredientKey]);
                var ingredientEdit = _.find(ingredientsEdit, _.pick(ingredient, ['ingredientId']))

                responseHandler(ingredientEdit);



            }, menuItemSelection)
        }

        function fetchDetailedModsData(responseHandler, menuitem_id) {
            CommonService.fetchMarginOptimizerModsData(responseHandler, {
                'menu_item_id': menuitem_id
            });
        }

        function updateTotalIngredientCost(menuItemSelection) {
            return $q(function (resolve, reject) {
                console.log('Updating menu item')
                getSelectedMenuItemData(function (menuItemObj) {
                    var ingredientKey = menuItemSelection['category'] + "@@" + menuItemSelection['menuType'] + "@@" +
                        menuItemSelection['sectionName'] + "@@" + menuItemObj['menuItem'];

                    var ingredients = _.get(marginOptimizerData, ['ingredientsData', ingredientKey]);
                    //                    var ingredientEdit = _.find(ingredientsEdit, _.pick(ingredient, ['ingredientId']))
                    var newRecipeCost = _.sumBy(ingredients, 'ingredientCost');
                    var basePrice = _.get(menuItemObj, ['basePrice'])
                    if (basePrice != 0) {
                        _.set(menuItemObj, ['baseCost'], newRecipeCost)
                        _.set(menuItemObj, ['costPercent'], newRecipeCost / basePrice)
                    }
                    //                    console.log(_.pick(menuItemObj, ['baseCost', 'costPercent']))
                    //                    resolve(_.pick(menuItemObj, ['baseCost', 'costPercent']));
                    console.log('menuitem updated')
                    resolve(menuItemObj);

                }, menuItemSelection)



            })
        }

        function updateMenuItemByRecipeEdit(menuItem) {
            return $q(function (resolve, reject) {

                var updateMenuItemByRecipeEditRHW = function (saveResponse) {
                    resolve(saveResponse)
                }

                CommonService.updateMarginOptimizerMenuItemByRecipeEdit(updateMenuItemByRecipeEditRHW, menuItem)

            })

        }


        function setMenuRecipeIngredients(responseHandler, ingredients) {
            CommonService.updateMarginOptimizerMenuItemIngredientsEditV2(responseHandler, ingredients);
        }


        function getGroupByKeys() {
            return $q(function (resolve, reject) {

                var groupByKeys = marginOptimizerData['groupByKeys'];
                resolve(groupByKeys, _.findIndex(groupByKeys, 'selected'));
            })



        }

        function changeGrouping(index) {
            return $q(function (resolve, reject) {
                var currentSelected = _.find(marginOptimizerData['groupByKeys'], 'selected');
                currentSelected.selected = false;
                marginOptimizerData['groupByKeys'][index]['selected'] = true;
                resolve(index)
            })
        }


        function maxOf(listOfObjects, key) {
            return Math.max.apply(Math, listOfObjects.map(function (o) {
                return o[key];
            }))
        }

        function maxSalesInSectionList(sectionList) {
            return Math.max.apply(Math, sectionList.map(function (o) {
                return maxOf(o['menuItems'], 'dollarSales');
            }))

        }

        function notZero(n) {
            n = +n; // Coerce to number.
            if (!n) { // Matches +0, -0, NaN
                return Number.MIN_VALUE;
            }
            return n;
        }
        return marginOptimizerFactoryOne;
    }

})();
