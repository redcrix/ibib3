//angular.module('costbyte.copservices', [])
//
//
//.factory('MenuFactory', ['CommonService',function(CommonService) {
//  // Might use a resource here that returns a JSON array
//
//  // Some fake testing data
// var menu ={
// "Food": {
//  "Menu Item Category": {
//  "Burgers": {
//    "items": [
//     {
//      "Name": "Cheeseburger",
//      "Price": 13.0,
//      "cost %": 34.38461538,
//      "$Impact": "95031",
//      "Threshold cost %": 34.0,
//      "Menu ID": "ID2100"
//     },
//     {
//      "Name": "Turkey Burger",
//      "Price": 14.0,
//      "cost %": 35.64285714,
//      "$Impact": "89686",
//      "Threshold cost %": 34.0,
//      "Menu ID": "ID6576"
//     },
//     {
//      "Name": "French Onion Burger",
//      "Price": 15.0,
//      "cost %": 34.0,
//      "$Impact": "31935",
//      "Threshold cost %": 34.0,
//      "Menu ID": "ID7163"
//     }
//    ],
//    "Category Cost %": 34.67582418
//   },
//   "Starters": {
//    "items": [
//     {
//      "Name": "Local Black Pudding",
//      "Price": 17,
//      "cost %": 43,
//      "$Impact": "559",
//      "Threshold cost %": 42,
//      "Menu ID": "ID2768"
//     },
//     {
//      "Name": "Soup of the Moment",
//      "Price": 18,
//      "cost %": 44,
//      "$Impact": "933",
//      "Threshold cost %": 42,
//      "Menu ID": "ID8148"
//     },
//     {
//      "Name": "Home-Made Pat",
//      "Price": 15,
//      "cost %": 43,
//      "$Impact": "1291",
//      "Threshold cost %": 42,
//      "Menu ID": "ID2787"
//     },
//     {
//      "Name": "Smoked Salmon and brown bread",
//      "Price": 14,
//      "cost %": 36,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID7266"
//     },
//     {
//      "Name": "Loch Fyne Pickled Herring",
//      "Price": 14,
//      "cost %": 33,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID7881"
//     },
//     {
//      "Name": "Locally Smoked Mussels",
//      "Price": 9,
//      "cost %": 37,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID1132"
//     },
//     {
//      "Name": "Bradon Rost Pate and toast",
//      "Price": 8,
//      "cost %": 34,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID1101"
//     }
//    ],
//    "Category Cost %": 38
//   },
//   "Side Orders": {
//    "items": [
//     {
//      "Name": "Garlic Bread with Cheese",
//      "Price": 10,
//      "cost %": 42,
//      "$Impact": "1062",
//      "Threshold cost %": 41,
//      "Menu ID": "ID5179"
//     },
//     {
//      "Name": "Garlic Bread",
//      "Price": 19,
//      "cost %": 41,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID5068"
//     },
//     {
//      "Name": "Curly Seasoned Potato Fries",
//      "Price": 14,
//      "cost %": 39,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID3892"
//     },
//     {
//      "Name": "Seasoned Potato Wedges",
//      "Price": 6,
//      "cost %": 38,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID6366"
//     }
//    ],
//    "Category Cost %": 40
//   },
//   "Sweets": {
//    "items": [
//     {
//      "Name": "Almond & Butterscotch Pudding",
//      "Price": 16,
//      "cost %": 42,
//      "$Impact": "990",
//      "Threshold cost %": 41,
//      "Menu ID": "ID5039"
//     },
//     {
//      "Name": "Chocolate Fondant",
//      "Price": 16,
//      "cost %": 40,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID1109"
//     },
//     {
//      "Name": "Lemon Pudding with ice cream ",
//      "Price": 7,
//      "cost %": 36,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID3992"
//     },
//     {
//      "Name": "Lemon Pudding with ice cream ",
//      "Price": 7,
//      "cost %": 40,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID1994"
//     }
//    ],
//    "Category Cost %": 39
//   },
//   "Main Courses": {
//    "items": [
//     {
//      "Name": "Chicken Breasts with Haggis",
//      "Price": 10,
//      "cost %": 44,
//      "$Impact": "790",
//      "Threshold cost %": 42,
//      "Menu ID": "ID2240"
//     },
//     {
//      "Name": "Creel-caught Gairloch Prawns",
//      "Price": 13,
//      "cost %": 43,
//      "$Impact": "839",
//      "Threshold cost %": 42,
//      "Menu ID": "ID9102"
//     },
//     {
//      "Name": "Locally dressed Crab",
//      "Price": 18,
//      "cost %": 42,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID8976"
//     },
//     {
//      "Name": "Scallops wrapped in bacon",
//      "Price": 13,
//      "cost %": 40,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID9810"
//     },
//     {
//      "Name": "Roast Rib of Scottish Beef",
//      "Price": 5,
//      "cost %": 35,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID7273"
//     },
//     {
//      "Name": "Appleby Sausages and onion gravy",
//      "Price": 8,
//      "cost %": 33,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID9847"
//     },
//     {
//      "Name": "Moules Mariniere",
//      "Price": 11,
//      "cost %": 41,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID7176"
//     },
//     {
//      "Name": "Butternut Squash & Sage Tortellini",
//      "Price": 13,
//      "cost %": 34,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID3156"
//     },
//     {
//      "Name": "0ven-baked local Salmon",
//      "Price": 20,
//      "cost %": 40,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID3419"
//     }
//    ],
//    "Category Cost %": 39
//   },
////   "Burgers": {
////    "items": [
////     {
////      "Name": "Chilli Burger",
////      "Price": 11,
////      "cost %": 33,
////      "$Impact": "",
////      "Threshold cost %": 45,
////      "Menu ID": "ID8053"
////     },
////     {
////      "Name": "Cheese, Bacon Burger",
////      "Price": 12,
////      "cost %": 44,
////      "$Impact": "",
////      "Threshold cost %": 45,
////      "Menu ID": "ID6478"
////     },
////     {
////      "Name": "Beef Burger",
////      "Price": 15,
////      "cost %": 38,
////      "$Impact": "",
////      "Threshold cost %": 45,
////      "Menu ID": "ID7269"
////     },
////     {
////      "Name": "Cheese Burger",
////      "Price": 12,
////      "cost %": 38,
////      "$Impact": "",
////      "Threshold cost %": 45,
////      "Menu ID": "ID4199"
////     }
////    ],
////    "Category Cost %": 38
////   },
//   "Hot Sandwiches": {
//    "items": [
//     {
//      "Name": "Hot Chilli Cheese Baguette",
//      "Price": 10,
//      "cost %": 43,
//      "$Impact": "",
//      "Threshold cost %": 45,
//      "Menu ID": "ID4125"
//     },
//     {
//      "Name": "Beef and Onion Baguette",
//      "Price": 13,
//      "cost %": 38,
//      "$Impact": "",
//      "Threshold cost %": 45,
//      "Menu ID": "ID5268"
//     },
//     {
//      "Name": "Bacon and Cheese Baguette",
//      "Price": 20,
//      "cost %": 44,
//      "$Impact": "",
//      "Threshold cost %": 45,
//      "Menu ID": "ID4589"
//     }
//    ],
//    "Category Cost %": 41
//   }
//  },
//  "Overall Cost %": 39
// },
// "Liquor": {
//  "Menu Item Category": {
//   "Beer Cocktails": {
//    "items": [
//     {
//      "Name": "Irish Redneck",
//      "Price": 5,
//      "cost %": 44,
//      "$Impact": "618",
//      "Threshold cost %": 41,
//      "Menu ID": "ID5284"
//     },
//     {
//      "Name": "Black Skull",
//      "Price": 5,
//      "cost %": 43,
//      "$Impact": "1087",
//      "Threshold cost %": 41,
//      "Menu ID": "ID3141"
//     },
//     {
//      "Name": "Velvet Skull",
//      "Price": 10,
//      "cost %": 43,
//      "$Impact": "1445",
//      "Threshold cost %": 41,
//      "Menu ID": "ID4569"
//     },
//     {
//      "Name": "Black Velvet",
//      "Price": 12,
//      "cost %": 44,
//      "$Impact": "1489",
//      "Threshold cost %": 41,
//      "Menu ID": "ID4297"
//     },
//     {
//      "Name": "Dirty Hippie",
//      "Price": 16,
//      "cost %": 41,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID2343"
//     },
//     {
//      "Name": "Apple Cobbler",
//      "Price": 14,
//      "cost %": 40,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID5340"
//     },
//     {
//      "Name": "Velvet Moon",
//      "Price": 16,
//      "cost %": 34,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID3383"
//     },
//     {
//      "Name": "Bruised Banana",
//      "Price": 9,
//      "cost %": 33,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID6877"
//     },
//     {
//      "Name": "Snakebite",
//      "Price": 12,
//      "cost %": 35,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID3905"
//     },
//     {
//      "Name": "Black & White",
//      "Price": 13,
//      "cost %": 38,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID8070"
//     },
//     {
//      "Name": "Black n Hoppy",
//      "Price": 14,
//      "cost %": 33,
//      "$Impact": "",
//      "Threshold cost %": 41,
//      "Menu ID": "ID1593"
//     }
//    ],
//    "Category Cost %": 38
//   },
//   "Imported Beer": {
//    "items": [
//     {
//      "Name": "Kopparberg",
//      "Price": 15,
//      "cost %": 43,
//      "$Impact": "501",
//      "Threshold cost %": 42,
//      "Menu ID": "ID2561"
//     },
//     {
//      "Name": "Dos Equis",
//      "Price": 5,
//      "cost %": 44,
//      "$Impact": "521",
//      "Threshold cost %": 42,
//      "Menu ID": "ID7271"
//     },
//     {
//      "Name": "Clausthaler",
//      "Price": 18,
//      "cost %": 44,
//      "$Impact": "921",
//      "Threshold cost %": 42,
//      "Menu ID": "ID6112"
//     },
//     {
//      "Name": "Corona Light",
//      "Price": 8,
//      "cost %": 41,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID2852"
//     },
//     {
//      "Name": "Innis & Gunn",
//      "Price": 20,
//      "cost %": 35,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID9426"
//     },
//     {
//      "Name": "Heineken",
//      "Price": 12,
//      "cost %": 38,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID1786"
//     },
//     {
//      "Name": "Corona",
//      "Price": 10,
//      "cost %": 34,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID1483"
//     },
//     {
//      "Name": "Chimay",
//      "Price": 9,
//      "cost %": 33,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID9091"
//     },
//     {
//      "Name": "Guinness",
//      "Price": 13,
//      "cost %": 37,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID5901"
//     },
//     {
//      "Name": "Delirium Tremens",
//      "Price": 6,
//      "cost %": 36,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID9326"
//     },
//     {
//      "Name": "Boddingtons, Pub Ale",
//      "Price": 7,
//      "cost %": 36,
//      "$Impact": "",
//      "Threshold cost %": 42,
//      "Menu ID": "ID3897"
//     }
//    ],
//    "Category Cost %": 38
//   }
//  },
//  "Overall Cost %": 38
// }
//}
//
//
//  return {
//
//    get_menus: function() {
//      return Commonservice.fetchMarginOptimizerMenus();
//    },
//    overallcosts: function() {
//      return {"Food": menu["Food"]["Overall Cost %"],
//               "Liquor" : menu["Liquor"]["Overall Cost %"]
//            }
//    },
//    menucatogories: function() {
//       var fcats = Object.keys(menu["Food"]["Menu Item Category"])
//       var lcats = Object.keys(menu["Liquor"]["Menu Item Category"])
//
//       var fcatlist = [];
//        for(var i = 0; i < fcats.length; i++)
//            {
//                fcatlist.push({
//                    "category":fcats[i],
//                    "categorycost": menu["Food"]["Menu Item Category"][fcats[i]]["Category Cost %"],
//                })
//            }
//
//       var lcatlist = [];
//        for(var i = 0; i < lcats.length; i++)
//            {
//                lcatlist.push({
//                    "category":lcats[i],
//                    "categorycost": menu["Liquor"]["Menu Item Category"][lcats[i]]["Category Cost %"],
//                })
//            }
//
//      return {"Food": fcatlist ,
//               "Liquor" : lcatlist
//            }
//    },
//    categorydata: function(flcategory, mcategory) {
//       var items = menu[flcategory]["Menu Item Category"][mcategory]["items"]
//
//
//       var itemlist = [];
//        for(var i = 0; i < items.length; i++)
//            {
//                var redflag = "greenflag"
//                if (items[i]["cost %"] > items[i]["Threshold cost %"]){
//                    redflag = "redflag"
//                }
//                itemlist.push({
//                    "itemname": items[i]["Name"],
//                    "itemcostp": items[i]["cost %"],
//                    "itemimpact": parseInt(items[i]["$Impact"]) || 0,
//                    "itemid": items[i]["Menu ID"],
//                    "redflag": redflag,
//                    "price" : items[i]["Price"],
//                    "tc" : items[i]["Threshold cost %"],
//                    "costchange":  get_costchange(items[i]["Menu ID"], items[i]["Threshold cost %"]>items[i]["cost %"])
//                })
//            }
//
//        itemlist.sort(dynamicSort("-itemimpact"));
//      return  {'il':itemlist,'categorycost':menu[flcategory]["Menu Item Category"][mcategory]["Category Cost %"]}
//    },
//    itemdata: function(flcategory, mcategory, itemid) {
//       var items = menu[flcategory]["Menu Item Category"][mcategory]["items"]
//
//
//       var itemlist = {};
//        for(var i = 0; i < items.length; i++)
//            { if(items[i]["Menu ID"]==itemid){
//                itemlist={
//                    "name": items[i]["Name"],
//                    "costp": items[i]["cost %"],
//                    "impact": parseInt(items[i]["$Impact"]) || 0,
//                    "id": items[i]["Menu ID"],
//                    "price":items[i]["Price"],
//                    "tc":items[i]["Threshold cost %"]
//                }
//            }
//            }
//
//      return  itemlist
//    },
//  };
//}]);
//
//function shorten(tx) {
//    if (tx.length>30){
//        return unescape(tx.slice(0,25)) ;
//    }else{
//      return unescape(tx);
//    }
//}
//
//function dynamicSort(property) {
//    var sortOrder = 1;
//    if(property[0] === "-") {
//        sortOrder = -1;
//        property = property.substr(1);
//    }
//    return function (a,b) {
//        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
//        return result * sortOrder;
//    }
//}
//
//function dynamicSortMultiple() {
//    /*
//     * save the arguments object as it will be overwritten
//     * note that arguments object is an array-like object
//     * consisting of the names of the properties to sort by
//     */
//    var props = arguments;
//    return function (obj1, obj2) {
//        var i = 0, result = 0, numberOfProperties = props.length;
//        /* try getting a different result from 0 (equal)
//         * as long as we have extra properties to compare
//         */
//        while(result === 0 && i < numberOfProperties) {
//            result = dynamicSort(props[i])(obj1, obj2);
//            i++;
//        }
//        return result;
//    }
//}
//
//function RandomNum(min, max) {
//  return roundToTwo(Math.random() * (max - min + 1)) + min;
//}
//
//function roundToTwo(num) {
//    return +(Math.round(num + "e+2")  + "e-2");
//}
//
//function get_costchange(id, tc_over){
//   var actual_costchange = {'ID2100':-0.333333333333334,'ID6576':0.666666666666666,'ID7163':2.705};
//
//    if(id in actual_costchange){
//        return actual_costchange[id];
//    }else{
//        return tc_over ? RandomNum(-2,0):RandomNum(0,2);
//    }
//}