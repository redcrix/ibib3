(function() {
    var orderingItemsSvc = function($q, $timeout, CommonService) {
        var orderingItemsData = {};
        var postIngredientsTimeout = null;
        var debounceTimeDelay = 4000;
        orderingItemsData.lastSavedTime = {}; // for storing the last saved time of drafts
        var dateOptions = {
            hour: "2-digit",
            minute: "2-digit",
            day: "numeric",
            month: "short"
        };
        var getIngredients = function(draft_id /*submitted as well*/ ) {
          console.log('************** getIngredients ***********');
            return $q(function(resolve, reject) {
                CommonService.fetchOrderingIngredients(function(data) {
                    if (data.hasOwnProperty("last_updated_at")) {
                        var lastSavedtime = new Date(parseInt(data.last_updated_at) * 1000);
                        orderingItemsData.lastSavedTime[draft_id] = lastSavedtime.toLocaleString("en-US", dateOptions);
                    }
                    var ingredients = {
                        "ordering_status": data.ordering_status,
                        "last_updated_at": orderingItemsData.lastSavedTime[draft_id]
                    };
                    //                    ingredients.ingredients = data.ingredients || []
                    _.forEach(data.ingredients, function(ingredient) {
                        if (ingredient.hasOwnProperty('quantity')) {
                            ingredient.quantity = Number(ingredient.quantity);
                        }
                        if (ingredient.hasOwnProperty('rank')) {
                            ingredient.rank = Number(ingredient.rank);
                        }
                    });
                    ingredients.ingredients = _.sortBy(data.ingredients || [], 'rank'); //sort by rank

                    resolve(ingredients);
                }, draft_id)
            })
        };
        var postIngredients = function(ingredients, ordering_status) {
            //            console.log('post to service')
            return $q(function(resolve, reject) {
                //                ingredients = _.filter(ingredients, function(ingredient){ return !isNaN(ingredient.quantity); });
                var payload = {
                    "ordering_status": ordering_status,
                    "ingredients": ingredients
                };

                payload.ingredients = payload.ingredients.map(function(ing) {
                    var val = ing.quantity * ing.ingredient_price;
                    ing.value = isNaN(val) ? 0 : val;
                    return ing;
                });

                if (postIngredientsTimeout) {
                    $timeout.cancel(postIngredientsTimeout)
                }

                var commonServicePostIngredients = function() {
                    //                    console.log('Actual post to server')
                    CommonService.postOrderingIngredients(function(data) {
                        if (data.data.hasOwnProperty('error')) {
                            reject(data)
                        }
                        resolve(data.data);
                    }, payload);
                }

                postIngredientsTimeout = $timeout(commonServicePostIngredients, debounceTimeDelay);


            });
        };



        var setDraftSavedTime = function(draftID) {
            orderingItemsData.lastSavedTime[draftID] = (new Date()).toLocaleString("en-US", dateOptions);
        }
        var getDraftSavedTime = function(draftID) {
            if (orderingItemsData.lastSavedTime.hasOwnProperty(draftID)) {
                return orderingItemsData.lastSavedTime[draftID];
            } else {
                return "";
            }
        };

        return {
            getIngredients: getIngredients,
            postIngredients: postIngredients,
            setDraftSavedTime: setDraftSavedTime,
            getDraftSavedTime: getDraftSavedTime,
        }
    };
    orderingItemsSvc.$inject = ['$q', '$timeout', 'CommonService'];
    projectCostByte.factory('orderingItemsSvc', orderingItemsSvc);
})();
