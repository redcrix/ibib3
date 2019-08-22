(function() {
    var OrderingViewCtrl = function($scope, $state, $ionicFilterBar, $ionicActionSheet, orderingItemsSvc, $ionicLoading, $ionicPopup, $ionicScrollDelegate) {
        var that = this;
        // $scope.navBarTitle = {
        //   showToggleButton : false
        // };
        var filterBarInstance;
        that.categorieViews = {
            "PRODUCT_CATEGORY": 'ingredient_category',
            "LOCATION": 'location',
            "Supplier": 'supplier_name'
        };
        that.categoryText = {
            "PRODUCT_CATEGORY": 'Ingredient Category',
            "LOCATION": 'Location',
            "Supplier": 'Supplier'
        };
        that.currentView = "PRODUCT_CATEGORY";
        this.rowSize = {
            // name: 30,
            // last: 15,
            // value: 13,
            // par: 10,
            // qih: 10,
            // order: 13,

            name: 32,
            last: 13,
            value: 20,
            par: 13,
            qih: 9,
            order: 15,
        }


        this.showLoader = true;
        this.fullList = [];
        this.fullGroupedList = [];
        this.items = [];
        this.init = function() {
          $scope.navBarTitle.showToggleButton = false;

          console.log($scope.navBarTitle.showToggleButton);
            that.orderingId = $state.params.ordering;
            that.ordering_name = $state.params.ordering_name;
            that.store_id = $state.params.store_id;
            orderingItemsSvc.getIngredients(that.orderingId).then(function(data) {
                that.fullList = data.ingredients.filter(function(product) {
                    return !isNaN(product.quantity);
                });
                that.ordering_status = data.ordering_status;
                that.isLocationAvailable = _.unionBy(that.fullList, "location").map(function(ele) {
                    return ele.location;
                }).filter(function(ele) {
                    return !!ele
                }).length > 0;
                //                that.fullGroupedList = that.groupIngredients(that.categorieViews[that.currentView], that.fullList);
                that.items = that.groupIngredients(that.categorieViews[that.currentView], that.fullList);
                that.showLoader = false;
            });
        };
        this.selectGrouping = function() {
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    text: 'Product Category'
                }, {
                    text: 'Location'
                }, {
                    text: 'Supplier'
                }],
                titleText: 'Select store',
                cancelText: 'Cancel',
                cancel: function() {},
                buttonClicked: function(index) {
                    switch (index) {
                        case 0:
                            that.currentView = "PRODUCT_CATEGORY";
                            break;
                        case 1:
                            that.currentView = 'LOCATION';
                            break;
                        case 2:
                            that.currentView = 'Supplier';
                            break;
                        default:
                            that.currentView = "PRODUCT_CATEGORY";
                            break;
                    }
                    //                    that.fullGroupedList = that.groupIngredients(that.categorieViews[that.currentView], that.fullList);
                    that.items = that.groupIngredients(that.categorieViews[that.currentView], that.fullList);
                    hideSheet();
                    return true;
                }
            });
        };

        this.groupIngredients = function(currentView, data) {
            var categories = _.groupBy(data, currentView);
            that.fullGroupedList = _.map(categories, function(cat) {
                return {
                    name: cat[0][currentView],
                    ingredients: cat,
                    //                    rank : _.reduce(cat, function(memo, ingredient){ return memo + ingredient.rank; }, 0)/(cat.length)
                    rank: _.get(cat, '[0].rank') // category rank = minimum of(ingredient ranks in category)
                }
            });
            that.fullGroupedList = _.sortBy(that.fullGroupedList, 'rank')
            return angular.copy(that.fullGroupedList);
        }


        this.showFilterBar = function() {
            filterBarInstance = $ionicFilterBar.show({
                items: that.items,
                update: function(filteredItems, filterText) {
                    that.items = filteredItems;
                }
            });
        };

        this.updatedList = function() {
            that.fullGroupedList = angular.merge(that.fullGroupedList, that.items);
            that.fullList = _.flattenDeep(that.fullGroupedList.map(function(cat) {
                return cat.ingredients;
            }));
            return that.fullList;
        };

        $scope.$on('product-category-value-updated', function(evt, data) {
            that.totalValue = that.items
                //                .filter(function (ele) {
                //                return ele.totalValue !== undefined && ele.totalValue !== null;
                //                })
                .map(function(ele) {
                    return ele.totalValue;
                })
                .reduce(function(prev, cur) {
                    return prev + cur;
                }, 0);
        });

        $scope.$on('$destroy', function() {

        });

        $scope.$on('ReSizeScroll', function(evt) {
            $timeout(function() {
                $ionicScrollDelegate.resize();
            }, 0)
        });

    };


    OrderingViewCtrl.$inject = ['$scope', '$state', '$ionicFilterBar', '$ionicActionSheet', 'orderingItemsSvc', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate'];
    projectCostByte.controller('OrderingViewCtrl', OrderingViewCtrl);
})();
