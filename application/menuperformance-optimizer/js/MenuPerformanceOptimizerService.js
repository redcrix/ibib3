(function() {
    'use strict';

    projectCostByte.factory('MenuPerformanceOptimizerService', MenuPerformanceOptimizerService);

    MenuPerformanceOptimizerService.$inject = ['CommonService'];

    function MenuPerformanceOptimizerService(CommonService) {

        var MenuPerformanceOptimizerFactory = {
            fetchMenus: fetchMenus,
            fetchCategories :fetchCategories,
            fetchSections :fetchSections,
            fetchMenuData :fetchMenuData,
            fetchSectionData :fetchSectionData,
            fetchMenuItemData :fetchMenuItemData,
        };


        function fetchMenus(responseHandler) {
            CommonService.fetchMenuPerformanceOptimizerMenus(responseHandler);
        }


        function fetchMenuData(responseHandler, menu_id){
            CommonService.fetchMenuPerformanceOptimizerMenuData(responseHandler, {'menu_id': menu_id});
        }
        function fetchSectionData(responseHandler, section_id){
            CommonService.fetchMenuPerformanceOptimizerSectionData(responseHandler, {'section_id': section_id});
        }
        function fetchMenuItemData(responseHandler, menuitem_id){
            CommonService.fetchMenuPerformanceOptimizerMenuItemData(responseHandler, {'menuitem_id': menuitem_id});
        }

        function fetchCategories(responseHandler, category_ids) {

            var request_def = {

                            'object_name' : 'Category',
                            'object_ids' : category_ids,
                            'properties':['category_name', 'category_cost_percent', 'sections']
                            }

            CommonService.fetchMenuPerformanceOptimizerProperties(responseHandler, request_def);
        }

        function fetchSections(responseHandler, section_ids) {

            var request_def = {

                            'object_name' : 'Section',
                            'object_ids' : section_ids,
                            'properties':['id' , 'section_name', 'section_cost_percent', 'menu_items']
                            }

            CommonService.fetchMenuPerformanceOptimizerProperties(responseHandler, request_def);
        }

        function fetchMenuItems(responseHandler, menuitem_ids) {

            var request_def = {

                            'object_name' : 'MenuItem',
                            'object_ids' : menuitem_ids,
                            'properties':['item_name', 'item_id', 'price','price_power','cost_percent','threshold_cost_percent',
                            'impact', 'ingredients', 'competitor_items']
                            }

            CommonService.fetchMenuPerformanceOptimizerProperties(responseHandler, request_def);
        }



        return MenuPerformanceOptimizerFactory;
    }

})();
