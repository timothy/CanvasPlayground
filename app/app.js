'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.view3',
    'myApp.view4',
    'myApp.view5',
    'myApp.view6',
    'myApp.version'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/view1'});
}]).service('usage', [function () {
    /**
     * Data to use to populate graph - shows peek usage of a coffee shop
     */
    return {
        "coffeeShop": [
            {
                "date": 1490155200000,
                "data": [
                    {
                        "time": 701,
                        "usage": 8000
                    },
                    {
                        "time": 801,
                        "usage": 7500
                    },
                    {
                        "time": 901,
                        "usage": 7000
                    },
                    {
                        "time": 1001,
                        "usage": 2000
                    },
                    {
                        "time": 1101,
                        "usage": 4000
                    },
                    {
                        "time": 1201,
                        "usage": 3000
                    },
                    {
                        "time": 1301,
                        "usage": 5000
                    },
                    {
                        "time": 1401,
                        "usage": 9000
                    },
                    {
                        "time": 1501,
                        "usage": 8000
                    },
                    {
                        "time": 1601,
                        "usage": 7500
                    },
                    {
                        "time": 1701,
                        "usage": 7000
                    },
                    {
                        "time": 1801,
                        "usage": 2000
                    },
                    {
                        "time": 1901,
                        "usage": 4000
                    },
                    {
                        "time": 2001,
                        "usage": 3000
                    },
                    {
                        "time": 2101,
                        "usage": 5000
                    },
                    {
                        "time": 2201,
                        "usage": 9000
                    }
                ]
            },
            {
                "date": 1490241600000,
                "data": [
                    {
                        "time": 902,
                        "usage": 1000
                    },
                    {
                        "time": 1002,
                        "usage": 2000
                    },
                    {
                        "time": 1102,
                        "usage": 3000
                    },
                    {
                        "time": 1202,
                        "usage": 4000
                    },
                    {
                        "time": 1302,
                        "usage": 5000
                    },
                    {
                        "time": 1402,
                        "usage": 6000
                    },
                    {
                        "time": 1502,
                        "usage": 7000
                    },
                    {
                        "time": 1602,
                        "usage": 8000
                    }
                ]
            },
            {
                "date": 1490328000000,
                "data": [
                    {
                        "time": 903,
                        "usage": 1000
                    },
                    {
                        "time": 1003,
                        "usage": 2000
                    },
                    {
                        "time": 1103,
                        "usage": 3000
                    },
                    {
                        "time": 1203,
                        "usage": 4000
                    },
                    {
                        "time": 1303,
                        "usage": 5000
                    },
                    {
                        "time": 1403,
                        "usage": 6000
                    },
                    {
                        "time": 1503,
                        "usage": 7000
                    },
                    {
                        "time": 1603,
                        "usage": 8000
                    }
                ]
            },
            {
                "date": 1490414400000,
                "data": [
                    {
                        "time": 904,
                        "usage": 1000
                    },
                    {
                        "time": 1004,
                        "usage": 2000
                    },
                    {
                        "time": 1104,
                        "usage": 3000
                    },
                    {
                        "time": 1204,
                        "usage": 4000
                    },
                    {
                        "time": 1304,
                        "usage": 5000
                    },
                    {
                        "time": 1404,
                        "usage": 6000
                    },
                    {
                        "time": 1504,
                        "usage": 7000
                    },
                    {
                        "time": 1604,
                        "usage": 8000
                    }
                ]
            }
        ]
    };

}]);
