imsApp = angular.module('imsApp', ['ui.materialize']);


imsApp.controller('indexController', ['$scope', '$http', function ($scope, $http) {
        $scope.pages = ['login.html', 'student.html', 'admin.html'];
        $scope.current = $scope.pages[2];
        $scope.preload =
                {
                    allCountries: []
                };
        $scope.predicates =
                {
                    nationality: 0,
                    gender: '0',
                    status: '0'
                };
        $scope.loadAllCountries = function ()
        {
            if ($scope.preload.allCountries.length === 0)
            {
                $http({method: 'GET', url: 'http://localhost:8080/country/all'})
                        .then(function (response)
                        {
                            $scope.preload.allCountries = response.data.data;
                        }, function (response) {});
            }
        };
    }]);


imsApp.controller('adminController', ['$scope', '$http', function ($scope, $http) {
        $scope.renderCountries = function ()
        {
            $scope.loadAllCountries();
        };
    }]);