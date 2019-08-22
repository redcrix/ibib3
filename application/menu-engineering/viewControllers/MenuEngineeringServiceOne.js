(function () {
    'use strict';

    projectCostByte.factory('MenuEngineeringServiceOne', MenuEngineeringServiceOne);



    MenuEngineeringServiceOne.$inject = ['$q', 'CommonService', '$timeout', 'Utils','$rootScope'];

    function MenuEngineeringServiceOne($q, CommonService, $timeout, Utils, $rootScope) {

        var menuEngineeringData = {};
        menuEngineeringData['groupByKeys'] = [{displayKey:'Menu Section', key: 'sectionName', selected:true, quartile: false},
                                              {displayKey:'Dollar Sales', key: 'dollarSalesQuartile', selected:false, quartile: false},
                                              {displayKey:'Profitability', key: 'weightedContributionMarginQuartile', selected:false, quartile: false},
                                              {displayKey:'No grouping', key: 'NOGROUPING', selected:false, quartile: false},];
        menuEngineeringData['sortByKeys'] = [
                {displayKey:'Sales', key: 'dollarSales', selected:true, direction: -1},
                {displayKey:'Sales', key: 'dollarSales', selected:false, direction: 1},
                {displayKey:'Cost', key: 'costPercent', selected:false, direction: -1},
                {displayKey:'Cost', key: 'costPercent', selected:false, direction: 1},
                {displayKey:'Profitability', key: 'weightedContributionMargin', selected:false, direction: -1},
                ];
        menuEngineeringData.displayIcons = {
            'price' : 'ion-pricetag',
            'quantity' : 'ion-android-cart',
            'cost' : 'ion-cash',
            'sales' : 'ion-connection-bars',
            'alert' : 'ion-alert-circled',
        }

        menuEngineeringData.filterButtons = [
            {
                'label': 'Stars',
                'filter_tag': 'STARS',
                'style': 'menueng',
                'clicked': true,
                'sortClass': '',
                'icon': 'ion-ios-star',
                'col':'col-15'

            }
            , {
                'label': 'Workhorses',
                'filter_tag': 'PLOUGHHORSES',
                'style': 'menueng',
                'clicked': false,
                'sortClass': '',
                'icon': 'ion-ios-star-half',
                'col' : 'col-32'
            }
            , {
                'label': 'Puzzles',
                'filter_tag': 'PUZZLES',
                'style': 'menueng',
                'clicked': false,
                'sortClass': '',
                'icon': 'ion-ios-help',
                'col':'col-20'
            }
            , {
                'label': 'Problems',
                'filter_tag': 'PROBLEMS',
                'style': 'menueng',
                'clicked': false,
                'sortClass': '',
                'icon': 'ion-ios-close',
                'col' :'col-24'
            },
            {
                'label': 'All',
                'filter_tag': 'ALL',
                'style': 'menueng',
                'clicked': false,
                'sortClass': '',
                'icon': 'ion-checkmark-circled',
                'col' : 'col-15'
            }
            ]


        var menuEngineeringFactoryOne = {
            fetchSelectedMenuType: fetchSelectedMenuType,
            setSelectedMenuType: setSelectedMenuType,
            fetchSortingButtons: fetchSortingButtons,
            fetchFilterButtons: fetchFilterButtons,
            fetchMenus: fetchMenus,
            changeSelectedMenu: changeSelectedMenu,
            getSelectedMenuData: getSelectedMenuData,
            getSelectedSectionData: getSelectedSectionData,
            getSelectedMenuItemData: getSelectedMenuItemData,
            getSelectedMenuIngredients: getSelectedMenuIngredients,
            getIcon: getIcon,
            fetchDetailedModsData: fetchDetailedModsData,
            getGroupByKeys: getGroupByKeys,
            changeGrouping: changeGrouping,
            getSortByKeys: getSortByKeys,
            changeSorting: changeSorting,
            getActiveFilters: getActiveFilters,
        };

        function getIcon(iconType){
            if (menuEngineeringData.displayIcons.hasOwnProperty(iconType))
                return menuEngineeringData.displayIcons[iconType];
            return "";
        }

        function fetchSelectedMenuType(returnType) {
            if(angular.isUndefined(menuEngineeringData.selectedMenuTypeOptions)){
                menuEngineeringData.selectedMenuType = "Food";
                return menuEngineeringData.selectedMenuType;
            }else{
                if (!menuEngineeringData.hasOwnProperty('selectedMenuType')) {
                    menuEngineeringData.selectedMenuType = "Food";
                }
                if (angular.isUndefined(returnType)){
                    return menuEngineeringData.selectedMenuTypeOptions[menuEngineeringData.selectedMenuType];
                }else if (returnType == 'key'){
                    return menuEngineeringData.selectedMenuType;
                }else{
                    return menuEngineeringData.selectedMenuTypeOptions[menuEngineeringData.selectedMenuType];
                }
            }
        }

        function setSelectedMenuType(menuType) {
            if (angular.isUndefined(menuType)){
                if (!menuEngineeringData.hasOwnProperty('selectedMenuType') || menuEngineeringData.selectedMenuType ==""){
                    menuEngineeringData.selectedMenuType = "Food";
                }
            }else{
                if (_.includes(_.keysIn(menuEngineeringData.selectedMenuTypeOptions), menuType)){
                    menuEngineeringData.selectedMenuType = menuType;
                }else{
                    menuEngineeringData.selectedMenuType = "Food";
                }
            }
        }

        function setMenuTypeOptions(actualOptions){
            var possibleOptionsHC = ['Food', 'Liquor'];
            menuEngineeringData['selectedMenuTypeOptions'] = {};
            _.forEach(possibleOptionsHC, function(pOpt){
                _.forEach(actualOptions, function(aOpt){
                    if(pOpt.toLowerCase() == aOpt.toLowerCase()){
                        menuEngineeringData['selectedMenuTypeOptions'][pOpt] = aOpt;
                    }
                })
            })
            setSelectedMenuType();
        }

        function fetchSortingButtons(responseHandler) {
            if (menuEngineeringData.hasOwnProperty('sortingButtons')) {
                return $timeout(function () {
                    responseHandler(menuEngineeringData.sortingButtons)
                }, 1);

            }

            var fetchSortingButtonsRHW = function (sortingButtons) {
                    menuEngineeringData['sortingButtons'] = sortingButtons;
                    responseHandler(sortingButtons);
                } //fetchMenusRHW

            CommonService.fetchMarginOptimizerSortingButtons(fetchSortingButtonsRHW);

        }

        function fetchFilterButtons(responseHandler) {
            if (menuEngineeringData.hasOwnProperty('filterButtons')) {
                return $timeout(function () {
                    responseHandler(menuEngineeringData.filterButtons)
                }, 1);

            }

            var fetchFilterButtonsRHW = function (filterButtons) {
                    menuEngineeringData['filterButtons'] = filterButtons;
                    responseHandler(filterButtons);
                } //fetchMenusRHW

            //TODO change to fetching filter buttons
            CommonService.fetchMarginOptimizerSortingButtons(fetchFilterButtonsRHW);

        }


        function fetchMenus(responseHandler) {
            var selectedMenuType = fetchSelectedMenuType();
            if (menuEngineeringData.hasOwnProperty('menusData')) {
                if (menuEngineeringData['menusData'].hasOwnProperty(selectedMenuType)) {
                    return $timeout(function () {
                        responseHandler(menuEngineeringData['menusData'][selectedMenuType])
                    }, 1);
                }
            }

            var fetchMenusRHW = function (menus_orig) {
                   // console.log(menus_orig)
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

                    // sorting menu categories by dollar sales considering cost percent
                    menus.sort(function (a, b) {
                        return (b.dollarSales * b.costPercent - a.dollarSales * a.costPercent);
                    })

                    _.forEach(menus, function(menu){
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
                    // console.log(grouped_menus);
                    var grouped_keys = _.keysIn(grouped_menus);
                    _.forEach(grouped_keys, function (key){
                        grouped_menus[key][0]['selected'] = true;
                    })
                    // console.log(grouped_keys);
                    setMenuTypeOptions(grouped_keys);
                    menuEngineeringData['menusData'] = grouped_menus;

                    responseHandler(menuEngineeringData['menusData'][fetchSelectedMenuType()]);

                } //fetchMenusRHW
            CommonService.fetchMarginOptimizerMenusV2(fetchMenusRHW, fetchSelectedMenuType('key'));
        }


        function changeSelectedMenu(selectedIndex, responseHandler) {
            console.log("selectedIndex",selectedIndex,"responseHandler",responseHandler);
            var selectedMenuType = fetchSelectedMenuType();
            _.forEach(menuEngineeringData['menusData'][selectedMenuType], function(menuDataSet) {
                menuDataSet['selected'] = false;
            })
            menuEngineeringData['menusData'][selectedMenuType][selectedIndex]['selected'] = true;

            responseHandler(menuEngineeringData['menusData'][selectedMenuType]);


        }

        function findSelectedMenu(returnKeyName) {
            var selectedMenuType = fetchSelectedMenuType();
            if (menuEngineeringData.hasOwnProperty('menusData')){
                if (returnKeyName == "index") {
                    return _.findIndex(menuEngineeringData['menusData'][selectedMenuType], 'selected')
                }else{
                  // console.log(menuEngineeringData['menusData']);
                    var selectedMenu = _.find(menuEngineeringData['menusData'][selectedMenuType], 'selected');
                    return _.get(selectedMenu, returnKeyName, "")
                }
            }
        }


        function getSelectedMenuData(responseHandler) {

            changeMenuData(responseHandler);

        }

        function changeMenuData(responseHandler) {
          console.log('changeMenuData-----');
            var category = findSelectedMenu("category");
            var menuType = fetchSelectedMenuType();
            console.log(angular.isDefined(category) && category!="");
            if (angular.isDefined(category) && category!=""){
                var request_definition = {
                    'category': category,
                    'menuType': menuType
                };
                var changeMenuDataRHW = function (sectionList_orig) {
                  $rootScope.$broadcast('MENUENGGHIDESPINNER');
                    var sectionList = angular.copy(sectionList_orig)
                    if (!menuEngineeringData.hasOwnProperty(category)) {
                        menuEngineeringData[category] = {}
                    }
                    menuEngineeringData[category][menuType] = addMenuAndCategoryToSections(category, menuType, sectionList);
                    sortByAndGroupBy(menuEngineeringData[category][menuType]).then(
                        function(sorted_grouped_list){
                            responseHandler(sorted_grouped_list)

                        })
                }
                if (menuEngineeringData.hasOwnProperty(category)) {
                    if (menuEngineeringData[category].hasOwnProperty(menuType)) {
                        sortByAndGroupBy(menuEngineeringData[category][menuType]).then(
                        function(sorted_grouped_list){
                            responseHandler(sorted_grouped_list)
                        })
                    }
                }
                CommonService.fetchMarginOptimizerMenuDataV2(changeMenuDataRHW, request_definition);
            }else {
              responseHandler(false)
            }
        }

        function sortByAndGroupBy(sectionList){
            return $q(function(resolve, reject){
                var full_menu_items_list = _.reduce(sectionList, function(full_list, section) {
                                            return  _.concat(full_list, section.menuItems);
                                        }, []);



                var sortByKey = _.get(_.find(menuEngineeringData['sortByKeys'],'selected'), 'key'),
                sortDirection = _.get(_.find(menuEngineeringData['sortByKeys'],'selected'), 'direction'),
                groupByKey = _.get(_.find(menuEngineeringData['groupByKeys'], 'selected'), 'key'),
                groupByKeyIfQuartile = _.get(_.find(menuEngineeringData['groupByKeys'], 'selected'), 'quartile');
//                console.log(groupByKey)

                var sorted_list = _.sortBy(full_menu_items_list, [function(o) {
                                            if (isFinite(o[sortByKey])){
                                                return sortDirection * o[sortByKey];
                                            }else{
                                                return 9999999999;
                                            }
                                        }
                                        ]


                                  );

                _.forEach(sorted_list, function(o, index){
                    o['sortedIndex'] = index;
                })

                var grouped_dict = {'All items' :sorted_list}

                if (groupByKey!='NOGROUPING'){
                    grouped_dict = _.groupBy(sorted_list, groupByKey)
                }

//                console.log(grouped_dict)

                var grouped_list = _.map(grouped_dict, function(menu_items, group_name){

                    var dollarSales = 0,
                      dollarCosts = 0,
                      sortedIndex = 99999;

                    _.forEach(menu_items, function (menu_item){
                        dollarSales = dollarSales + menu_item.dollarSales;
                        if (isFinite(menu_item.costPercent)){
                           dollarCosts = dollarCosts + menu_item.dollarSales*menu_item.costPercent ;
                        }
                        if(menu_item.sortedIndex < sortedIndex){
                            sortedIndex = menu_item.sortedIndex
                        }
                    })


                    return {'groupDisplayName': groupByKeyIfQuartile? "Quartile "+ group_name : group_name,
                            'dollarSales': dollarSales,
                            'costPercent' : dollarCosts/dollarSales,
                            'sortedIndex': sortedIndex,
                            'menuItems' : menu_items
                            }

                })


                var grouped_list = _.sortBy(grouped_list, [function(o) {
                                            return o.sortedIndex; }]
                                   );
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

                _.forEach(sectionList, function(section){
                    var sectionName = section['sectionName'];
                    section['category'] = category;
                    section['menuType'] = menuType;
                    if (sectionName == category && category != 'Liquor') {
                        section['sectionNameDisplay'] = 'other';
                    } else {
                        section['sectionNameDisplay'] = sectionName;
                    }

                    section['dollarSales'] = Utils.sumOf(section['menuItems'], 'dollarSales');

                    _.forEach(section['menuItems'], function(menuItem){
                        menuItem['category'] = category;
                        menuItem['menuType'] = menuType;
                        menuItem['sectionName'] = sectionName;
                        menuItem['maxSales'] = maxSales;
                        if (!menuItem.hasOwnProperty('costPercent')){
                            menuItem['costPercent'] = getBaseCost(menuItem) / notZero(getBasePrice(menuItem));
                        }

                    })

                })
            }
            return sectionList;
        }

        function getBaseCost(menuItem){
            var baseCost = menuItem['menuItemAverageCost']
            if(menuItem.hasOwnProperty('baseCost')){
                baseCost = menuItem['baseCost']
            }
            return baseCost;
        }
        function getBasePrice(menuItem){
            var basePrice = menuItem['menuItemAveragePrice']
            if(menuItem.hasOwnProperty('basePrice')){
                basePrice = menuItem['basePrice']
            }
            return basePrice;
        }

        function getSelectedSectionData(sectionSelection) {

//            return $timeout(function () {
//                var sections = menuEngineeringData[sectionSelection.category][sectionSelection.menuType];
//                var sectionIndex = Utils.getIndexIfObjWithOwnAttr(sections, "sectionName", sectionSelection.sectionName);
//                return sections[sectionIndex];
//
//            }, 1);
            return $q(function (resolve, reject) {
                var sections = menuEngineeringData[sectionSelection.category][sectionSelection.menuType];
//                var sectionIndex = Utils.getIndexIfObjWithOwnAttr(sections, "sectionName", sectionSelection.sectionName);
                var section = _.find(sections, {sectionName: sectionSelection.sectionName})

                resolve(section)
            });
        }

        function getSelectedMenuItemData(responseHandler, menuItemSelection) {

            var sections = menuEngineeringData[menuItemSelection.category][menuItemSelection.menuType],
             section = _.find(sections, {sectionName: menuItemSelection.sectionName}),
             menuItem = _.find(section['menuItems'], {menuItem: menuItemSelection.menuItem});

            responseHandler(menuItem);

        }

        function getSelectedMenuIngredients(responseHandler, menuItemSelection) {
            var sections = menuEngineeringData[menuItemSelection.category][menuItemSelection.menuType],
//                sectionIndex = Utils.getIndexIfObjWithOwnAttr(sections, "sectionName", menuItemSelection.sectionName),
                section = _.find(sections, {sectionName: menuItemSelection.sectionName}),
//                menuItemIndex = Utils.getIndexIfObjWithOwnAttr(sections[sectionIndex]['menuItems'], "menuItem", menuItemSelection.menuItem),
                menuItemObj = _.find(section['menuItems'], {menuItem: menuItemSelection.menuItem}),
//                menuItemObj = sections[sectionIndex]['menuItems'][menuItemIndex],

                ingredientKey = menuItemSelection['category'] + "@@" + menuItemSelection['menuType'] + "@@" + menuItemSelection['sectionName'] + "@@" + menuItemObj['menuItem'];

            if (menuEngineeringData.hasOwnProperty('ingredientsData')) {
                if (menuEngineeringData['ingredientsData'].hasOwnProperty(ingredientKey)) {
                    responseHandler(menuEngineeringData['ingredientsData'][ingredientKey])
                }
            }

            var fetchIngredientsRHW = function (ingredients) {
              ingredients = ingredients.items;
                    _.forEach(ingredients , function(ingredient) {
                        angular.extend(ingredient, menuItemSelection);
                    })
                    if (!menuEngineeringData.hasOwnProperty('ingredientsData')) {
                        menuEngineeringData['ingredientsData'] = {};
                    }

                    menuEngineeringData['ingredientsData'][ingredientKey] = ingredients;
                    responseHandler(ingredients);
                } //fetchMenusRHW

            CommonService.fetchMarginOptimizerMenuItemIngredientsV2(fetchIngredientsRHW, {
                menuItem: menuItemObj['menuItem']
            });
        }

        function fetchDetailedModsData(responseHandler, menuitem_id) {
            CommonService.fetchMarginOptimizerModsData(responseHandler, {
                'menu_item_id': menuitem_id
            });
        }

        function getGroupByKeys(){
            return $q(function(resolve, reject){

                var groupByKeys = menuEngineeringData['groupByKeys'];
                resolve(groupByKeys, _.findIndex(groupByKeys, 'selected'));
            })



        }

        function changeGrouping(index){
            return $q(function(resolve, reject){
                var currentSelected = _.find(menuEngineeringData['groupByKeys'], 'selected');
                currentSelected.selected = false;
                menuEngineeringData['groupByKeys'][index]['selected'] = true;
                resolve(index)
            })
        }

        function getSortByKeys(){
            return $q(function(resolve, reject){
                var sortByKeys = menuEngineeringData['sortByKeys'];
                resolve(sortByKeys, _.findIndex(sortByKeys, 'selected'));
            })



        }

        function changeSorting(index){
            return $q(function(resolve, reject){
                var currentSelectedIndex = _.findIndex(menuEngineeringData['sortByKeys'], 'selected');
                if (index != currentSelectedIndex){
                    menuEngineeringData['sortByKeys'][currentSelectedIndex]['selected'] = false;
                    menuEngineeringData['sortByKeys'][index]['selected'] = true;
                }else{
//                    menuEngineeringData['sortByKeys'][index]['direction'] = -1 *
//                    menuEngineeringData['sortByKeys'][index]['direction'];
                }

                resolve(index)
            })
        }

        function getActiveFilters(){
            return $q(function(resolve, reject){
                var active_filters = [];
                _.forEach(menuEngineeringData.filterButtons, function(button){
                    if(button.clicked){
                        active_filters.push(button.filter_tag)
                    }
                })
                if (active_filters.length==0){
                    active_filters.push("NONE")
                }
                resolve(active_filters)
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
        return menuEngineeringFactoryOne;
    }

})();
