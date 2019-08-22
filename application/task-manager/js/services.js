angular.module('costbyte.tmservices', [])
    .factory('decisionStoreFactory', function() {
        var test_decisions = [{
            'startdate': Date.now(),
            'completeddate': Date.now(),
            'expiredate': Date.now(),
            'pending': true,
            'action': 'Change Price',
            'source': 'Costing Optimizer',
            'tracked_items': [{
                "Name": "Local Black Pudding",
                "Price": 17,
                "cost %": 43,
                "$Impact": RandomInt(100, 200),
                "Threshold cost %": 42,
                "Menu ID": "ID2768"
            }]
        }, {
            'startdate': Date.now(),
            'completeddate': Date.now(),
            'expiredate': Date.now(),
            'pending': false,
            'action': 'Change Price',
            'source': 'Costing Optimizer',
            'tracked_items': [{
                "Name": "Almond & Butterscotch Pudding",
                "Price": 16,
                "cost %": 42,
                "$Impact": RandomInt(100, 200),
                "Threshold cost %": 41,
                "Menu ID": "ID5039"
            }]
        }, ]
        return {
            //        decision object should be of following structure
            //         decision = {
            //            'startdate': Date.now(),
            //            'completeddate':  Date.now().setFullYear(2020),
            //            'expiredate': Date.now().setFullYear(2120),
            //            'tracked_items': []
            //            'source': 'Margin Optimizer'
            //        }
            //     tracked item should have following structure
            // tracked item = {
            //                'section': 'menu',
            //                'id': 'ID7467',
            //                'property_key': 'cost',
            //                }
            set_decision: function(decision) {
                //if object doesnt exist in local storage create it
                if (localStorage.decisionStore === undefined) {
                    localStorage.decisionStore = "[]"
                }
                //        localStorage.decisionStore = "[]";
                //get local storage object
                var decisionStore = JSON.parse(localStorage.decisionStore);
                //                console.log('setting decision')
                //                console.log(decision)
                //add the new decision to decisionStore object
                decisionStore.push(decision);
                //reset localStorage
                decisionStore = uniq(decisionStore)
                    //                console.log(decisionStore)
                    //                console.log(JSON.stringify(decisionStore))

                localStorage.decisionStore = JSON.stringify(decisionStore);
                //                        console.log("decisions", JSON.parse(localStorage.decisionStore));
            },
            getdecisionStore: function() {
                if (localStorage.decisionStore === undefined) {
                    localStorage.decisionStore = "[]"
                        //              localStorage.decisionStore =  JSON.stringify(test_decisions);
                }
                var decisionStore = JSON.parse(localStorage.decisionStore);
                //        localStorage.decisionStore =  JSON.stringify(test_decisions);
                // console.log("local ", local);
                return decisionStore;
            },
            updatedecisionStore: function(newdecisionStore) {
                localStorage.decisionStore = JSON.stringify(newdecisionStore);
            },
            //      getTitle: function() {
            //        return titleName;
            //      },
            //      setTitle: function(value) {
            //        titleName = value;
            //      }
        }
    });

function RandomNum(min, max) {
    return roundToTwo(Math.random() * (max - min + 1)) + min;
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uniq(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = JSON.stringify(a[i]);
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = a[i];
        }
    }
    return out;
}
