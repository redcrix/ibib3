(function () {
    'use strict';

    projectCostByte.factory('PayManagerService', PayManagerService);

    PayManagerService.$inject = ['$q', 'CommonService', '$timeout', 'Utils'];

    function PayManagerService($q, CommonService, $timeout, Utils) {

        var payManagerData = {};

        
        var PayManagerFactory = {
            fetchStoresByBusiness : fetchStoresByBusiness,
            changeSelectedStore : changeSelectedStore,
            fetchEmployeesByBusiness : fetchEmployeesByBusiness,
            getLaborSettings : getLaborSettings,
            setLaborSettings : setLaborSettings,
            mergeUpdatedEmployees : mergeUpdatedEmployees,
            saveUpdatedEmployees : saveUpdatedEmployees,
            getEmployeeByUseID : getEmployeeByUseID,
            getEmployeePayHistory : getEmployeePayHistory,
            setEmployeePayHistory : setEmployeePayHistory,
            getSkeleton:getSkeleton,
        };


        function getSkeleton(skeletonKey){
            return $q(function (resolve, reject) {
                if (payManagerData.hasOwnProperty('skeletons')){
                    if (payManagerData.skeletons.hasOwnProperty(skeletonKey)){
                        resolve(payManagerData.skeletons[skeletonKey]);
                    }
                }

                var getSkeletonRH = function(skeletonResponse){
                    if(!payManagerData.hasOwnProperty('skeletons')){
                        payManagerData.skeletons={}
                    }
                    payManagerData.skeletons[skeletonKey] = skeletonResponse;
                        resolve(payManagerData.skeletons[skeletonKey]);
                }

                CommonService.SettingsManagerGetSkeleton(getSkeletonRH, skeletonKey);
            })

        }
        function getLaborSettings(){
            return $q(function (resolve, reject) {
                if (payManagerData.hasOwnProperty('laborSettings')){
                    resolve(payManagerData.laborSettings);
                }else{
                    var getLaborSettingsRH = function(laborSettings){
                        var keyed_laborSettings = _.keyBy(laborSettings, 'settingName')
                        console.log(keyed_laborSettings)
                        payManagerData.laborSettings = keyed_laborSettings;
                        resolve(payManagerData.laborSettings);
                    }
                    CommonService.settingsManagerGetLaborSettings(getLaborSettingsRH);
                }
            })
        }

        function setLaborSettings(){
            return $q(function (resolve, reject) {

                var getLaborSettingsRH = function(saveResponse){
                    saveResponse.dateText = formatDate(saveResponse.lastUpdated)
                    resolve(saveResponse);
                }
                var settingsToSave = angular.copy(_.values(payManagerData.laborSettings))
                CommonService.settingsManagerSetLaborSettings(getLaborSettingsRH, settingsToSave);
            })
        }

        function fetchStoresByBusiness(responseHandler){

            var fetchStoresByBusinessRHW = function(stores, current_store){
//                console.log(stores)
                
                stores.unshift({name:'All Stores', business_store_id: 'all', location: stores.length + (stores.length>1? ' locations': ' location')});
//                stores.push({name:'Dummy store 1', business_store_id: '1', location: 'd location 1'});
//                stores.push({name:'Dummy store 2', business_store_id: '2', location: 'd location 2'});

                _.forEach(stores, function(store) {
                    store.text = store.name + " - " + store.location
                });

                payManagerData.storeNamesByBusinessStoreId = _.keyBy(stores, 'business_store_id')

                current_store = "all"
                if(payManagerData.hasOwnProperty('storesData')){
                    payManagerData.storesData.stores = stores;
                }else{
                    payManagerData.storesData = {'stores': stores, 'current_store': current_store};
                }
                responseHandler(payManagerData.storesData.stores, payManagerData.storesData.current_store)
            }
            CommonService.fetchStoresByBusiness(fetchStoresByBusinessRHW);
        }


        function changeSelectedStore(selectedIndex, responseHandler){

            payManagerData.storesData.current_store = payManagerData.storesData.stores[selectedIndex].business_store_id;

            responseHandler(payManagerData.storesData.stores, payManagerData.storesData.current_store)
        }

        function fetchEmployeesByBusiness(responseHandler){

            if(!payManagerData.hasOwnProperty('employees')){
                payManagerData['employees'] = []
            }

            var fetchEmployeesByBusinessRHW = function(employeesData){
                var addHistoryLink = function(employee){
                    employee['historyLink'] = "app.payManagerHistory({userID : '" + employee.user_id  + "', userJobRolesID : '" + employee.user_jobrole_id +"'})"
                }

                _.forEach(employeesData.employees, addHistoryLink);

                var changeBusinessStoreIdToName = function(employee){
                    employee.business_store_id = _.get(payManagerData.storeNamesByBusinessStoreId[employee.business_store_id], 'text')
                }

                _.forEach(employeesData.employees, changeBusinessStoreIdToName);



                employeesData.dateText = formatDate(employeesData.lastUpdated);

                payManagerData['employees'] = employeesData.employees;
                payManagerData['employees-original'] = angular.copy(employeesData.employees);


                responseHandler(employeesData);

            }
            
            CommonService.settingsManagerGetEmployees(fetchEmployeesByBusinessRHW);
            
        }


        function mergeUpdatedEmployees(updatedEmployees){

//            payManagerData['employees'] = updatedEmployees;
            console.log( payManagerData['employees'])

        }

        function saveUpdatedEmployees(){

            return $q(function (resolve, reject) {
//                var reqProperties = ['business_store_id','emp_id','historyLink','job_role','name','salary','salary_date','salary_period_days','user_id']
                var changedEmployees  = []

                for(var i = payManagerData['employees'].length; i--;){
                    if(payManagerData['employees-original'][i]['salary'] != payManagerData['employees'][i]['salary']){
//                        changedEmployees.push(_.pick(payManagerData['employees'][i], reqProperties))
                        changedEmployees.push(payManagerData['employees'][i])
                    }

                }

                var saveEmployeesByBusinessRHW = function(saveResponse){
                    saveResponse.dateText = formatDate(saveResponse.lastUpdated)
                        resolve(saveResponse);
                }

                CommonService.settingsManagerSetEmployees(saveEmployeesByBusinessRHW, changedEmployees);
            })


        }


        function getEmployeeByUseID(userSelection){
            return $q(function (resolve, reject) {

                function getEmployee(){
                    resolve(_.find(payManagerData['employees'],
                            {'user_id': userSelection.userID, 'user_jobrole_id' : userSelection.userJobRolesID}))
                }

                if(!payManagerData.hasOwnProperty('employees')){
                    fetchEmployeesByBusiness(function(x){
                        getEmployee()
                    });
                }else{
                    getEmployee();
                }

            })
        }

        function getEmployeePayHistory(userSelection){
              return $q(function (resolve, reject) {

                var getEmployeePayHistoryRHW = function(payHistoryData){

                    payHistoryData.dateText = formatDate(payHistoryData.lastUpdated)

                    if(!payManagerData.hasOwnProperty('payHistories')){
                        payManagerData.payHistories = {};
                    }
                    console.log(payHistoryData)
                    payManagerData.payHistories[userSelection.userID+userSelection.userJobRolesID] = payHistoryData;
//                    console.log(payManagerData.payHistories[userSelection.userID])
                    resolve(payHistoryData);
                }

                CommonService.settingsManagerGetEmployeePayHistory(getEmployeePayHistoryRHW,
                userSelection.userID, userSelection.userJobRolesID)



            })

        }

        function setEmployeePayHistory(userSelection){
              return $q(function (resolve, reject) {

                var setEmployeePayHistoryRHW = function(saveResponse){

                    saveResponse.dateText = formatDate(saveResponse.lastUpdated)
                    resolve(saveResponse);
                }

                var updatedPayHistory  = payManagerData['payHistories'][userSelection.userID+userSelection.userJobRolesID]
//                console.log(updatedPayHistory)
                CommonService.settingsManagerSetEmployeePayHistory(setEmployeePayHistoryRHW,
                updatedPayHistory)



            })

        }


        function formatDate(date_epoch){
            var dateOptions = { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short"};
            var lastSavedtime = new Date(parseInt(date_epoch) * 1000);
            return lastSavedtime.toLocaleString("en-US", dateOptions);
        }

        return PayManagerFactory;
    }

})();
