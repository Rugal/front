imsApp = angular.module('imsApp', []);


imsApp.controller('indexController', ['$scope', '$http', function ($scope, $http) {
        $scope.student = 'student.html';
        $scope.admin = 'admin.html';
        $scope.login = 'login.html';
        $scope.current = $scope.admin;
    }]);


imsApp.controller('adminController', ['$scope', '$http', function ($scope, $http) {
        var rest = this;
        rest.responsebody = [];
        $scope.loadAllCountries = function ()
        {
            $http({method: 'GET', url: 'http://localhost:8080/country/all'})
                    .then(function (response)
                    {
                        rest.responsebody = response.data;
                        console.log(rest.responsebody);
                    }, function (response)
                    {
                    });
        };
    }]);