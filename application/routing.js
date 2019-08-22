//Configuring our routes
projectCostByte.config(function($stateProvider, $urlRouterProvider) {

  //After the application got compiled if we dont give any url by default it takes this url
  $urlRouterProvider.otherwise("/login");

  $stateProvider
    .state('login', {
      cache: false,
      url: "/login",
      templateUrl: "application/login/view/login.html",
      controller: "LoginCtrl"
    })
    .state('forgotPw', {
      cache: false,
      url: "/forgotPw",
      templateUrl: "application/login/view/forgotPw.html",
      controller: "forgotPwCtrl"
    })
    .state('enterCode', {
      cache: false,
      url: "/enterCode",
      templateUrl: "application/login/view/enter-code.html"
    })
    .state('setPassword', {
      cache: false,
      url: "/setPassword",
      templateUrl: "application/login/view/set-password.html"
    })
    .state('app', {
      cache: false,
      abstract: true,
      templateUrl: "application/core/app-menu/view/AppMenu.html",
      controller: "AppMenuCtrl"
    })
    .state('app.health-tracker-tab', {
      cache: false,
      url: "/health-tracker-tab",
      abstract: true,
      templateUrl: "application/health-tracker/view/health-tracker-tab.html",
      // controller: "SummaryCtrl"
    })
    // .state('app.health-tracker-tab.healthTracker', {
    //     cache: false,
    //     url: "/healthtracker/overallcharts",
    //     templateUrl: "application/health-tracker/view/HealthTracker.html",
    //     controller: "HealthTrackerCtrl"
    // })

    .state('app.health-tracker-tab.healthTracker', {
      cache: false,
      url: "/sales/overallcharts",
      views: {
        'tab-Sales': {
          templateUrl: "application/health-tracker/view/HealthTracker.html",
          controller: "HealthTrackerCtrl"
        }
      }
    })
    .state('app.health-tracker-tab.healthTracker-labour', {
      cache: false,
      url: "/labour/overallcharts",
      views: {
        'tab-Labour': {
          templateUrl: "application/health-tracker/view/healthTrackerLabour.html",
          controller: "HealthTrackerCtrl"
        }
      }
    })
    .state('app.health-tracker-tab.healthTracker-cogs', {
      cache: false,
      url: "/cogs/overallcharts",
      views: {
        'tab-Cogs': {
          templateUrl: "application/health-tracker/view/healthTrackerCogs.html",
          controller: "HealthTrackerCtrl"
        }
      }
    })
    //

    .state('app.healthTrackerDetail', {
      cache: false,
      url: "/healthtrackerdetail",
      templateUrl: "application/health-tracker/view/HealthTrackerDetailView.html",
      controller: "HealthTrackerDetailCtrl",
      params: {
        chartType: null
      }
    })
    .state('app.settings', {
      cache: false,
      url: "/settings",
      templateUrl: "application/settings/view/SettingsView.html",
      controller: "SettingsCtrl",
      params: {
        chartType: null
      }
    })
    .state('app.fixedCosts', {
      cache: false,
      url: "/fixedCosts",
      templateUrl: "application/settings/view/fixedCostsView.html",
      controller: "FixedCostsCtrl",
      params: {
        chartType: null
      }
    })
    .state('app.fixedCostDetail', {
      cache: false,
      url: "/fixedCostsDetail/:id?name",
      templateUrl: "application/settings/view/fixedCostsDetailView.html",
      controller: "FixedCostDetailCtrl",
    })
    .state('app.laborCosts', {
      cache: false,
      url: "/laborCosts",
      templateUrl: "application/settings/view/laborCostsView.html",
      controller: "LaborCostsCtrl",
      params: {
        chartType: null
      }
    })
    .state('app.laborCostDetail', {
      cache: false,
      url: "/laborCostsDetail/:id?name",
      templateUrl: "application/settings/view/laborCostsDetailView.html",
      controller: "LaborCostsDetailCtrl",
    })
    .state('app.marginoptimizer', {
      cache: false,
      url: "/marginoptimizer",
      abstract: true,
      templateUrl: "application/costing-optimizer/view/marginoptimizer-tabs.html",
    })
    .state('app.marginoptimizer.Food', {
      url: '/Food',
      views: {
        'tab-Food': {
          templateUrl: 'application/costing-optimizer/view/food-tab.html',
        }
      }
    })
    .state('app.marginoptimizer.Liquor', {
      url: '/Liquor',
      views: {
        'tab-Liquor': {
          templateUrl: 'application/costing-optimizer/view/liquor-tab.html',
        }
      }
    })
    .state('app.marginoptimizersection', {
      cache: false,
      url: "/marginoptimizer/section/:section_id",
      templateUrl: "application/costing-optimizer/view/section.html",
    })
    .state('app.marginoptimizermenuitem', {
      cache: false,
      url: "/marginoptimizer/menuitem/:menuitem_id",
      templateUrl: "application/costing-optimizer/view/menuitem-detail.html",
    })
    .state('app.marginoptimizer2', {
      cache: false,
      url: "/marginoptimizer2",
      abstract: true,
      templateUrl: "application/margin-optimizer/view/marginoptimizer-tabs.html",
    })
    .state('app.marginoptimizer2.Food', {
      url: '/Food',
      views: {
        'tab-Food2': {
          templateUrl: 'application/margin-optimizer/view/food-tab.html',
        }
      }
    })
    .state('app.marginoptimizer2.Liquor', {
      url: '/Liquor',
      views: {
        'tab-Liquor2': {
          templateUrl: 'application/margin-optimizer/view/liquor-tab.html',
        }
      }
    })
    .state('app.marginoptimizersection2', {
      cache: false,
      url: "/marginoptimizer/section/:category/:menuType/:sectionName",
      templateUrl: "application/margin-optimizer/view/sectionScreen.html",
    })
    .state('app.marginoptimizermenuitem2', {
      cache: false,
      url: "/marginoptimizer/menuitem/:category/:menuType/:sectionName/:menuItem/:recipeId",
      templateUrl: "application/margin-optimizer/view/menuitemScreen.html",
    })
    .state('app.menuengineering', {
      cache: false,
      url: "/menuengineering",
      abstract: true,
      templateUrl: "application/menu-engineering/view/menuengineering-tabs.html",
    })
    .state('app.menuengineering.Food', {
      url: '/Food',
      views: {
        'tab-Food2': {
          templateUrl: 'application/menu-engineering/view/food-tab.html',
        }
      }
    })
    .state('app.menuengineering.Liquor', {
      url: '/Liquor',
      views: {
        'tab-Liquor2': {
          templateUrl: 'application/menu-engineering/view/liquor-tab.html',
        }
      }
    })
    .state('app.menuengineeringsection', {
      cache: false,
      url: "/menuengineering/section/:category/:menuType/:sectionName",
      templateUrl: "application/menu-engineering/view/sectionScreen.html",
    })
    .state('app.menuengineeringmenuitem', {
      cache: false,
      url: "/menuengineering/menuitem/:category/:menuType/:sectionName/:menuItem",
      templateUrl: "application/menu-engineering/view/menuitemScreen.html",
    })
    .state('app.MenuPerformanceoptimizer', {
      cache: false,
      url: "/MenuPerformanceoptimizer",
      abstract: true,
      templateUrl: "application/menuperformance-optimizer/view/menuperformanceoptimizer-tabs.html",
    })
    .state('app.MenuPerformanceoptimizer.Food', {
      url: '/Food',
      views: {
        'tab-Food': {
          templateUrl: 'application/menuperformance-optimizer/view/food-tab.html',
        }
      }
    })
    .state('app.MenuPerformanceoptimizer.Liquor', {
      url: '/Liquor',
      views: {
        'tab-Liquor': {
          templateUrl: 'application/menuperformance-optimizer/view/liquor-tab.html',
        }
      }
    })
    .state('app.MenuPerformanceoptimizersection', {
      cache: false,
      url: "/MenuPerformanceoptimizer/section/:section_id",
      templateUrl: "application/menuperformance-optimizer/view/section.html",
    })
    .state('app.MenuPerformanceoptimizermenuitem', {
      cache: false,
      url: "/MenuPerformanceoptimizer/menuitem/:menuitem_id",
      templateUrl: "application/menuperformance-optimizer/view/menuitem-detail.html",
    })
    // .state('app.laborOptimizer',{
    //     cache: false,
    //     url: "/laboroptimizer",
    //     abstract: false,
    //     templateUrl: "application/labor-optimizer/laborOptimizerView.html",
    //     controller: "LaborOptimizerCtrl",
    // })
    .state('app.laborOptimizer', {
      cache: false,
      url: "/laborOptimizer",
      abstract: true,
      templateUrl: "application/labor-optimizer/view/laborOptimizer-tabs.html",
    })
    .state('app.laborOptimizer.summary', {
      url: '/summary',
      views: {
        'labor-optimizer-summary': {
          templateUrl: 'application/labor-optimizer/view/summary-tab.html',
        }
      }
    })
    .state('app.laborOptimizer.role', {
      url: '/role',
      views: {
        'labor-optimizer-role': {
          templateUrl: 'application/labor-optimizer/view/role-tab.html',
        }
      }
    })
    .state('app.laborOptimizer.employee', {
      url: '/employee',
      views: {
        'labor-optimizer-employee': {
          templateUrl: 'application/labor-optimizer/view/employee-tab.html',
        }
      }
    })
    .state('app.pAndLCharts', {
      cache: false,
      url: "/pAndLCharts",
      abstract: true,
      templateUrl: "application/pAndL-charts/view/pandl-charts-tabs.html",
    })
    .state('app.pAndLCharts.sales', {
      url: '/sales',
      views: {
        'pAndL-charts-sales': {
          templateUrl: 'application/pAndL-charts/view/pandl-sales-tab.html',
        }
      }
    })
    .state('app.pAndLCharts.cost', {
      url: '/cost',
      views: {
        'pAndL-charts-cost': {
          templateUrl: 'application/pAndL-charts/view/pandl-cost-tab.html',
        }
      }
    })
    .state('app.pAndLCharts.cogs', {
      url: '/cogs',
      views: {
        'pAndL-charts-cogs': {
          templateUrl: 'application/pAndL-charts/view/pandl-cogs-tab.html',
        }
      }
    })
    .state('app.pAndLCharts.primecost', {
      url: '/primecost',
      views: {
        'pAndL-charts-primecost': {
          templateUrl: 'application/pAndL-charts/view/pandl-primecost-tab.html',
        }
      }
    })
    .state('app.pAndLCharts.profitafterprime', {
      url: '/profitafterprime',
      views: {
        'pAndL-charts-profitafterprime': {
          templateUrl: 'application/pAndL-charts/view/pandl-profitafterprime-tab.html',
        }
      }
    })
    .state('app.Purchaseoptimizer', {
      cache: false,
      url: "/Purchaseoptimizer",
      abstract: true,
      templateUrl: "application/purchase-optimizer/view/purchaseoptimizer-tabs.html",
    })
    .state('app.Purchaseoptimizer.Food', {
      url: '/Food',
      views: {
        'tab-Food': {
          templateUrl: 'application/purchase-optimizer/view/food-tab.html',
        }
      }
    })
    .state('app.Purchaseoptimizer.Liquor', {
      url: '/Liquor',
      views: {
        'tab-Liquor': {
          templateUrl: 'application/purchase-optimizer/view/liquor-tab.html',
        }
      }
    })
    .state('app.PurchaseoptimizerOrder', {
      url: '/PurchaseoptimizerOrder',
      templateUrl: 'application/purchase-optimizer/view/order-page.html',
      params: {
        order: null
      },
    })
    .state('app.plTracker', {
      cache: false,
      url: "/pltracker/overallcharts",
      templateUrl: "application/pl-tracker/view/PlTracker.html",
      controller: "PlTrackerCtrl",
    })
    .state('app.calendarRefresh', {
      cache: false,
      url: "/calender/refresh",
      templateUrl: "application/core/shared-components/date-picker/view/DatePickerRefreshView.html",
      controller: "DatePickerRefreshCtrl"
    })
    .state('app.wastage', {
      cache: false,
      url: "/wastage",
      templateUrl: "application/wastage/view/WastageView.html",
      controller: "WastageCtrl"
    })
    .state('app.promotionOptimizer', {
      cache: false,
      url: "/promotionOptimizer",
      templateUrl: "application/promotion-optimizer/view/PromotionOptimizer.html",

    })
    .state('app.promotionOptimizerpromotions', {
      cache: false,
      url: "/promotionOptimizerpromotions",
      templateUrl: "application/promotion-optimizer/view/AllPromotions.html",

    })
    .state('app.promotionOptimizercandidates', {
      cache: false,
      url: "/promotionOptimizercandidates",
      templateUrl: "application/promotion-optimizer/view/AllCandidates.html",

    })
    .state('app.wastageFoodDetail', {
      cache: false,
      url: "/wastageDetail/:id",
      templateUrl: "application/wastage/view/WastageDetail.html",
      controller: "WastageDetailCtrl"

    })
    .state('app.wastageLiquorDetail', {
      cache: false,
      url: "/wastageLiquorDetail/:id",
      templateUrl: "application/wastage/view/WastageLiquorDetail.html",
      controller: "WastageLiquorDetailCtrl"

    })
    .state('app.invoices', {
      cache: false,
      url: "/invoices",
      abstract: true,
      templateUrl: "application/invoice-tracking/view/invoices-tabs.html",
      controller: "DocumentSelectionCtrl"
    })

    .state('app.invoices.summary', {
      cache: false,
      url: "/summary",
      views: {
        'tab-invoicesummary': {
          templateUrl: "application/invoice-tracking/view/invoice-summary.html",
          // controller: "InvoiceSummaryCtrl"
        }
      }
    })
    .state('app.invoices.config', {
      cache: false,
      url: "/config",
      views: {
        'tab-config': {
          templateUrl: "application/invoice-tracking/view/invoice-config.html",
          controller: "InvoiceConfigCtrl"
        }
      },
      params: {
        inputParams: null
      }
    })
    .state('app.invoices.trackings', {
      cache: false,
      url: '/trackings',
      views: {
        'tab-tracking': {
          templateUrl: 'application/invoice-tracking/view/invoice-tracking.html',
          controller: 'InvoiceTrackingCtrl'
        }
      }
    })


    .state('app.invoices.detail', {
      url: '/tracking/:invoiceId/:supplier_id',
      views: {
        'tab-tracking': {
          templateUrl: 'application/invoice-tracking/view/invoice-details.html',
          controller: 'InvoiceDetailCtrl'
        }
      }
    })

    .state('app.uploads', {
      cache: false,
      url: '/uploads',
      templateUrl: 'application/invoice-tracking/view/invoice-uploads.html',
      controller: 'InvoiceUploadsCtrl'

    })

    .state('app.taskmanager', {
      cache: false,
      url: "/taskmanager",
      templateUrl: "application/task-manager/view/task-manager.html",
      controller: "taskmanagerCtrl"
    })

    // .state('app.inventoryTab', {
    //     cache: false,
    //     url: "/inventoryTab",
    //     templateUrl: "application/inventory-management/inventory-home.html",
    //     controller: "InventoryHomeCtrl as ctrl"
    // })
    .state('app.inventoryTool', {
      cache: false,
      url: "/inventoryTool",
      // abstract: true,
      templateUrl: "application/inventory-tool/inventory-tool.html",
      controller: "InventoryToolCtrl",
      // redirectTo: 'app.inventoryManager.drafts'
    })
    .state('app.recipeCostTracking', {
      cache: false,
      url: "/recipeCostTracking",
      // abstract: true,
      templateUrl: "application/recipeCostTracking/recipeCostTracking.html",
      controller: "RecipeCostTrackingCtrl",
      // redirectTo: 'app.inventoryManager.drafts'
    })
    .state('app.inventoryManager', {
      cache: false,
      url: "/inventoryManager",
      // abstract: true,
      templateUrl: "application/inventory-management/inventory-tabs.html",
      controller: "InventoryHomeCtrl1 as ctrl",
      // redirectTo: 'app.inventoryManager.drafts'
    })

    .state('app.invoiceManager', {
      cache: false,
      url: "/invoiceManager",
      // abstract: true,
      templateUrl: "application/supportTools/invoice-tabs.html",
      controller: "invoiceTabsCtrl",
      // redirectTo: 'app.inventoryManager.drafts'
    })

    .state('app.inventoryManager.submitted', {
      url: "/submitted",
      views: {
        'submitted-tab': {
          templateUrl: "templates/submitted.html",
          // controller: 'firstCtrl'
        }
      }
    })
    .state('app.invoiceManager.submitted', {
      url: "/submitted",
      views: {
        'invoice-submitted-tab': {
          templateUrl: "templates/invoice-submitted.html",
          // controller: 'firstCtrl'
        }
      }
    })
    .state('app.inventoryManager.drafts', {
      url: "/drafts",
      views: {
        'drafts-tab': {
          templateUrl: "templates/drafts.html",
          // controller: 'secondCtrl'
        }
      }
    })
    .state('app.invoiceManager.drafts', {
      url: "/drafts",
      views: {
        'invoice-drafts-tab': {
          templateUrl: "templates/invoice-drafts.html",
          // controller: 'secondCtrl'
        }
      }
    })

    .state('app.inventoryManager.config', {
      cache: false,
      url: "/config",
      views: {
        'config-tab': {
          templateUrl: 'application/inventory-management/directives/config-page/config-page.html',
          controller: 'configPageCtrl',
        }
      }
      // views: {
      //   'config-tab': {
      //     templateUrl: 'application/inventory-management/directives/config-page/config-page.html',
      //     controller: 'configPageCtrl',
      //   },
      //   'inactive': {
      //     templateUrl: 'application/inventory-management/inactive-items.html',
      //     controller: 'inactiveItems'
      //   },
      //   'mapped': {
      //     templateUrl: 'application/inventory-management/map-inventory.html',
      //     controller: 'mapInventory',
      //   }
      // }
    })

    .state('app.inventoryManager.config.inactiveItems', {
      cache: false,
      url: '/inactiveItems',
      views: {
        'tab-inactive': {
          templateUrl: 'application/inventory-management/inactive-items.html',
          // controller: 'InactiveItems'
        }
      }
    })
    //
    //
    // .state('app.inventoryManager.mapInventory', {
    //   // cache: false,
    //   url: "/mapInventory",
    //   views: {
    //       'mapped@config-tab': {
    //         templateUrl: 'application/inventory-management/map-inventory.html',
    //         controller: 'mapInventory',
    //       }
    //   }
    //   // views: {
    //   //   'config-tab@to-be-mapped-tab': {
    //   //     templateUrl: "templates/toBeMapped.html",
    //   //   },
    //   //   'config-tab@mapped-tab': {
    //   //     templateUrl: "templates/mapped.html",
    //   //   }
    //   // }
    // })


    // .state('app.inventoryManager.mapInventory.toBeMapped', {
    //   url: "/toBeMapped",
    //   views: {
    //     'to-be-mapped-tab': {
    //       templateUrl: "templates/toBeMapped.html",
    //       // controller: 'secondCtrl'
    //     }
    //   }
    // })


    // .state('app.inventoryManager.mapInventory.mapped', {
    //   url: "/mapped",
    //   views: {
    //     'mapped-tab': {
    //       templateUrl: "templates/toBeMapped.html",
    //       // controller: 'secondCtrl'
    //     }
    //   }
    // })

    // .state('app.inventoryManager.mapInventory', {
    //     cache: false,
    //     url: '/mapInventory',
    //     views: {
    //         'config-tab': {
    //             templateUrl: 'application/inventory-management/map-inventory.html',
    //             controller: 'mapInventory'
    //         }
    //     }
    // })



    // .state('app.inventoryManager.facts', {
    //   url: "/facts",
    //   views: {
    //     'config-tab': {
    //       templateUrl: "templates/facts.html"
    //     }
    //   }
    // })
    //
    //
    // .state('app.inventoryManager.facts2', {
    //   url: "/facts2",
    //   views: {
    //     'config-tab': {
    //       templateUrl: "templates/facts2.html"
    //     }
    //   }
    // })

    // .state('app.inventoryManager', {
    //     cache: false,
    //     url: "/inventoryManager",
    //     // abstract: true,
    //     templateUrl: "application/inventory-management/inventory-home.html",
    //     controller: "InventoryHomeCtrl as ctrl"
    // })
    // // .state('app.inventoryManager.submitted', {
    // //     url: "/submitted",
    // //     views: {
    // //       'submitted-tab': {
    // //         templateUrl: "application/inventory-management/inventory-home.html",
    // //         controller: 'InventoryHomeCtrl as ctrl'
    // //       }
    // //     }
    // // })
    // // .state('app.inventoryManager.draft', {
    // //     url: "/draft",
    // //     views: {
    // //       'drafts-tab': {
    // //         templateUrl: "application/inventory-management/inventory-home.html",
    // //         controller: 'InventoryHomeCtrl as ctrl'
    // //       }
    // //     }
    // // })
    //
    // .state('app.inventoryManager.config', {
    //     url: '/config',
    //     views: {
    //         'config-tab': {
    //             templateUrl: 'application/inventory-management/directives/config-page/config-page.html',
    //             controller: 'configPageCtrl'
    //         }
    //     }
    // })
    // .state('app.inventoryManager.mapInventory', {
    //     cache: false,
    //     url: '/mapInventory',
    //     views: {
    //         'config-tab': {
    //             templateUrl: 'application/inventory-management/map-inventory.html',
    //             controller: 'mapInventory'
    //         }
    //     }
    //     // url: "/mapInventory",
    //     // templateUrl: "application/inventory-management/map-inventory.html",
    //     // controller: "mapInventory"
    // })
    // .state('app.inventoryManager.inactiveItems', {
    //     cache: false,
    //     url: '/inactiveItems',
    //     views: {
    //         'config-tab': {
    //             templateUrl: 'application/inventory-management/inactive-items.html',
    //             controller: 'inactiveItems'
    //         }
    //     }
    //
    // })
    .state('app.inventoryListManager', {
      cache: false,
      url: "/inventoryListManager",
      templateUrl: "application/inventory-config/inventory-list-manager_new.html",
      controller: "InventoryListManagerCtrl"
    })

    .state('app.orgDashboard', {
      cache: false,
      url: "/orgDashboard",
      templateUrl: "application/org-dashboard/orgDashboardView.html",
      controller: "OrgDashboardManagerCtrl"
    })

    .state('app.operations', {
      cache: false,
      url: "/operations",
      templateUrl: "application/operations/operations.html",
      controller: "OperationsCtrl"
    })
    .state('app.reports', {
      cache: false,
      url: "/reports",
      templateUrl: "application/supportTools/Reports/reports.html",
      controller: "reportsCtrl"
    })
    .state('app.ordering', {
      cache: false,
      url: "/ordering",
      templateUrl: "application/ordering/ordering-home.html",
      controller: "OrderingHomeCtrl as ctrl"
    })
    .state('app.weekPriceChange', {
      cache: false,
      url: "/weekPriceChange",
      templateUrl: "application/supportTools/week-price-change/views/weekPriceChange.html",
      controller: "weekPriceChangeCtrl"
    })
    .state('app.invoiceEntry', {
      cache: false,
      url: "/invoiceEntry",
      templateUrl: "application/supportTools/invoice-entry/views/invoiceEntry.html",
      controller: "invoiceEntryCtrl"
    })
    .state('app.settingsManager', {
      cache: false,
      url: "/settingsManager",
      templateUrl: "application/settings-manager/landing view-view/landing.html",
    })
    .state('app.laborManager', {
      cache: false,
      url: "/laborManager",
      templateUrl: "application/settings-manager/labor-settings/labor-settings-main.html",
    })
    .state('app.payManager', {
      cache: false,
      url: "/payManager",
      templateUrl: "application/settings-manager/labor-settings/pay-manager.html",
    })
    .state('app.payManagerHistory', {
      cache: false,
      url: "/payManagerHistory/:userID/:userJobRolesID",
      templateUrl: "application/settings-manager/labor-settings/pay-history.html",
    })
    .state('app.userManager', {
      cache: false,
      url: "/userManager",
      templateUrl: "application/settings-manager/user-settings/user-list-main.html",
    })
    .state('app.userChangePw', {
      cache: false,
      url: "/userChangePw",
      templateUrl: "application/settings-manager/user-settings/user-changePassword.html",
    })
    .state('app.userDetails', {
      cache: false,
      url: "/userDetails/:userID",
      templateUrl: "application/settings-manager/user-settings/user-details.html",
    })
    .state('app.payment', {
      cache: false,
      url: "/payment",
      templateUrl: "application/settings-manager/payment-settings/payment.html",
      controller: "PaymentHomeCtrl"
    })
    .state('app.switchBusiness', {
      cache: false,
      url: "/business",
      templateUrl: "application/settings-manager/business-settings/business-list.html",
      controller: "BusinessSettingsCtrl"
    })
    .state('app.aboutusManager', {
      cache: false,
      url: "/aboutus",
      templateUrl: "application/about-us/aboutus.html",
      controller: "AboutusCtrl as ctrl"
    })
    .state('app.composeInventory', {
      cache: false,
      url: "/compose-inventory",
      params: {
        inventory: null,
        store_id: null,
        inventory_name: null,
        date_of_creation: null,
        group_by_field: null,
        draft_history: false,
        draft_history_key: null
      },
      templateUrl: "application/inventory-management/inventory-compose.html",
      controller: "InventoryComposeCtrl as ctrl"
    })
    .state('app.inventoryItems', {
      cache: false,
      url: "/inventoryItems",
      templateUrl: "application/inventory-management/inventory-items.html",
      controller: "inventoryItemsCtrl as ctrl"
    })
    .state('app.viewSubmittedInventory', {
      cache: false,
      url: "/view-submitted-inventory",
      params: {
        inventory: null,
        inventory_name: null,
        group_by_field: null
      },
      templateUrl: "application/inventory-management/inventory-view.html",
      controller: "InventoryViewCtrl as ctrl"
    })



    .state('app.composeOrdering', {
      cache: false,
      url: "/compose-ordering",
      params: {
        ordering: null,
        store_id: null,
        ordering_name: null,
        date_of_creation: null,
        group_by_field: null
      },
      templateUrl: "application/ordering/ordering-compose.html",
      controller: "OrderingComposeCtrl as ctrl"
    })
    .state('app.ordering.submitted', {
      url: "/ordering-submitted",
      views: {
        'ordering-submitted-tab': {
          templateUrl: "application/ordering/ordering-submitted.html",
          controller: 'orderingSubmittedCtrl'
        }
      }
    })
    .state('app.draftTabs', {
      cache: false,
      url: "/draftTabs",
      // views: {
      //   'draft-tab': {
      //     templateUrl: 'application/ordering/draft-tabs.html',
      //     controller: 'draftTabsPageCtrl',
      //   }
      // }
      params: {
        ordering: null,
        ordering_name: null,
        store_id: null,
        date_of_creation: null
      },
      templateUrl: "application/ordering/draft-tabs.html",
      controller: "draftTabsPageCtrl"
    })
    .state('app.viewSubmittedOrdering', {
      cache: false,
      url: "/view-submitted-ordering",
      params: {
        ordering: null,
        ordering_name: null
      },
      templateUrl: "application/ordering/ordering-view.html",
      controller: "OrderingViewCtrl as ctrl"
    })

    // .state('app.ordering.viewSubmittedOrdering', {
    //   cache: false,
    //   url: "/view-submitted-ordering",
    //   views: {
    //     'submitted-tab': {
    //       templateUrl: "application/ordering/ordering-view.html",
    //       controller: "OrderingViewCtrl as ctrl"
    //     }
    //   }
    // })
    .state('app.viewOrderCart', {
      cache: false,
      url: "/view-order-cart",
      params: {
        ordering: null,
        ordering_name: null
      },
      templateUrl: "application/ordering/cart-view.html",
      controller: "CartViewCtrl as ctrl"
    })

    .state('app.dashboard', {
      cache: false,
      url: "/dashboard",
      abstract: true,
      templateUrl: "application/task-manager/view/dashboard-tabs.html",
      // controller: "SummaryCtrl"
    })
    .state('app.dashboard.summary', {
      cache: false,
      url: "/summary",
      views: {
        'tab-summary': {
          templateUrl: "application/task-manager/view/summary.html",
          controller: "SummaryCtrl"
        }
      }
    })
    .state('app.dashboard.overview', {
      cache: false,
      url: "/overview",
      views: {
        'tab-overview': {
          templateUrl: "application/task-manager/view/overview.html",
          controller: "OverviewCtrl"
        }
      }
    })
    .state('app.dashboard.alerts', {
      url: '/alerts',
      views: {
        'tab-alerts': {
          templateUrl: 'application/task-manager/view/alerts.html',
          controller: 'alertsCtrl'
        }
      }
    })
    .state('app.dashboard.top10', {
      cache: false,
      url: "/top5",
      views: {
        'tab-top10': {
          templateUrl: "application/task-manager/view/top10.html",
          controller: "top10Ctrl"
        }
      }
    })
    .state('app.dashboard.tasks', {
      url: '/tasks',
      views: {
        'tab-tasks': {
          templateUrl: 'application/task-manager/view/tasks/tasks.html',
          //  controller: 'taskmanagerCtrl'
        }
      }
    })
    .state('app.purchaseOrders', {
      cache: false,
      url: "/taskmanager",
      templateUrl: "application/purchase-orders/view/purchase-orders.html",
      controller: "PurchaseOrdersCtrl"
    })
    .state('app.dashboard.trackers', {
      url: '/trackers',
      views: {
        'tab-trackers': {
          templateUrl: 'application/task-manager/view/trackers.html',
          controller: 'trackerCtrl'
        }
      }
    })
    .state('app.modManager', {
      cache: false,
      url: "/modManager",
      templateUrl: "application/mod-manager/view/mod-manager.html",
      controller: "ModmanagerCtrl"
    })
    .state('app.modDetail', {
      cache: false,
      url: "/modDetail/:modName/:modId/:modCost/:modToggle",
      templateUrl: "application/mod-manager/view/mod-detail.html",
      controller: "modDetailCtrl"
    })
    .state('app.prepManager', {
      cache: false,
      url: "/prepManager",
      templateUrl: "application/prep-manager/view/prep-manager.html",
      controller: "PrepmanagerCtrl"
    })
    .state('app.prepDetail', {
      cache: false,
      url: "/prepDetail/:prepName/:prepId/:prepCost/:prepToggle/:prepUnitCost/:yield_qty/:yield_unit",
      templateUrl: "application/prep-manager/view/prep-detail.html",
      controller: "prepDetailCtrl"
    })
    .state('app.purchaseOptimizer', {
      cache: false,
      url: "/purchaseOptimizer",
      templateUrl: "application/purchase-optimizer/view/PurchaseOptimizerView.html",
      controller: "PurchaseOptimizerCtrl",
      resolve: {
        purchaseData: function(PurchaseOptimizerService, $q) {
          var deferred = $q.defer();
          var returnHandler = function(purchaseDataValue) {
            if (angular.isDefined(purchaseDataValue)) {
              deferred.resolve(purchaseDataValue);
            }
          }
          PurchaseOptimizerService.fetchPurchaseData(returnHandler);
          return deferred.promise;
        }
      }
    })
        //new inventory manager
        // .state('app.inventoryManagerNew', {
        //   cache: false,
        //   url: "/inventoryManagerNew",
        //   // abstract: true,
        //   templateUrl: "application/inventory-management-new/inventory-tabs.html",
        //   controller: "InventoryHomeCtrl1 as ctrl",
        //   // redirectTo: 'app.inventoryManager.drafts'
        // })
    
        // .state('app.inventoryManagerNew.config', {
        //   cache: false,
        //   url: "/config-new",
        //   views: {
        //     'config-tab': {
        //       templateUrl: 'application/inventory-management-new/directives/config-page/config-page.html',
        //       controller: 'configPageCtrl',
        //     }
        //   }})
    
        //   .state('app.inventoryManagerNew.config.inactiveItems', {
        //     cache: false,
        //     url: '/inactiveItems-new',
        //     views: {
        //         'tab-inactive': {
        //             templateUrl: 'application/inventory-management-new/inactive-items.html',
        //             // controller: 'InactiveItems'
        //         }
        //     }
        // })
    
        // .state('app.newComposeInventory', {
        //   cache: false,
        //   url: "/compose-inventory-new",
        //   params: {
        //     inventory: null,
        //     store_id: null,
        //     inventory_name: null,
        //     date_of_creation: null,
        //     group_by_field: null
        //   },
        //   templateUrl: "application/inventory-management-new/inventory-compose.html",
        //   controller: "InventoryComposeNewCtrl as ctrl"
        // })
    
        // .state('app.inventoryItemsNew', {
        //   cache: false,
        //   url: "/inventoryItems-new",
        //   templateUrl: "application/inventory-management-new/inventory-items.html",
        //   controller: "inventoryItemsCtrl as ctrl",
        //   params: {
        //     categoryData :{}
        //   }
        // })
        // .state('app.viewSubmittedInventoryNew', {
        //   cache: false,
        //   url: "/view-submitted-inventory-new",
        //   params: {
        //     inventory: null,
        //     inventory_name: null,
        //     group_by_field: null
        //   },
        //   templateUrl: "application/inventory-management-new/inventory-view.html",
        //   controller: "InventoryViewCtrl as ctrl"
        // })
    
        // .state('app.inventoryManagerNew.submitted', {
        //   url: "/submitted",
        //   views: {
        //     'submitted-tab': {
        //       templateUrl: "templates/submitted.html",
        //       // controller: 'firstCtrl'
        //     }
        //   }
        // })
    
    
        .state('app.newInventoryManager.drafts', {
          url: "/drafts",
          views: {
            'drafts-tab': {
              templateUrl: "templates/drafts.html",
              // controller: 'secondCtrl'
            }
          }
        });

  // $urlRouterProvider.when('/inventoryManager', '/inventoryManager/first')


})
