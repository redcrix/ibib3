(function() {
    'use strict';

    projectCostByte.factory('MarginOptimizerService', marginOptimizerService);

    marginOptimizerService.$inject = ['CommonService'];

    function marginOptimizerService(CommonService) {

        var marginOptimizerFactory = {
            fetchMenus: fetchMenus,
            fetchCategories :fetchCategories,
            fetchSections :fetchSections,
            fetchMenuData :fetchMenuData,
            fetchSectionData :fetchSectionData,
            fetchMenuItemData :fetchMenuItemData,
            fetchIngredientSuppliers :fetchIngredientSuppliers,
            fetchSortingButtons :fetchSortingButtons,
        };


        function fetchMenus(responseHandler) {
            CommonService.fetchMarginOptimizerMenus(responseHandler);
        }


        function fetchSortingButtons(responseHandler){
            CommonService.fetchMarginOptimizerSortingButtons(responseHandler);
        }

        function fetchMenuData(responseHandler, menu_id){
            CommonService.fetchMarginOptimizerMenuData(responseHandler, {'menu_id': menu_id});
        }
        function fetchSectionData(responseHandler, section_id){
            CommonService.fetchMarginOptimizerSectionData(responseHandler, {'section_id': section_id});
        }
        function fetchMenuItemData(responseHandler, menuitem_id){
            CommonService.fetchMarginOptimizerMenuItemData(responseHandler, {'menuitem_id': menuitem_id});
        }

        function fetchCategories(responseHandler, category_ids) {

            var request_def = {

                            'object_name' : 'Category',
                            'object_ids' : category_ids,
                            'properties':['category_name', 'category_cost_percent', 'sections']
                            }

            CommonService.fetchMarginOptimizerProperties(responseHandler, request_def);
        }

        function fetchSections(responseHandler, section_ids) {

            var request_def = {

                            'object_name' : 'Section',
                            'object_ids' : section_ids,
                            'properties':['id' , 'section_name', 'section_cost_percent', 'menu_items']
                            }

            CommonService.fetchMarginOptimizerProperties(responseHandler, request_def);
        }

        function fetchMenuItems(responseHandler, menuitem_ids) {

            var request_def = {

                            'object_name' : 'MenuItem',
                            'object_ids' : menuitem_ids,
                            'properties':['item_name', 'item_id', 'price','price_power','cost_percent','threshold_cost_percent',
                            'impact', 'ingredients', 'competitor_items']
                            }

            CommonService.fetchMarginOptimizerProperties(responseHandler, request_def);
        }



        function fetchIngredientSuppliers(responseHandler, ingredient) {
            CommonService.fetchMarginOptimizerIngredientSuppliers(responseHandler, ingredient);
        }



        return marginOptimizerFactory;
    }

})();
