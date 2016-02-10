imsApp = angular.module('imsApp', []);


imsApp.controller('indexController', ['$scope', function ($scope) {
        $scope.student='student.html';
        $scope.admin='admin.html';
        $scope.login='login.html';
        $scope.current=$scope.login;
    }]);