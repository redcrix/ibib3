(function() {
  var inventoryItemsSvc = function($q, $timeout, CommonService, Utils, ConnectivityMonitor, inventoryService) {
    var INVENTORY_LAST_UPDATED_AT_KEY = 'last_updated_at';
    var INVENTORY_STATUS_KEY = 'inventory_status';
    var INVENTORY_INGREDIENTS_KEY = 'ingredients';
    var DATE_OPTIONS = {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short"
    };
    var DEBOUNCE_TIME_DELAY = 5000;
    var OFFLINE_DEBOUNCE_TIME_DELAY = 500;
    var SAVE_DRAFT_ASYNC_DELAY = 1000;
    var SAVE_DRAFT_ASYNC_POUCH_DELAY = 3000;
    var INV_DB = "inventory_draft_storage";

    var inventoryItemsData = {};
    var postIngredientsTimeout = null;
    var postIngredientsOfflineTimeout = null;
    var saveToPouchDBTimeout = null;
    inventoryItemsData.lastSavedTime = {}; // for storing the last saved time of drafts
    inventoryItemsData.ingredientsData = {}; // for storing the last saved time of drafts
    var getIngredients = function(draftId /*submitted as well*/ , force_fetch, load_history, key) {
      if (load_history, key) {
        return getIngredientsOfflineHistory(draftId, key);
      } else if (hasLostInternetConnection() || localChangesHaveNotBeenPosted(draftId)) {
        return getIngredientsOffline(draftId);
      } else {
        return getIngredientsOnline(draftId, force_fetch);
      }
    };

    var groupingOptions = [{
        'identifier': 'PRODUCT_CATEGORY',
        'key': 'ingredient_category',
        'text': 'Ingredient Category',
        'selected': false
      },
      {
        identifier: 'LOCATION',
        key: 'location',
        text: 'Location',
        selected: false
      },
      {
        identifier: 'PAR',
        key: 'quantity_to_par_group',
        text: 'Par Value',
        selected: false
      },
      {
        identifier: 'MinorCategory',
        key: 'minor_category',
        text: 'Minor Category',
        selected: false
      },
    ];


    var getIngredientsOnline = function(draftId, force_fetch) {

      return $q(function(resolve, reject) {
        CommonService.fetchIngredients(function(data, status) {
          _.forEach(data.ingredients, function(item) {
            item.ingredient_status = item.ingredient_status.toLowerCase();
          })
          // console.log("data.ingredients",data.ingredients)
          // set status
          //                    var inventoryData = {
          //                        'inventory_status': data.inventory_status
          //                    };
          //Even if the internet connection is available, check if a local draft exists and the time it is saved is
          //greater than that of the timestamp from server.
          var localDraft = getLocalDraft(draftId);
          if (localDraft && (localDraft.last_updated_at > data.last_updated_at)) {
            // console.log("local draft data is new compared to server data");
            data = localDraft;
          }

          inventoryItemsData.ingredientsData[draftId] = {
            'inventory_status': data.inventory_status
          };
          inventoryItemsData.status = status;
          // set ingredients
          _.forEach(data.ingredients, function(ingredient) {
            if (ingredient.hasOwnProperty('quantity')) {
              ingredient.quantity = Number(ingredient.quantity);
            }
            if (ingredient.hasOwnProperty('rank')) {
              ingredient.rank = Number(ingredient.rank);
            }
            ingredient.searchHidden = false;

          });
          //                    inventoryData.ingredients = data.ingredients;
          inventoryItemsData.ingredientsData[draftId]['ingredients'] = data.ingredients;
          inventoryItemsData.ingredientsData[draftId]['isLocationAvailable'] = _.some(data.ingredients, "location");
          // set last updated at
          if (data.hasOwnProperty(INVENTORY_LAST_UPDATED_AT_KEY)) {
            //ak var lastSavedtime = new Date(parseInt(data.last_updated_at) * 1000);
            //                      inventoryData[INVENTORY_LAST_UPDATED_AT_KEY] = lastSavedtime.toLocaleString("en-US", DATE_OPTIONS);
            inventoryItemsData.ingredientsData[draftId][INVENTORY_LAST_UPDATED_AT_KEY] = data.last_updated_at;
            //ak inventoryItemsData.ingredientsData[draftId][INVENTORY_LAST_UPDATED_AT_KEY] = lastSavedtime.toLocaleString("en-US", DATE_OPTIONS);
          }


          //                    inventoryData.ingredients = _.sortBy(inventoryData.ingredients || [], 'rank'); //sort by rank
          inventoryItemsData.ingredientsData[draftId].ingredients = _.sortBy(inventoryItemsData.ingredientsData[draftId].ingredients || [], 'rank'); //sort by rank
          //                    resolve(inventoryData);

          resolve(inventoryItemsData.ingredientsData[draftId]);
          // console.log("resolve",resolve(inventoryItemsData.ingredientsData[draftId]))
          //                    saveDraftAsync(draftId, inventoryData);
          saveDraftAsync(draftId, inventoryItemsData.ingredientsData[draftId]);
        }, draftId, force_fetch)
      })
    };

    var saveDraftAsync = function(draftId, inventoryData) {
      $timeout(function() {
        saveDraftLocally(draftId, inventoryData);
      }, SAVE_DRAFT_ASYNC_DELAY);

      // $timeout(function () {
      //     Utils.updatePouchDb(INV_DB, draftId, inventoryData);
      // }, SAVE_DRAFT_ASYNC_POUCH_DELAY);

    };

    saveDraftDataToPouchAsync = function(draftId, inventoryData) {
      $timeout(function() {
        Utils.updatePouchDb(INV_DB, draftId, inventoryData);
      }, SAVE_DRAFT_ASYNC_POUCH_DELAY);

    };

    var getIngredientsOfflineHistory = function(draftId, key) {
      console.log("inside offline history");
      console.log(key);
      return $q(function(resolve, reject) {
        var localDraft = key;
        if (!localDraft) {
          reject({});
          return;
        }
        inventoryItemsData.ingredientsData[draftId] = {
          'inventory_status': localDraft.inventory_status
        };
        // set ingredients
        _.forEach(localDraft.ingredients, function(ingredient) {
          if (ingredient.hasOwnProperty('quantity')) {
            ingredient.quantity = Number(ingredient.quantity);
          }
          if (ingredient.hasOwnProperty('rank')) {
            ingredient.rank = Number(ingredient.rank);
          }
          ingredient.searchHidden = false;
        });
        inventoryItemsData.status = 200;
        inventoryItemsData.ingredientsData[draftId][INVENTORY_LAST_UPDATED_AT_KEY] = localDraft.last_updated_at;
        inventoryItemsData.ingredientsData[draftId]['ingredients'] = localDraft.ingredients;
        inventoryItemsData.ingredientsData[draftId]['isLocationAvailable'] = _.some(localDraft.ingredients, "location");
        inventoryItemsData.ingredientsData[draftId].ingredients = _.sortBy(inventoryItemsData.ingredientsData[draftId].ingredients || [], 'rank'); //sort by rank
        resolve(inventoryItemsData.ingredientsData[draftId]);
        //localDraft.ingredients = _.sortBy(localDraft.ingredients || [], 'rank');
        //resolve(localDraft);

      });
    }

    var getIngredientsOffline = function(draftId) {
      return $q(function(resolve, reject) {
        var localDraft = getLocalDraft(draftId);
        if (!localDraft) {
          reject({});
          return;
        }
        inventoryItemsData.ingredientsData[draftId] = {
          'inventory_status': localDraft.inventory_status
        };
        // set ingredients
        _.forEach(localDraft.ingredients, function(ingredient) {
          if (ingredient.hasOwnProperty('quantity')) {
            ingredient.quantity = Number(ingredient.quantity);
          }
          if (ingredient.hasOwnProperty('rank')) {
            ingredient.rank = Number(ingredient.rank);
          }
          ingredient.searchHidden = false;
        });
        inventoryItemsData.status = 200;
        inventoryItemsData.ingredientsData[draftId][INVENTORY_LAST_UPDATED_AT_KEY] = localDraft.last_updated_at;
        inventoryItemsData.ingredientsData[draftId]['ingredients'] = localDraft.ingredients;
        inventoryItemsData.ingredientsData[draftId]['isLocationAvailable'] = _.some(localDraft.ingredients, "location");
        inventoryItemsData.ingredientsData[draftId].ingredients = _.sortBy(inventoryItemsData.ingredientsData[draftId].ingredients || [], 'rank'); //sort by rank
        resolve(inventoryItemsData.ingredientsData[draftId]);
        //localDraft.ingredients = _.sortBy(localDraft.ingredients || [], 'rank');
        //resolve(localDraft);

      });
    };
    //----------------------------------------
    /*   function sendDraftIDService(CommonService) {
        var sendDraftIdFactory = {
            fetchDraftID: fetchDraftID,
        };
        return sendDraftIdFactory;
    } */

    function fetchDraftID(draft_id, responseHandler) {
      CommonService.editSubmittedDraft(draft_id, responseHandler);
    }
    //---------------------------------------------------------------------
    var saveDraftLocally = function(draftId, inventoryData) {
      console.log("saving draft locally");
      Utils.setLocalValue(getDraftIdLocalPersistenceKey(draftId), JSON.stringify(inventoryData));
      // console.log("Draft saved locally");
    };

    var getLocalDraft = function(draftId, inventoryData) {
      var draftId = getDraftIdLocalPersistenceKey(draftId);
      if (draftId) {
        var draftJsonString = Utils.getLocalValue(draftId);
        if (draftJsonString) {
          return JSON.parse(draftJsonString);
        }
      }
      return null;
    };

    var isDraftSavedLocally = function(draftId) {
      return !!Utils.getLocalValue(getDraftIdLocalPersistenceKey(draftId));
    };

    var getDraftIdLocalPersistenceKey = function(draftId) {
      if (draftId) {
        return "INGREDIENTS_" + draftId;
      }
      return null;
    };

    //        var postIngredients = function (ingredients, inventoryStatus) {
    var postIngredients = function(draftID, inventoryStatus) {
      // console.log(draftID);
      var ingredients = _.get(inventoryItemsData, ['ingredientsData', draftID, 'ingredients']);
      if (saveToPouchDBTimeout) {
        $timeout.cancel(saveToPouchDBTimeout)
      }
      if (hasLostInternetConnection()) {
        return postIngredientsOffline(ingredients, inventoryStatus);
      } else {
        return postIngredientsOnline(ingredients, inventoryStatus);
      }
    };

    var postIngredientsminor = function(draftID, inventoryStatus, item) {
      // console.log("item",item);
      return $q(function(resolve, reject) {
        var ingredients = _.get(inventoryItemsData, ['ingredientsData', draftID, 'ingredients']);
        _.forEach(ingredients, function(data) {
          _.forEach(item, function(value) {
            if (data.inventory_item_id == value.inventory_item_id) {
              data.minor_category = value.minor_category;
            }
          })
        })

        var postMinorCategoryRes = function(response) {
          // console.log("postMinorCategoryRes",response);
          resolve(response.data);
        };

        CommonService.updateMinorCategory(postMinorCategoryRes, item);
      })

      // if (hasLostInternetConnection()) {
      //     return postIngredientsOffline(ingredients, inventoryStatus);
      // } else {
      //     return postIngredientsOnline(ingredients, inventoryStatus);
      // }
    }
    var postIngredientsOnline = function(ingredients, inventoryStatus) {
      return $q(function(resolve, reject) {
        var payload = {
          'inventory_status': inventoryStatus,
          'ingredients': ingredients
        };

        payload.ingredients = ingredients.map(function(ing) {
          var val = ing.quantity * ing.ingredient_price;
          ing.value = isNaN(val) ? 0 : val;
          return ing;
        });

        if (postIngredientsTimeout) {
          $timeout.cancel(postIngredientsTimeout)
        }

        var draftId = getDraftIdFromIngredients(ingredients);
        if (draftId) {
          setLocalChangesHaveNotBeenPosted(draftId, true);
        }
        var commonServicePostIngredients = function() {
          CommonService.postIngredients(function(data) {
            if (data.data == null || data.data.hasOwnProperty('error')) {
              setLocalChangesHaveNotBeenPosted(draftId, true);
              reject(data);
              return;
            }
            setLocalChangesHaveNotBeenPosted(draftId, false);
            // console.log("data has been posted successfully online");
            // console.log(data);
            resolve(data);
          }, payload);
        };

        postIngredientsTimeout = $timeout(commonServicePostIngredients, DEBOUNCE_TIME_DELAY);

        var saveIngredientsToPouchDB = function() {
          // console.log("calling from post ing online");
          saveDraftDataToPouchAsync(draftId, payload);
        }
        saveToPouchDBTimeout = $timeout(saveIngredientsToPouchDB, SAVE_DRAFT_ASYNC_POUCH_DELAY);

        if (draftId) {
          //   console.log("saving draft in post Ing ol");
          //ak    var lastSavedtime = new Date();
          var lastSavedtime = Math.round((new Date()).getTime() / 1000);
          payload[INVENTORY_LAST_UPDATED_AT_KEY] = lastSavedtime;
          //ak  payload[INVENTORY_LAST_UPDATED_AT_KEY] = lastSavedtime.toLocaleString("en-US", DATE_OPTIONS);
          saveDraftAsync(draftId, payload);

        }
      });
    };

    var getDraftIdFromIngredients = function(ingredients) {
      if (ingredients) {
        if (ingredients.length > 0) {
          return ingredients[0].draft_id;
        }
      }
      return null;
    };

    var postIngredientsOffline = function(ingredients, inventoryStatus) {
      return $q(function(resolve, reject) {
        if (inventoryStatus != 'draft') {
          reject({});
          return;
        }

        var payload = {
          'inventory_status': inventoryStatus,
          'ingredients': ingredients
        };

        if (postIngredientsOfflineTimeout) {
          $timeout.cancel(postIngredientsOfflineTimeout)
        }

        payload.ingredients = ingredients.map(function(ing) {
          var val = ing.quantity * ing.ingredient_price;
          ing.value = isNaN(val) ? 0 : val;
          return ing;
        });

        //ak var lastSavedtime = new Date();
        //ak  payload[INVENTORY_LAST_UPDATED_AT_KEY] = lastSavedtime.toLocaleString("en-US", DATE_OPTIONS);

        var lastSavedtime = Math.round((new Date()).getTime() / 1000);
        payload[INVENTORY_LAST_UPDATED_AT_KEY] = lastSavedtime;
        var draftId = getDraftIdFromIngredients(ingredients);
        if (draftId) {
          var saveIngredientsLocally = function() {
            saveDraftAsync(draftId, payload);
            setLocalChangesHaveNotBeenPosted(draftId, true);
            // console.log("data has been posted successfully offline");
            // console.log(payload);
            resolve();
          };
          postIngredientsOfflineTimeout = $timeout(saveIngredientsLocally, OFFLINE_DEBOUNCE_TIME_DELAY);

          var saveIngredientsToPouchDB = function() {
            saveDraftDataToPouchAsync(draftId, payload);
          }
          saveToPouchDBTimeout = $timeout(saveIngredientsToPouchDB, SAVE_DRAFT_ASYNC_POUCH_DELAY);
        }
      });
    };

    var setDraftSavedTime = function(draftID) {
      inventoryItemsData.lastSavedTime[draftID] = Math.round((new Date()).getTime() / 1000);
      //akinventoryItemsData.lastSavedTime[draftID] = (new Date()).toLocaleString("en-US", DATE_OPTIONS);
    };

    var getDraftSavedTime = function(draftID) {
      if (inventoryItemsData.lastSavedTime.hasOwnProperty(draftID)) {
        return inventoryItemsData.lastSavedTime[draftID];
      } else {
        return "";
      }
    };

    var hasLostInternetConnection = function() {
      if (ConnectivityMonitor.isOffline()) {
        return true;
      }
      // console.log("ConnectivityMonitor.isOffline()",ConnectivityMonitor.isOffline())
      // if (window.Connection) {
      //     return navigator.connection.type == Connection.NONE;
      // }
      return false;
    };

    var localChangesHaveNotBeenPosted = function(draftID) {
      var value = Utils.getLocalValue(getLocalChangesHaveNotBeenPostedLocalPersistenceKey(draftID));
      if (value) {
        return eval(value);
      }
      return false;
    };

    var setLocalChangesHaveNotBeenPosted = function(draftID, value) {
      if (draftID) {
        Utils.setLocalValue(getLocalChangesHaveNotBeenPostedLocalPersistenceKey(draftID), value + "");
      }
    };

    var getLocalChangesHaveNotBeenPostedLocalPersistenceKey = function(draftID) {
      if (draftID) {
        return "LOCAL_CHANGES_NOT_POSTED_" + draftID;
      }
      return null;
    };

    var getsupplierItemConfig = function(supplier_id, supplier_item_id, inventory_item_id, activeCategory) {
      return $q(function(resolve, reject) {
        var payload = {
          'supplier_id': supplier_id,
          'supplier_item_id': supplier_item_id,
          'inventory_item_id': inventory_item_id,
          'inv_category': activeCategory
        };

        var getsupplierItemConfigRHW = function(response) {
          // console.log(response);
          resolve(response.data);
        };

        CommonService.getsupplierItemConfig(getsupplierItemConfigRHW, payload);
      })

    };

    var saveModifiedIngredientConfig = function(newConfig) {
      return $q(function(resolve, reject) {
        var saveModifiedIngredientConfigRHW = function(response) {
          resolve(response.data);
        };

        CommonService.setModifiedsupplierItemConfig(saveModifiedIngredientConfigRHW, newConfig);

      })


    };

    var saveModifiedIngredientPrice = function(newConfig) {
      return $q(function(resolve, reject) {
        var saveModifiedIngredientPriceRHW = function(response) {
          resolve(response.data);
        };

        CommonService.inventorySaveModifiedIngredientPrice(saveModifiedIngredientPriceRHW, newConfig);

      })


    };

    var saveCustomField = function(field_name, new_value) {

      return $q(function(resolve, reject) {
        var saveCustomFieldRHW = function(response) {
          resolve(response.data);
        };

        CommonService.saveCustomSupplierItemField(saveCustomFieldRHW, {
          'field_name': field_name,
          'value': new_value
        });

      })
    };

    var setGroupingOption = function(groupingOptionIdentifier) {
      return $q(function(resolve, reject) {
        _.forEach(groupingOptions, function(groupingOption) {
          groupingOption.selected = false;
        });
        var selected_grouping_option = _.find(groupingOptions, {
          identifier: groupingOptionIdentifier
        });
        selected_grouping_option['selected'] = true;
        resolve(selected_grouping_option)
      })
    };


    var getGroupingOption = function() {
      return $q(function(resolve, reject) {
        var selected_grouping_option = _.find(groupingOptions, 'selected');
        resolve(selected_grouping_option)
      })
    };

    var previous_grouping_view = null;
    var groupIngredients = function(draftID, isOffline = false) {
      return $q(function(resolve, reject) {
        // console.log(inventoryItemsData);
        var data = _.get(inventoryItemsData, ['ingredientsData', draftID, 'ingredients']);
        // console.log(inventoryService.getSelectedGroupBy());
        // var currentView = _.get(_.find(groupingOptions, 'selected'), 'key');
        var currentView = inventoryService.getSelectedGroupBy();
        // console.log('grouping ingredients :' + previous_grouping_view + " => " + currentView)
        var preserve_expansions = false;
        if (previous_grouping_view == currentView) {
          // console.log('if1111')
          if (_.has(inventoryItemsData, ['ingredientsGroupedData', draftID, 'groups'])) {
            preserve_expansions = true;
            // console.log('if2222')
            //                        var all_groups = _.get(inventoryItemsData, ['ingredientsGroupedData', draftID, 'groups'])
            //                        console.log(all_groups)
            //                        var expanded_groups = _.map(_.filter(all_groups,'isExpanded'), 'name')
            var expanded_groups = _.chain(inventoryItemsData)
              .get(['ingredientsGroupedData', draftID, 'groups'])
              .filter('isExpanded')
              .map('name')
              .value()
            // console.log(expanded_groups)
          }
        }


        previous_grouping_view = currentView;

        //console.log(data)
        if (currentView == 'quantity_to_par_group') {
          // console.log('3333')
          // data = angular.copy(data);
          // console.log(data)
          var supplier_item_identification = function(supplier_item) {
            return supplier_item['supplier_id'] + "-@@-" + supplier_item['supplier_item_id']
          };

          var multi_item_keys = _.keys(_.pickBy(_.countBy(data, supplier_item_identification), function(key_count) {
            return key_count > 1;
          }));

          _.forEach(data, function(item) {
            // console.log(item.ingredient_name);
            item.stageQuantity = item.quantity;
            // console.log(item.quantity,item.par);
            if (!item.quantity || item.quantity == null || item.quantity == '' || item.quantity == 0) {
              item.quantity_to_par_group = "Items without inventory";
              // console.log("Items without inventory");
              // item.stageQuantity = item.quantity;
            } else if (item.quantity > item.par) {
              item.quantity_to_par_group = 'Items above Par value';
              // console.log("Items above Par value");
            } else if (item.quantity != null) {
              item.quantity_to_par_group = 'Items ready for ordering';
              // console.log("Items ready for ordering");
            }
          });

          var mergeQuantity = function(item_group) {
            var sum = _.reduce(item_group, function(sum, item) {
              if (!isNaN(item.quantity))
                return sum + item.quantity;
              else {
                if (sum === 0)
                  return null;
                else
                  return sum
              }
            }, 0);
            item_group[0].quantity = sum;
            if (isNaN(item_group[0].quantity)) {
              item_group[0].quantity_to_par_group = "Items without inventory"
            } else if (item_group[0].quantity > item_group[0].par) {
              item_group[0].quantity_to_par_group = 'Items above Par value'
            } else if (item_group[0].quantity != null) {
              item_group[0].quantity_to_par_group = 'Items ready for ordering'
            }
            // item_group[0]['quantity_to_par_group'] =    item_group[0].quantity > item_group[0].par ? 'Items above Par value' : 'Items ready for ordering';

            return [item_group[0]]
          };

          var items_by_supplier_item_id = _.groupBy(data, supplier_item_identification);

          // _.forEach(multi_item_keys, function (multi_item_key) {
          //     items_by_supplier_item_id[multi_item_key] = mergeQuantity(items_by_supplier_item_id[multi_item_key])
          // });
          // console.log(items_by_supplier_item_id)
          data = _.flatten(_.values(items_by_supplier_item_id))
          //  console.log(data)
        }
        // console.log(data)
        // console.log(currentView)
        var categories = _.groupBy(data, currentView);
        // console.log(categories)
        var groupedList = _.map(categories, function(cat) {
          return {
            name: cat[0][currentView],
            ingredients: cat,
            //                    rank : _.reduce(cat, function(memo, ingredient){ return memo + ingredient.rank; }, 0)/(cat.length)
            rank: _.get(cat, '[0].rank') // category rank = minimum of(ingredient ranks in category)
          }
        });

        if (currentView === 'quantity_to_par_group') {
          // console.log('if4444')
          _.set(groupedList, [_.findIndex(groupedList, ['name', "Items without inventory"]), 'rank'], 9999999);
          _.set(groupedList, [_.findIndex(groupedList, ['name', "Items above Par value"]), 'rank'], 10);
          _.set(groupedList, [_.findIndex(groupedList, ['name', "Items ready for ordering"]), 'rank'], 1)
        }

        groupedList = _.sortBy(groupedList, 'rank');
        // console.log(groupedList);
        if (preserve_expansions) {
          //                    console.log(expanded_groups)
          _.forEach(groupedList, function(new_group) {
            if (_.indexOf(expanded_groups, _.get(new_group, ['name'])) != -1) {
              _.set(new_group, ['isExpanded'], true)
            }
          })
        }
        groupedList.status = inventoryItemsData.status;
        _.set(inventoryItemsData, ['ingredientsGroupedData', draftID, 'groups'], groupedList);
        resolve(groupedList, currentView)
        // console.log("currentView1",currentView)
      });

    };

    var getIngredientsServiceVersion = function(draftID) {
      return _.get(inventoryItemsData, ['ingredientsData', draftID, 'ingredients']);
    };

    return {
      fetchDraftID: fetchDraftID,
      getIngredients: getIngredients,
      postIngredients: postIngredients,
      setDraftSavedTime: setDraftSavedTime,
      getDraftSavedTime: getDraftSavedTime,
      hasLostInternetConnection: hasLostInternetConnection,
      getsupplierItemConfig: getsupplierItemConfig,
      saveModifiedIngredientConfig: saveModifiedIngredientConfig,
      saveModifiedIngredientPrice: saveModifiedIngredientPrice,
      saveCustomField: saveCustomField,
      groupIngredients: groupIngredients,
      setGroupingOption: setGroupingOption,
      getGroupingOption: getGroupingOption,
      getIngredientsServiceVersion: getIngredientsServiceVersion,
      postIngredientsminor: postIngredientsminor
    }
  };
  inventoryItemsSvc.$inject = ['$q', '$timeout', 'CommonService', 'Utils', 'ConnectivityMonitor', 'inventoryService'];
  projectCostByte.factory('inventoryItemsSvc', inventoryItemsSvc);
})();
