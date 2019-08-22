(function () {
    'use strict';

    projectCostByte.factory('UserManagerService', UserManagerService);

    UserManagerService.$inject = ['$q', 'CommonService', '$timeout', 'Utils'];

    function UserManagerService($q, CommonService, $timeout, Utils) {

        var userManagerData = {};

        var userManagerFactory = {
            fetchStoresByBusiness: fetchStoresByBusiness,
            changeSelectedStore: changeSelectedStore,
            fetchUsersByBusiness: fetchUsersByBusiness,
            fetchUser: fetchUser,
            createUser: createUser,
            addUserJobRoles: addUserJobRoles,
            saveUser: saveUser,
            fetchAllDropDownOptions: fetchAllDropDownOptions,
            refreshStoresDropDown: refreshStoresDropDown,
            getSkeleton:getSkeleton,
        };

//        userManagerData.storeDropDowns = {
//            storeNames: ['0', '1'],
//            permissionroles: ['0', '1'],
//            jobroles: ['Manager', 'Staff', 'Store Admin', 'Business Admin', 'C - Level', 'Plus'],
//            managers: ['Yes', 'No'],
//            salarytypes: ['Hourly', 'Salaried'],
//            menutypes: ['Food', 'Liquor'],
//            stafftypes: ['Kitchen', 'Front'],
//        }


        function getSkeleton(skeletonKey){
            return $q(function (resolve, reject) {
                if (userManagerData.hasOwnProperty('skeletons')){
                    if (userManagerData.skeletons.hasOwnProperty(skeletonKey)){
                        resolve(userManagerData.skeletons[skeletonKey]);
                    }
                }

                var getSkeletonRH = function(skeletonResponse){
                    if(!userManagerData.hasOwnProperty('skeletons')){
                        userManagerData.skeletons={}
                    }
                    userManagerData.skeletons[skeletonKey] = skeletonResponse;
                        resolve(userManagerData.skeletons[skeletonKey]);
                }

                CommonService.SettingsManagerGetSkeleton(getSkeletonRH, skeletonKey);
            })

        }

        function fetchStoresByBusiness(responseHandler) {

            var fetchStoresByBusinessRHW = function (stores, current_store) {
                _.forEach(stores, function (store) {
                    store.text = store.name + " - " + store.location
                });
                userManagerData.storesOriginal = angular.copy(stores);
                stores.unshift({
                    name: 'All Stores',
                    business_store_id: 'all',
                    location: stores.length + (stores.length > 1 ? ' locations' : ' location'),
                    text: 'All Stores' + " - " + stores.length + (stores.length > 1 ? ' locations' : ' location')
                });


                current_store = 'all'
                if (userManagerData.hasOwnProperty('storesData')) {
                    userManagerData.storesData.stores = stores;
                } else {
                    userManagerData.storesData = {
                        'stores': stores,
                        'current_store': current_store
                    };
                }
                responseHandler(userManagerData.storesData.stores, userManagerData.storesData.current_store)
            }
            CommonService.fetchStoresByBusiness(fetchStoresByBusinessRHW);
        }


        function changeSelectedStore(selectedIndex, responseHandler) {

            userManagerData.storesData.current_store = userManagerData.storesData.stores[selectedIndex].business_store_id;

            responseHandler(userManagerData.storesData.stores, userManagerData.storesData.current_store)
        }

        function fetchUsersByBusiness(responseHandler) {


            return $q(function (resolve, reject) {
                //                          if(userManagerData.hasOwnProperty('users')){
                //                               resolve(userManagerData['users'])
                //                        }

                var fetchUsersByBusinessRHW = function (usersData) {
                    var addUserLink = function (user) {
                        user['userLink'] = "app.userDetails({userID : '" + user.user_id + "'})"
                    }

                    _.forEach(usersData.users, addUserLink);
                    usersData.dateText = formatDate(usersData.lastUpdated);

//                    userManagerData['users'] = usersData.users;
                    userManagerData['users'] = _.keyBy(usersData.users, 'user_id');
//                    console.log(userManagerData['users'])
                    userManagerData['users-original'] = angular.copy(usersData.users);
                    resolve(usersData);

                }


                CommonService.settingsManagerGetUsers(fetchUsersByBusinessRHW);
            })





        }

        function fetchUser(userID) {
            return $q(function (resolve, reject) {
                function getUser(){
                    // get job roles then return user
                    getUserJobRoles(userID).then(function () {
                        var updatedUser = userManagerData['users'][userID];
                        resolve(updatedUser)
                    })
                }

                if (!userManagerData.hasOwnProperty('users')){
                    // fetching user data first
                    fetchUsersByBusiness().then(function(){
                        getUser();
                    })
                }else{
                    // User Data present . getting user
                    getUser()
                }
            })


        }

        function createUser() {
            return $q(function (resolve, reject) {

                var createUserByBusinessRHW = function (userData) {
                    if (!userManagerData.hasOwnProperty('users')) {
                        userManagerData.users = {}
                    }
                    userManagerData['users'][userData.user_id] = userData;

                    resolve(userData);

                }
                CommonService.settingsManagerAddUser(createUserByBusinessRHW)
            })

        }

        function saveUser(userID) {
            return $q(function (resolve, reject) {

                var saveUserRHW = function (saveResponse) {
                    resolve(saveResponse);
                }

//                var updatedUser = angular.copy(_.find(userManagerData['users'], ['user_id', userID]))
                var updatedUser = angular.copy(userManagerData['users'][userID])
//                console.log(updatedUser)
//                _.forEach(updatedUser.stores, function(store){
//                    store.business_store_id = _.get(
//                    _.find(userManagerData.storesOriginal,
//                            ['text', store.business_store_id] ), 'business_store_id');
//                })

                CommonService.settingsManagerSetUser(saveUserRHW, {
                    'user': updatedUser,
                    'user_jobroles': updatedUser.stores
                })

            })

        }

        function getUserJobRoles(userID) {
            return $q(function (resolve, reject) {
                var getUserJobRolesRHW = function (storeDataList) {

//                    var updatedUser = _.find(userManagerData['users'], ['user_id', userID])
                    var updatedUser = userManagerData['users'][userID];
                    if (!updatedUser.hasOwnProperty('stores')) {
                        updatedUser.stores = []
                    }
                    _.forEach(storeDataList.user_jobroles, function (storeData) {
//                        storeData.business_store_id = _.get(
//                            _.find(userManagerData.storesOriginal,
//                            ['business_store_id', storeData.business_store_id] ), 'text');

                        updatedUser.stores.push(storeData)
                    });
                    console.log(updatedUser)
                    resolve(storeDataList);

                }

                CommonService.settingsManagerGetUserJobRoles(getUserJobRolesRHW, userID)

            })

        }

        function addUserJobRoles(userID) {
            return $q(function (resolve, reject) {
//                var updatedUser = _.find(userManagerData['users'], ['user_id', userID])
                var updatedUser = userManagerData['users'][userID]

                if (!updatedUser.hasOwnProperty('stores')) {
                    updatedUser.stores = []
                }

//                if (updatedUser.stores.length < userManagerData.storesOriginal.length) {
                if (true) {//duplicate stores can be added

                    var addUserJobRolesRHW = function (storeData) {
                        updatedUser.stores.push(storeData)

                        resolve({
                            store_added: true,
                            store_data: storeData
                        });

                    }

                    CommonService.settingsManagerAddUserJobRoles(addUserJobRolesRHW, userID)

                } else {

                    resolve({
                        store_added: false,
                        message: 'No more stores to add.'
                    })
                }
            })

        }

        function fetchAllDropDownOptions(userID, field_name) {
            return $q(function (resolve, reject) {
                var fetchAllDropDownOptionsRHW = function (dropDownOptions) {
                  var stores = userManagerData.storesOriginal;
//                    dropDownOptions.storeNames = [];
                    dropDownOptions.storeNames = _.map(stores, function(store){
                        return {display:store.text, value:store.business_store_id}
                    });

//                    _.forEach(stores, function(store){
//                        dropDownOptions.storeNames.push(store.text)
//                    })
                    
                    console.log(dropDownOptions)
//                    if (!userManagerData.hasOwnProperty('dropDownOptions')){
//                        userManagerData.dropDownOptions =
//                    }
//                    _.merge(userManagerData.dropDownOptions, [sources])
                    userManagerData.dropDownOptions = dropDownOptions;
                    resolve(userManagerData.dropDownOptions)
                }
                CommonService.settingsManagerGetDropDownOptions(fetchAllDropDownOptionsRHW, userID, field_name)
            })
        }

        function refreshStoresDropDown(userID) {
            var user = userManagerData.users[userID]
            var selectedStores = _.map(user.stores, 'business_store_id')
            var allStores = _.map(userManagerData.storesOriginal, 'business_store_id')
            var unselectedStores = _.difference(allStores, selectedStores)
                // console.log(selectedStores);
            _.each(user.stores, function (store) {
                    store.storeNames = _.sortedUniq(_.concat(unselectedStores, store.storeName))
                })
                // console.log($scope.user.stores);
        }

        function formatDate(date_epoch) {
            var dateOptions = {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "short"
            };
            var lastSavedtime = new Date(parseInt(date_epoch) * 1000);
            return lastSavedtime.toLocaleString("en-US", dateOptions);
        }


        return userManagerFactory;
    }

})();
